import { Serialize } from '../interceptors/serialize.interceptor';
import { GetEventsSwagger } from './swagger/get-events.swagger';
import { PostBookingSwagger } from './swagger/booking.swagger';
import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { Booking } from './entities/booking.entity';
import { EventsService } from './events.service';
import { EventDto } from './dtos/event.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Scheduling')
@Controller('events')
export class EventsController {
    constructor(private readonly _eventsService: EventsService) {}

    @Get()
    @GetEventsSwagger()
    @Serialize(EventDto)
    getEvents(): any {
        return this._eventsService.getEvents();
    }

    @Post('/book')
    @PostBookingSwagger()
    book(@Body() body: CreateBookingDto): Promise<Booking> {
        return this._eventsService.book(body);
    }
}
