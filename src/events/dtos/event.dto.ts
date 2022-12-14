import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BreakTime } from './breakTime.dto';
import { DayOff } from './dayOff.dto';
import { Slot } from './slot.dto';

export class EventDto {
    @ApiProperty({
        description: 'Event ID',
    })
    @Expose()
    id: number;

    @ApiProperty()
    @Expose()
    name: string;

    @ApiProperty()
    @Expose()
    description: string;

    @ApiProperty({
        description: 'The number of minutes that every slot of an event lasts',
    })
    @Expose()
    slotDuration: number;

    @ApiProperty({
        description: 'The maximum amount of users that a slot of an event can be booked',
    })
    @Expose()
    maxUserCountPerSlot: number;

    @ApiProperty({
        description: 'The auto break minute after each slot',
    })
    @Expose()
    breakTimeAfterSlot: number;

    @ApiProperty({
        description: 'The start time of a working day',
    })
    @Expose()
    startHour: string;

    @ApiProperty({
        description: 'The end time of a working day',
    })
    @Expose()
    endHour: string;

    @ApiProperty({
        description: 'The start date of an event',
    })
    @Expose()
    startDate: string;

    @ApiProperty({
        description: 'The end date of an event',
    })
    @Expose()
    endDate: string;

    @ApiProperty()
    @Expose()
    createdAt: string;

    @ApiProperty({
        description: 'The number of minutes to the start of an event from now',
    })
    @Expose()
    timeLeft: number;

    @ApiProperty({
        description: 'The total number of days that event has, excluding Weekend and DayOffs',
    })
    @Expose()
    availableEventDays: number;

    @ApiProperty({
        description: 'The total number of days that a user can book for an event',
    })
    @Expose()
    availableBookingDays: number;

    @ApiProperty({
        type: [DayOff],
        description: 'The days when a barber does not work',
    })
    @Expose()
    dayOffs: DayOff[];

    @ApiProperty({
        type: [BreakTime],
        description: 'The time intervals when a barber takes a break',
    })
    @Expose()
    breakTimes: BreakTime[];

    @ApiProperty({
        type: [Slot],
        description: 'The slots that are availabe based on the params of an event',
    })
    @Expose()
    slots: Slot[];
}
