import { ApiProperty } from "@nestjs/swagger";

export class DockerStopRequestDTO {
    @ApiProperty()
    public deploymentName: string;
    @ApiProperty()
    public serviceName: string;
}