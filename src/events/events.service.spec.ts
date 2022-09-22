import { mockSlots, mockEvents, mockBooking, mockBookingDto } from './mocks/events.mock';
import { EventsHelperService } from './eventsHelper.service';
import { BadRequestException } from '@nestjs/common';
import { EventsService } from './events.service';
import { Errors } from '../enums/errors';
import { Test } from '@nestjs/testing';

describe('Events Service', () => {
    let fakeService: Partial<EventsService>;
    let fakeHelperService: Partial<EventsHelperService>;

    beforeEach(async () => {
        fakeHelperService = {
            getEventMinutes: () => 6000,
            getEventSlots: async () => mockSlots,
            getAvailableEventDays: async () => 7,
        };

        fakeService = {
            getEvents: async () => mockEvents,
            book: async () => mockBooking,
        };

        const module = await Test.createTestingModule({
            providers: [
                {
                    useValue: fakeService,
                    provide: EventsService,
                },
                {
                    useValue: fakeHelperService,
                    provide: EventsHelperService,
                },
            ],
        }).compile();

        fakeService = module.get(EventsService);
        fakeHelperService = module.get(EventsHelperService);
    });

    describe('Events Service', () => {
        it('should return events', async () => {
            const result = await fakeService.getEvents();
            expect(result).toStrictEqual(mockEvents);
        });

        it('it should create a new booking', async () => {
            const result = await fakeService.book(mockBookingDto);

            expect(result).toStrictEqual(mockBooking);
        });

        it('it should throw error if slot not found', async () => {
            const body = mockBookingDto;
            const slots = mockSlots;

            try {
                const result = slots.find(
                    (slot) =>
                        slot.dateTime === body.selectedDateTime && slot.eventId === body.eventId,
                );

                if (!result) {
                    throw new BadRequestException(Errors.InvalidSlotTime);
                }
            } catch (error) {
                expect(error).toMatchObject({
                    message: Errors.InvalidSlotTime,
                });
            }
        });

        it('it should throw error if slot has not remain', async () => {
            const slots = mockSlots;
            const body = {
                email: 'test@gmail.com',
                firstName: 'John',
                lastName: 'Brown',
                selectedDateTime: '2022-09-23 08:15:00',
                eventId: 1,
            };

            try {
                const result = slots.find(
                    (slot) =>
                        slot.dateTime === body.selectedDateTime && slot.eventId === body.eventId,
                );

                if (result.remains === 0) {
                    throw new BadRequestException(Errors.SlotExceed);
                }
            } catch (error) {
                expect(error).toStrictEqual({
                    message: Errors.InvalidSlotTime,
                });
            }
        });
    });
});
