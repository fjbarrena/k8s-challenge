import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as crypto from 'crypto';
import { K8sConfigService } from 'src/config/k8s-config.service';

import {
  KubeConfig,
  AppsV1Api,
  CoreV1Api,
  NetworkingV1beta1Api,
  BatchV1beta1Api,
  V1beta1CronJobList,
  V1beta1CronJob,
  V1Status,
  RbacAuthorizationV1Api,
  V1Role,
  V1ServiceAccount,
  V1RoleBinding,
  V1Namespace,
  V1Secret } from '@kubernetes/client-node';

@Injectable()
export class KubernetesService implements OnModuleInit {

  private kubeConf: KubeConfig;
  private appsV1Api: AppsV1Api;
  private coreV1Api: CoreV1Api;
  private batchApi: BatchV1beta1Api;
  private networkingV1beta1Api: NetworkingV1beta1Api;
  private namespace: string;

  constructor(
    private readonly k8sConfigService: K8sConfigService
  ) { }

  async onModuleInit() {
    this.kubeConf = new KubeConfig();
    this.kubeConf.loadFromFile("./kube/kube-config");
    console.log(this.kubeConf.getCurrentContext());
    this.appsV1Api = this.kubeConf.makeApiClient(AppsV1Api);
    this.coreV1Api = this.kubeConf.makeApiClient(CoreV1Api);
    this.batchApi = this.kubeConf.makeApiClient(BatchV1beta1Api);
    this.networkingV1beta1Api = this.kubeConf.makeApiClient(NetworkingV1beta1Api)
    this.namespace = this.k8sConfigService.getNamespace();

    const existsNamespace = await this.namespaceExists(this.namespace);
    
    if(!existsNamespace) {
        Logger.log(`Namespace ${this.namespace} does not exist. Creating it...`);
        await this.createNamespace(this.namespace);
    }
  }

  public async start(): Promise<any>  {    
    let specs: any;
    let response = {
        deploymentName: "",
        deploymentUid: "",
        serviceName: "",
        serviceUid: "",
        nodePort: -1
    }

    try {
      const yamlDeployment = yaml.load(fs.readFileSync('./templates/k8s-deployment.yaml', 'utf8'));
      specs = JSON.stringify(yamlDeployment, null, 2).replace("#RANDOMIZE", crypto.randomBytes(6).toString('hex'));
      
      let res = await this.appsV1Api.createNamespacedDeployment(this.namespace, JSON.parse(specs));
      
      response.deploymentName = res.body.metadata.name;
      response.deploymentUid = res.body.metadata.uid;
    } catch(e) {
      Logger.error('Create deployment failure', e, KubernetesService.name);
      Logger.log(e);
      throw e;
    }

    try {
      const yamlService = yaml.load(fs.readFileSync('./templates/k8s-service.yaml', 'utf8'));
      specs = JSON.stringify(yamlService, null, 2).replace("#RANDOMIZE", crypto.randomBytes(6).toString('hex'));

      let res = await this.coreV1Api.createNamespacedService(this.namespace, JSON.parse(specs));
      
      response.serviceName = res.body.metadata.name;
      response.serviceUid = res.body.metadata.uid;
      response.nodePort = res.body.spec.ports[0].nodePort;
    } catch(e) {
      Logger.error('Create service failure', e, KubernetesService.name);
      throw e;
    }

    return response;
  }

  public async stop(deploymentName: string) {
    const res = await this.appsV1Api.readNamespacedDeployment(deploymentName, this.namespace);
    let deployment = res.body;
    deployment.spec.replicas = 0;
    await this.appsV1Api.replaceNamespacedDeployment(deploymentName, this.namespace, deployment);
  }

  public async delete(deploymentName: string, serviceName: string) {
    await this.stop(deploymentName);
    await this.appsV1Api.deleteNamespacedDeployment(deploymentName, this.namespace);
    await this.coreV1Api.deleteNamespacedService(serviceName, this.namespace);
  }

  public async namespaceExists(namespace: string): Promise<boolean> {
    try {
      const {body} = await this.coreV1Api.listNamespace();
      return body.items.some(item => item.metadata.name === namespace);
    } catch(ex) {
      console.log(ex);
    }
  }

  public async createNamespace(namespace: string): Promise<any> {
    if(await this.namespaceExists(namespace))
      return;

    const body: V1Namespace = {
      apiVersion:"v1",
      kind:"Namespace",
      metadata:{
         name: namespace
      }
    };
    
    await this.coreV1Api.createNamespace(body);
  }
}
