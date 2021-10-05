import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Log } from '../schema/log.interface';
import { LogDTO } from '../../model/log.dto';

@Injectable()
export class LogDAO {
    constructor(
        @Inject('LOG_MODEL') private readonly logModel: Model<Log>
    ) { }

    async create(newLog: LogDTO): Promise<Log> {
        const instance = new this.logModel(newLog);
        
        return instance.save();
    }
    
    async findAll(): Promise<Log[]> {
        return this.logModel.find().exec();
    }

    async findByContainerId(containerId: string): Promise<Log> {
        const query = { 'container_id': containerId };
        let res = await this.logModel.findOne(query);

        return res;
    }

    async updateStopDate(containerId: string) {
        let item: Log = await this.findByContainerId(containerId);
        let updatedItem: LogDTO = new LogDTO();

        updatedItem.container_id = item.container_id;
        updatedItem.start_time = item.start_time;
        updatedItem.stop_time = new Date();

        const query = { 'container_id': containerId };
        await this.logModel.findOneAndUpdate(query, updatedItem);
    }
}
