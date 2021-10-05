import { Module, Global } from '@nestjs/common';
import { K8sConfigService } from './k8s-config.service';

@Module({
  providers: [
    K8sConfigService,
  ],
  exports: [
    K8sConfigService
  ],
})
@Global()
export class CustomConfigModule {}
