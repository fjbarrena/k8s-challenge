import { Module } from '@nestjs/common';
import { PersistenceModule } from './persistence/persistence.module';
import { DockerController } from './controller/docker/docker.controller';
import { LogDAO } from './persistence/dao/log-dao.service';
import { LogService } from './core/service/log.service';
import { logProviders } from './persistence/provider/log.provider';

@Module({
  imports: [
    PersistenceModule
  ],
  controllers: [
    // Rest layer
    DockerController
  ],
  providers: [
    // Core layer
    LogService,
    ...logProviders,
    
    // Data Access layer
    LogDAO 
  ],
})
export class AppModule {}
