import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class BreakTime {
    @ApiProperty()
    @Expose()
    id: number;

    @ApiProperty()
    @Expose()
    end: string;

    @ApiProperty()
    @Expose()
    name: string;

    @ApiProperty()
    @Expose()
    start: string;

    @ApiProperty()
    @Expose()
    createdAt: string;

    @ApiProperty()
    @Expose()
    description: string;
}
