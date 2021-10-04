import { ApiProperty } from "@nestjs/swagger";
import { Status } from '../enums/status.enum';

export class DockerResponse {
    @ApiProperty()
    public status: Status;
    @ApiProperty()
    public url: string;
    @ApiProperty()
    public error?: string;
}