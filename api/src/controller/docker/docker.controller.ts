import { Controller, HttpStatus, Param, Post, Headers, Body, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GenericController } from '../generic.controller';
import { LogService } from '../../core/service/log.service';
import { DockerResponse } from '../../model/docker-response.dto';
import { Status } from '../../enums/status.enum';
import { KubernetesService } from '../../kubernetes/kubernetes.service';
import { DockerStopRequestDTO } from '../../model/docker-stop-request.dto';
import * as crypto from 'crypto';
import { Response } from 'express';
import { K8sConfigService } from '../../config/k8s-config.service';

@Controller('')
@ApiTags('')
@ApiBearerAuth()
export class DockerController extends GenericController {
    private deployed : DockerResponse[] = [];
    constructor(
        private readonly logService: LogService,
        private readonly kubernetesService: KubernetesService,
        private readonly k8sConfigService: K8sConfigService) {
        super();
    }

    @Post('/start')
    @ApiResponse({ status: 200, description: 'List of the criteria configured by the user', type: DockerResponse})
    @ApiResponse({ status: 204, description: 'No records found', type: DockerResponse})
    @ApiResponse({ status: 500, description: 'Generic error'})
    async start(
        @Headers() headers
    ): Promise<DockerResponse> {
        let response: DockerResponse = new DockerResponse();
        
        response.guid = crypto.randomBytes(16).toString('hex');
        response.status = Status.STARTING;
        response.url = '';
        response.deploymentName = '';
        response.serviceName = '';

        this.deployed.push(response);

        const res = await this.kubernetesService.start();
        
        // Remove old item from deployed array
        // Well, here probably a Map is a better structure (more efficient), but I'm a bit lazy now ;)
        this.deployed = this.deployed.filter(function( obj ) {
            return obj.guid !== response.guid;
        });

        response.status = Status.RUNNING;
        response.url = `http://${this.k8sConfigService.getKubernetesMasterNodeIp()}:${res.nodePort}`;
        response.deploymentName = res.deploymentName;
        response.serviceName = res.serviceName;
        
        // Push the new item
        this.deployed.push(response);
        
        await this.logService.save({
            container_id: res.deploymentName,
            start_time: new Date(),
            stop_time: null
        });

        return response;
    }

    @Post('/stop')
    @ApiResponse({ status: 200, description: 'List of the companies waiting for decision by the user'})
    @ApiResponse({ status: 204, description: 'No records found'})
    @ApiResponse({ status: 500, description: 'Generic error'})
    async stop(@Body() stopRequest: DockerStopRequestDTO, @Res() res: Response): Promise<DockerResponse> {
        let itemToErase: DockerResponse[] = this.deployed.filter((obj: DockerResponse) => {
            return obj.deploymentName === stopRequest.deploymentName &&
                   obj.serviceName === stopRequest.serviceName;
        });

        if(itemToErase.length === 1) {
            itemToErase[0].status = Status.STOPPING;

            // Remove old item from array
            this.deployed = this.deployed.filter((obj: DockerResponse) => {
                return obj.deploymentName !== stopRequest.deploymentName &&
                    obj.serviceName !== stopRequest.serviceName;
            });

            // And put the new one with the new state
            this.deployed.push(itemToErase[0]);

            try {
                await this.kubernetesService.delete(stopRequest.deploymentName, stopRequest.serviceName);

                // Remove old item from array
                this.deployed = this.deployed.filter((obj: DockerResponse) => {
                    return obj.deploymentName !== stopRequest.deploymentName &&
                        obj.serviceName !== stopRequest.serviceName;
                });

                // Update
                itemToErase[0].status = Status.OFF;
                itemToErase[0].url = "";

                // And put again into deployed array
                this.deployed.push(itemToErase[0]);

                // Update stop data in database
                await this.logService.updateStopDate(stopRequest.deploymentName);

                return itemToErase[0];
            } catch(ex) {
                // Remove old item from array
                this.deployed = this.deployed.filter((obj: DockerResponse) => {
                    return obj.deploymentName !== stopRequest.deploymentName &&
                        obj.serviceName !== stopRequest.serviceName;
                });

                // Update
                itemToErase[0].status = Status.ERROR;
                itemToErase[0].error = ex;

                // And put again into deployed array
                this.deployed.push(itemToErase[0]);

                return itemToErase[0];
            }
        } else {
            // Is an error, we're trying to delete a non existing deployment
            // return error code (precondition failed)
            const error = new DockerResponse();
            error.deploymentName = stopRequest.deploymentName;
            error.serviceName = stopRequest.serviceName;
            error.status = Status.ERROR;
            error.error = "Specified deployment or service does not exists in the cluster"
            error.guid = "-1";
            error.url = "";

            res.status(HttpStatus.PRECONDITION_FAILED).json(error);
        }
    }

    @Post('/status')
    @ApiResponse({ status: 200, description: 'List of the companies moved to first meeting by the user'})
    @ApiResponse({ status: 204, description: 'No records found'})
    @ApiResponse({ status: 500, description: 'Generic error'})
    async status(@Param('userId') userId): Promise<any[]> {
        return this.deployed;
    }
}
