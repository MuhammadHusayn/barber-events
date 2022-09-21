import { BreakTime } from './entities/breakTime.entity';
import { Booking } from './entities/booking.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DayOff } from './entities/dayOff.entity';
import { Event } from './entities/event.entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { CreateBookingDto } from './dtos/create-booking.dto';

@Injectable()
export class EventsRepository {
    constructor(
        @InjectRepository(BreakTime) private _breakTimesRepo: Repository<BreakTime>,
        @InjectRepository(Booking) private _bookingsRepo: Repository<Booking>,
        @InjectRepository(DayOff) private _dayOffsRepo: Repository<DayOff>,
        @InjectRepository(Event) private _eventsRepo: Repository<Event>,
    ) {}

    getEvents(): Promise<Event[]> {
        return this._eventsRepo.find();
    }

    getDayOffs(): Promise<DayOff[]> {
        return this._dayOffsRepo.find();
    }

    getBreakTimes(): Promise<BreakTime[]> {
        return this._breakTimesRepo.find();
    }

    getSlotBookingsCount(eventId: number, selectedDateTime: string): Promise<Booking[]> {
        return this._bookingsRepo.find({ where: { eventId, selectedDateTime } });
    }

    addBooking(bookingData: CreateBookingDto): Promise<Booking> {
        const booking = this._bookingsRepo.create(bookingData);
        return this._bookingsRepo.save(booking);
    }
}
