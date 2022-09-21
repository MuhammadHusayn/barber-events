import { EventsRepository } from './events.repository';
import { DaysLib } from 'src/helpers/DaysLib';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EventsHelperService {
    constructor(private readonly _eventsRepo: EventsRepository) {}

    async getAvailableEventDays(event, dayOffs) {
        const currentDate = new Date();
        const eventEndDate = new Date(event.endDate);
        let eventStartDate = new Date(event.startDate);

        // check events already started or not
        // if already started, set startDate to currentDate
        if (eventStartDate.getTime() < currentDate.getTime()) {
            eventStartDate = currentDate;
        }

        // get all available working days without Sundays
        let availableEventDays = DaysLib.getWeekDays(eventStartDate, eventEndDate);

        // check day-off is passed or on Sunday and decrement working days
        dayOffs.forEach((dayOff) => {
            const isNotSunday = new Date(dayOff.date).getDay();
            const isDateNotPassed = new Date().getTime() < new Date(dayOff.date).getTime();

            if (isNotSunday && isDateNotPassed) {
                availableEventDays -= 1;
            }
        });

        return availableEventDays;
    }

    async getEventMinutes(event) {
        const HOUR = 1000 * 60;
        const currentDateMinutes = new Date().getTime() / HOUR;
        const startDateMinutes = new Date(event.startDate).getTime() / HOUR;

        const timeLeft = (startDateMinutes - currentDateMinutes) | 0;
        return timeLeft;
    }

    async getEventSlots(event, dayOffObjects, breakTimes) {
        const currentDate = new Date();

        let eventEndDate = new Date(event.endDate);
        let eventStartDate = new Date(event.startDate);

        // check if event already started or not
        // if an event already started, set startDate to now in order to get future slots
        if (eventStartDate.getTime() < currentDate.getTime()) {
            eventStartDate = currentDate;
        }

        // the 7th day after the eventStartDate
        const limitedDate = new Date(
            new Date(eventStartDate).setDate(eventStartDate.getDate() + 7),
        );

        // check if the last 7th date is less than eventEndDate or not
        // if it is less, set eventEndDate to limitedDate
        if (limitedDate < eventEndDate) {
            eventEndDate = limitedDate;
        }

        // get all days in 7-day period range
        const availableDays = DaysLib.getDaysInRange(eventStartDate, eventEndDate);

        // get all day-offs and parse their values to an array
        const dayOffs = dayOffObjects.map((dayOff) => dayOff.date);

        // creating slots
        const slots = [];
        for (const day of availableDays) {
            const isSunday = !new Date(day).getDay();

            // if one of the days in 7 is Sunday or day-off, exclude it
            if (isSunday || dayOffs.includes(day)) {
                continue;
            }

            // casual start and end of working times of a day
            const workEndTime = new Date(day + ' ' + event.endHour);
            const slotStartTime = new Date(day + ' ' + event.startHour);

            // the while loop creates slots for per day, considering breaks and working hours
            let bTIndex = 0;
            while (slotStartTime.getTime() <= workEndTime.getTime()) {
                const formattedDate = DaysLib.formatDate(slotStartTime);
                const slotDurationInMilliSeconds = event.slotDuration * 60 * 1000;
                const breakTimeInMilliSeconds = event.breakTimeAfterSlot * 60 * 1000;

                const theStartOfBreakTimeInMilliseconds = new Date(
                    `${day} ${breakTimes[bTIndex]?.start}`,
                ).getTime();
                const theEndOfBreakTimeInMilliseconds = new Date(
                    `${day} ${breakTimes[bTIndex]?.end}`,
                ).getTime();

                // get the count of users that booked a slot
                const [{ count }] = await this._eventsRepo.getSlotBookingsCount(
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

                // check slotStartTime is greater than coming break start time
                // if it is greater, change slotStartTime to end of this break time
                if (
                    breakTimes[bTIndex] &&
                    slotStartTime.getTime() >= theStartOfBreakTimeInMilliseconds
                ) {
                    slotStartTime.setTime(theEndOfBreakTimeInMilliseconds);
                    bTIndex++;
                }

                slots.push(slot);
            }
        }

        return slots;
    }
}
