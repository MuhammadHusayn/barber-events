import { mockEvents, mockBooking, mockBookingDto } from './mocks/events.mock';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { Errors } from './../enums/errors';

describe('EventsController', () => {
    let controller: EventsController;
    let fakeService: Partial<EventsService>;

    fakeService = {
        getEvents: async () => mockEvents,
        book: async () => mockBooking,
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [EventsController],
            providers: [
                {
                    useValue: fakeService,
                    provide: EventsService,
                },
            ],
        }).compile();

        controller = module.get<EventsController>(EventsController);
        fakeService = module.get<EventsService>(EventsService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('it should return events', async () => {
        const result = await controller.getEvents();
        expect(result).toStrictEqual(mockEvents);
    });

    it('it should return booking', async () => {
        const result = await controller.book(mockBookingDto);

        expect(result).toStrictEqual(mockBooking);
    });

    it('it should return error', async () => {
        jest.spyOn(fakeService, 'book').mockRejectedValue(
            new BadRequestException(Errors.InvalidSlotTime),
        );
        const result = controller.book(mockBookingDto);

        expect(result).rejects.toStrictEqual(new BadRequestException(Errors.InvalidSlotTime));
    });

    it('it should return error', async () => {
        jest.spyOn(fakeService, 'book').mockRejectedValue(
            new BadRequestException(Errors.SlotExceed),
        );
        const result = controller.book(mockBookingDto);

        expect(result).rejects.toStrictEqual(new BadRequestException(Errors.SlotExceed));
    });
});
