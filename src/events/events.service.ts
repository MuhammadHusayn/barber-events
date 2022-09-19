import { Injectable, BadRequestException } from '@nestjs/common';
import { EventsHelperService } from './eventsHelper.service';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { EventsRepository } from './events.repository';
import { Booking } from './entities/booking.entity';
import { EventDto } from './dtos/event.dto';
import { Errors } from '../enums/errors';

@Injectable()
export class EventsService {
    constructor(
        private readonly _eventsRepo: EventsRepository,
        private _eventsHelperService: EventsHelperService,
    ) {}

    async getEvents(): Promise<EventDto[]> {
        const events = await this._eventsRepo.getEvents();

        const eventDtos = events.map(async (event) => {
            // add the number of available, remaining days to every event
            await this._eventsHelperService.addEventDays(event);

            // add coming day-offs to every event
            await this._eventsHelperService.addEventDaysOff(event);

            // add the amount of minutes until the start of an event
            await this._eventsHelperService.addEventMinutes(event);

            // add break-times to every event
            await this._eventsHelperService.addEventBreakTimes(event);

            // add available slots to an events
            await this._eventsHelperService.addEventSlots(event);

            return event;
        });

        return Promise.all(eventDtos);
    }

    async book(body: CreateBookingDto): Promise<Booking> {
        const events = await this._eventsRepo.getEvents();

        // get all available slots and parse it to an array
        const promisedSlots = events.map(async (event) => {
            await this._eventsHelperService.addEventSlots(event);
            return event.slots;
        });

        const innerSlots = await Promise.all(promisedSlots);
        const slots = innerSlots.flat();

        // find a slot that matches with request body data
        const slot = slots.find(
            (slot) => slot.dateTime === body.selectedDateTime && slot.eventId === body.eventId,
        );

        // check if there is a matched slot time
        if (!slot) {
            throw new BadRequestException(Errors.InvalidSlotTime);
        }

        // check if user limit per slot exceeds
        if (slot.remains === 0) {
            throw new BadRequestException(Errors.SlotExceed);
        }

        return this._eventsRepo.addBooking(body);
    }
}
