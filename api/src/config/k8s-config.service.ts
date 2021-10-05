import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import {
  CLUSTER_NAMESPACE, KUBERNETES_MASTER_NODE_ID,
} from './constants/constants';

@Injectable()
export class K8sConfigService {
  constructor(private readonly configService: ConfigService) {}

  public getNamespace(): string {
    return this.configService.get<string>(CLUSTER_NAMESPACE);
  }

  public getKubernetesMasterNodeIp(): string {
    return this.configService.get<string>(KUBERNETES_MASTER_NODE_ID);
  }
}
