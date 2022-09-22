import { CreateBookingDto } from './dtos/create-booking.dto';
import { BreakTime } from './entities/breakTime.entity';
import { Booking } from './entities/booking.entity';
import { DayOff } from './entities/dayOff.entity';
import { Event } from './entities/event.entity';
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class EventsRepository {
    constructor(private globalRepo: EntityManager) {}

    getEvents(): Promise<Event[]> {
        return this.globalRepo.getRepository(Event).find();
    }

    getDayOffs(): Promise<DayOff[]> {
        return this.globalRepo.getRepository(DayOff).find();
    }

    getBreakTimes(): Promise<BreakTime[]> {
        return this.globalRepo.getRepository(BreakTime).find();
    }

    getSlotBookingsCount(eventId: number, selectedDateTime: string): Promise<Booking[]> {
        return this.globalRepo
            .getRepository(Booking)
            .find({ where: { eventId, selectedDateTime } });
    }

    addBooking(bookingData: CreateBookingDto): Promise<Booking> {
        const booking = this.globalRepo.getRepository(Booking).create(bookingData);
        return this.globalRepo.save(booking);
    }
}
