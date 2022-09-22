import { EventsHelperService } from './eventsHelper.service';
import { EventsRepository } from './events.repository';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { BreakTime } from './entities/breakTime.entity';
import { Booking } from './entities/booking.entity';
import { DayOff } from './entities/dayOff.entity';
import { Event } from './entities/event.entity';
import { Cache } from '../helpers/Cache';

@Module({
    imports: [TypeOrmModule.forFeature([BreakTime, Booking, DayOff, Event])],
    controllers: [EventsController],
    providers: [EventsService, EventsHelperService, EventsRepository, Cache],
})
export class EventsModule {}
