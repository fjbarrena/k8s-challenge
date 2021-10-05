import { ApiProperty } from "@nestjs/swagger";
import { Status } from '../enums/status.enum';

export class DockerResponse {
    @ApiProperty()
    public guid: string;
    @ApiProperty()
    public status: Status;
    @ApiProperty()
    public url: string;
    @ApiProperty()
    public error?: string;
    @ApiProperty()
    public deploymentName?: string;
    @ApiProperty()
    public serviceName?: string;
}