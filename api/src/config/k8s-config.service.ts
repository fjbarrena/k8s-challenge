import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import {
  PROXY_IP,
  PROXY_PORT,
  CLUSTER_NAMESPACE,
} from './constants/constants';

@Injectable()
export class K8sConfigService {
  constructor(private readonly configService: ConfigService) {}

  public getProxyIP(): string {
    return this.configService.get<string>(PROXY_IP);
  }

  public getProxyPort(): string {
    return this.configService.get<string>(PROXY_PORT);
  }

  public getNamespace(): string {
    return this.configService.get<string>(CLUSTER_NAMESPACE);
  }
}
