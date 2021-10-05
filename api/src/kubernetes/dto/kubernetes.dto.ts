export class K8sDto {
    deploymentName: string;
    name: string;
    version: string;
    organization: string;
    namespace: string;
    predictImage: string;
    predictCommand: string;
    trainImage: string;
    trainCommand: string;
    onlineTrainImage: string;
    onlineTrainCommand: string;
    minioVariables: string;
    modelType: string;
    regsecret: string;

    constructor(
                deploymentName?: string,
                name?: string,
                version?: string,
                organization?: string,
                namespace?: string,
                predictImage?: string,
                predictCommand?: string,
                trainImage?: string,
                trainCommand?: string,
                onlineTrainImage?: string,
                onlineTrainCommand?: string,
                minioVariables?: string,
                modelType?: string,
                regsecret?: string) {
        this.deploymentName = deploymentName;
        this.name = name;
        this.version = version;
        this.organization = organization;
        this.namespace = namespace;
        this.predictImage = predictImage;
        this.predictCommand = predictCommand;
        this.trainImage = trainImage;
        this.trainCommand = trainCommand;
        this.onlineTrainImage = onlineTrainImage;
        this.onlineTrainCommand = onlineTrainCommand;
        this.minioVariables = minioVariables;
        this.modelType = modelType;
        this.regsecret = regsecret;
    }
}
