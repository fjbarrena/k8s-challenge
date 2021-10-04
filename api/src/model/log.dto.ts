import { ApiProperty } from "@nestjs/swagger";

export class LogDTO {
    @ApiProperty()
    public container_id: string;
    @ApiProperty()
    public start_time: Date;
    @ApiProperty()
    public stop_time: Date;
}