import { Connection } from 'mongoose';
import { LogSchema } from '../schema/log.schema';

export const logProviders = [
  {
    provide: 'LOG_MODEL',
    useFactory: (connection: Connection) => connection.model('Log', LogSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];