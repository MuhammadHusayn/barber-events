import { Injectable, BadRequestException } from '@nestjs/common';
import { EventsHelperService } from './eventsHelper.service';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { EventsRepository } from './events.repository';
import { Booking } from './entities/booking.entity';
import { EventDto } from './dtos/event.dto';
import { Errors } from '../enums/errors';
import { Cache } from 'src/helpers/Cache';

@Injectable()
export class EventsService {
    constructor(
        private readonly _eventsRepo: EventsRepository,
        private _eventsHelperService: EventsHelperService,
        private _cache: Cache,
    ) {}

    async getEvents(): Promise<EventDto[]> {
        if (this._cache.isValid('events')) {
            return this._cache.get<EventDto[]>('events');
        }

        const events = await this._eventsRepo.getEvents();
        const dayOffs = await this._eventsRepo.getDayOffs();
        const breakTimes = await this._eventsRepo.getBreakTimes();

        const eventDtos = events.map(async (event) => {
            // add day-offs to every event
            event.dayOffs = dayOffs;

            // add break-times to every event
            event.breakTimes = breakTimes;

            // add the number of available, remaining days to every event
            event.numberOfDays = await this._eventsHelperService.getEventDays(event, dayOffs);

            // add the amount of minutes until the start of an event
            event.timeLeft = await this._eventsHelperService.getEventMinutes(event);

            // add available slots to an events
            event.slots = await this._eventsHelperService.getEventSlots(event, dayOffs, breakTimes);

            return event;
        });

        const data = await Promise.all(eventDtos);

        this._cache.set('events', data);

        return data;
    }

    async book(body: CreateBookingDto): Promise<Booking> {
        const events = await this._eventsRepo.getEvents();
        const dayOffs = await this._eventsRepo.getDayOffs();
        const breakTimes = await this._eventsRepo.getBreakTimes();

        // get all available slots and parse it to an array
        const promisedSlots = events.map(async (event) => {
            await this._eventsHelperService.getEventSlots(event, dayOffs, breakTimes);
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
