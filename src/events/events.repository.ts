import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { BreakTime } from './entities/breakTime.entity';
import { Booking } from './entities/booking.entity';
import { DayOff } from './entities/dayOff.entity';
import { Event } from './entities/event.entity';
import { EventDto } from './dtos/event.dto';

import { CreateBookingDto } from './dtos/create-booking.dto';

@Injectable()
export class EventsRepository {
    constructor(
        @InjectRepository(BreakTime) private _breakTimesRepo: Repository<BreakTime>,
        @InjectRepository(Booking) private _bookingsRepo: Repository<Booking>,
        @InjectRepository(DayOff) private _dayOffsRepo: Repository<DayOff>,
        @InjectRepository(Event) private _eventsRepo: Repository<Event>,
    ) {}

    getEvents(): Promise<EventDto[]> {
        return this._eventsRepo.query(`
            SELECT 
                id,
                name,
                description,
                slotDuration,
                maxUserCountPerSlot,
                breakTimeAfterSlot,
                availableBookingDays,
                startHour,
                endHour,
                startDate,
                endDate,
                createdAt
            FROM event
        `);
    }

    getDayOffs(): Promise<DayOff[]> {
        return this._dayOffsRepo.query(`
            SELECT 
                id,
                name,
                description,
                date,
                createdAt
            FROM day_off
        `);
    }

    getBreakTimes(): Promise<BreakTime[]> {
        return this._breakTimesRepo.query(`
            SELECT 
                id,
                name,
                description,
                start,
                end,
                createdAt
            FROM break_time
            ORDER BY start ASC
        `);
    }

    getSlotBookingsCount(eventId: number, dateTime: string): Promise<[{ count: number }]> {
        return this._bookingsRepo.query(
            `
            SELECT
                count(*) as count
            FROM booking
            WHERE eventId = $1 AND DATETIME(selectedDateTime) = DATETIME($2)
        `,
            [eventId, dateTime],
        );
    }

    async addBooking({
        email,
        eventId,
        firstName,
        lastName,
        selectedDateTime,
    }: CreateBookingDto): Promise<Booking> {
        const [record] = await this._bookingsRepo.query(
            `
            INSERT INTO booking (
                email,
                eventId,
                firstName,
                lastName,
                selectedDateTime
            ) VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `,
            [email, eventId, firstName, lastName, selectedDateTime],
        );

        return record;
    }
}
