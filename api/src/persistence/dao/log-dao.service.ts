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
}
