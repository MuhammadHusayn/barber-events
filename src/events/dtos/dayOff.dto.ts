import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class DayOff {
    @ApiProperty()
    @Expose()
    id: number;

    @ApiProperty()
    @Expose()
    name: string;

    @ApiProperty()
    @Expose()
    date: string;

    @ApiProperty()
    @Expose()
    createdAt: string;

    @ApiProperty()
    @Expose()
    description: string;
}
