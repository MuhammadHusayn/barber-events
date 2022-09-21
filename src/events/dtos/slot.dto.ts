import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class Slot {
    @ApiProperty({
        description: 'The total size of a slot',
    })
    @Expose()
    available: number;

    @ApiProperty({
        description: 'The number of free places available',
    })
    @Expose()
    remains: number;

    @ApiProperty({
        description: 'DateTime when slot begins. This should be chosen for booking',
    })
    @Expose()
    dateTime: string;

    @Exclude()
    eventId: number;
}
