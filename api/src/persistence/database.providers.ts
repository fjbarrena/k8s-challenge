import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> => {
      console.log(`Connecting to mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_PATH}`);
      return mongoose.connect(`mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_PATH}`, 
      {
        auth: {
          username: process.env.MONGO_USERNAME,
          password: process.env.MONGO_PASSWORD
        }
      })
    }
  },
];