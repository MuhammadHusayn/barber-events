import { BreakTime } from './entities/breakTime.entity';
import { EventsRepository } from './events.repository';
import { DayOff } from './entities/dayOff.entity';
import { Event } from './entities/event.entity';
import { Injectable } from '@nestjs/common';
import { Slot } from './dtos/slot.dto';
import {
    differenceInBusinessDays,
    minutesToMilliseconds,
    differenceInMinutes,
    eachDayOfInterval,
    addBusinessDays,
    compareAsc,
    isWeekend,
    isPast,
    format,
} from 'date-fns';

@Injectable()
export class EventsHelperService {
    constructor(private readonly _eventsRepo: EventsRepository) {}

    async getAvailableEventDays(event: Event, dayOffs: DayOff[]): Promise<number> {
        const currentDate = new Date();
        const eventEndDate = new Date(event.endDate);
        let eventStartDate = new Date(event.startDate);

        // check events already started or not
        // if already started, set startDate to currentDate
        if (compareAsc(eventStartDate, currentDate) === -1) {
            eventStartDate = currentDate;
        }

        // get all available working days without Weekends
        let availableEventDays = differenceInBusinessDays(eventEndDate, eventStartDate);

        // check day-off is passed or it is not on weekend and decrement working days
        dayOffs.forEach((dayOff) => {
            if (!isWeekend(new Date(dayOff.date)) && !isPast(new Date(dayOff.date))) {
                availableEventDays -= 1;
            }
        });

        return availableEventDays;
    }

    getEventMinutes(event: Event): number {
        return differenceInMinutes(new Date(event.startDate), new Date());
    }

    async getEventSlots(
        event: Event,
        dayOffObjects: DayOff[],
        breakTimes: BreakTime[],
    ): Promise<Slot[]> {
        const currentDate = new Date();
        const eventEndDate = new Date(event.endDate);
        let eventStartDate = new Date(event.startDate);

        // check if event already started or not
        // if an event already started, set startDate to now in order to get future slots
        if (compareAsc(eventStartDate, currentDate) === -1) {
            eventStartDate = currentDate;
        }

        // specify the last available booking date after the start of an event (7 days in insturction)
        let limitedDate = addBusinessDays(new Date(event.startDate), event.availableBookingDays);

        // check if limitedDate is after than eventEndDate
        // if it is after, set limitedDate to eventEndDate
        if (compareAsc(limitedDate, eventEndDate) === 1) {
            limitedDate = eventEndDate;
        }

        // get all formatted days into an array between eventStartDate and limitedDate
        const availableDays = eachDayOfInterval({
            start: eventStartDate,
            end: limitedDate,
        }).map((date) => format(date, 'yyyy-MM-dd'));

        // get all day-offs and parse their values to an array
        const dayOffs = dayOffObjects.map((dayOff) => format(new Date(dayOff.date), 'yyyy-MM-dd'));

        // creating slots
        const slots = [];
        for (const day of availableDays) {
            // if one of the days in availableDays is weekend or day-off, exclude it
            if (isWeekend(new Date(day)) || dayOffs.includes(day)) {
                continue;
            }

            // casual start and end of working times of a day
            const workEndTime = new Date(day + ' ' + event.endHour);
            const slotStartTime = new Date(day + ' ' + event.startHour);

            // the while loop creates slots for per day, considering breaks and working hours
            let bTIndex = 0;
            while (slotStartTime.getTime() <= workEndTime.getTime()) {
                const formattedDate = format(slotStartTime, 'yyyy-MM-dd HH:mm:ss');
                const slotDurationInMilliSeconds = minutesToMilliseconds(event.slotDuration);
                const breakTimeInMilliSeconds = minutesToMilliseconds(event.breakTimeAfterSlot);

                const theStartOfBreakTimeInMilliseconds = new Date(
                    `${day} ${breakTimes[bTIndex]?.start}`,
                ).getTime();
                const theEndOfBreakTimeInMilliseconds = new Date(
                    `${day} ${breakTimes[bTIndex]?.end}`,
                ).getTime();

                // get the count of users that booked a slot
                const { length: count } = await this._eventsRepo.getSlotBookingsCount(
                    event.id,
                    formattedDate,
                );

                // create a slot object
                const slot = {
                    eventId: event.id,
                    available: event.maxUserCountPerSlot,
                    remains: event.maxUserCountPerSlot - count,
                    dateTime: formattedDate,
                };

                // change the starting time of the next slot
                slotStartTime.setTime(
                    slotStartTime.getTime() + slotDurationInMilliSeconds + breakTimeInMilliSeconds,
                );

                // check slotStartTime is after than coming break start time
                // if it is after, change slotStartTime to end of this break time
                if (
                    breakTimes[bTIndex] &&
                    slotStartTime.getTime() >= theStartOfBreakTimeInMilliseconds
                ) {
                    slotStartTime.setTime(theEndOfBreakTimeInMilliseconds);
                    bTIndex++;
                }

                if (!(slotStartTime.getTime() >= workEndTime.getTime())) {
                    slots.push(slot);
                }
            }
        }

        return slots;
    }
}
