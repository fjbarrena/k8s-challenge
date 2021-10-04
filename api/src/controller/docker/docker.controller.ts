import { Controller, Get, HttpStatus, Param, Post, Headers } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GenericController } from '../generic.controller';
import { LogService } from '../../core/service/log.service';
import { DockerResponse } from '../../model/docker-response.dto';
import { Log } from 'src/persistence/schema/log.interface';
import { Status } from '../../enums/status.enum';


@Controller('')
@ApiTags('')
@ApiBearerAuth()
export class DockerController extends GenericController {
    constructor(private readonly logService: LogService) {
        super();
    }

    @Post('/start')
    @ApiResponse({ status: 200, description: 'List of the criteria configured by the user', type: DockerResponse})
    @ApiResponse({ status: 204, description: 'No records found', type: DockerResponse})
    @ApiResponse({ status: 500, description: 'Generic error'})
    async start(
        @Headers() headers
    ): Promise<DockerResponse> {
        const result: Log = await this.logService.save({
            container_id: 'random',
            start_time: new Date(),
            stop_time: new Date()
        });

        let response: DockerResponse = new DockerResponse();
        
        response.status = Status.RUNNING;
        response.url = "https://tuputamadre.com";
        
        return response;
    }

    @Post('/stop')
    @ApiParam({name: 'userId', required: true, description: 'User UUID'})
    @ApiResponse({ status: 200, description: 'List of the companies waiting for decision by the user'})
    @ApiResponse({ status: 204, description: 'No records found'})
    @ApiResponse({ status: 500, description: 'Generic error'})
    async getCompaniesWaitingForDecision(@Param('userId') userId): Promise<any[]> {
        // STUB
        return [];
    }

    @Post('/status')
    @ApiParam({name: 'userId', required: true, description: 'User UUID'})
    @ApiResponse({ status: 200, description: 'List of the companies moved to first meeting by the user'})
    @ApiResponse({ status: 204, description: 'No records found'})
    @ApiResponse({ status: 500, description: 'Generic error'})
    async getCompaniesMovedToFirstMeeting(@Param('userId') userId): Promise<any[]> {
        // STUB
        return [];
    }
}
