import { Injectable } from '@nestjs/common';
import { LogDAO } from 'src/persistence/dao/log-dao.service';
import { Log } from '../../persistence/schema/log.interface';
import { LogDTO } from '../../model/log.dto';

@Injectable()
export class LogService {
    constructor(
        private readonly logDao: LogDAO
    ) { }

    async save(log: LogDTO): Promise<Log> {
        return this.logDao.create(log);
    }
}
