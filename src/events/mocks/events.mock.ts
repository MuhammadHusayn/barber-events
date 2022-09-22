import { CreateBookingDto } from './../dtos/create-booking.dto';
import { Booking } from './../entities/booking.entity';
import { EventDto } from '../dtos/event.dto';
import { Slot } from '../dtos/slot.dto';

export const mockEvents: EventDto[] = [
    {
        id: 1,
        name: 'Men Haircut',
        description: null,
        slotDuration: 10,
        maxUserCountPerSlot: 3,
        breakTimeAfterSlot: 5,
        startHour: '08:00:00',
        endHour: '20:00:00',
        startDate: '2022-09-23',
        endDate: '2022-10-14',
        createdAt: '2022-09-18T13:00:00.000Z',
        timeLeft: 450,
        availableEventDays: 14,
        availableBookingDays: 7,
        dayOffs: [
            {
                id: 1,
                name: 'Bla-Bla Holiday',
                description: null,
                date: '2022-10-06',
                createdAt: '2022-09-18T13:00:00.000Z',
            },
            {
                id: 2,
                name: 'BirthDay Party',
                description: null,
                date: '2022-09-27',
                createdAt: '2022-09-18T13:00:00.000Z',
            },
        ],
        breakTimes: [
            {
                id: 1,
                name: 'Launch Break',
                description: null,
                start: '12:00:00',
                end: '13:00:00',
                createdAt: '2022-09-18T13:00:00.000Z',
            },
            {
                id: 2,
                name: 'Cleanup Break',
                description: null,
                start: '15:00:00',
                end: '16:00:00',
                createdAt: '2022-09-18T13:00:00.000Z',
            },
        ],
        slots: [
            {
                eventId: 1,
                available: 3,
                remains: 2,
                dateTime: '2022-09-23 08:00:00',
            },
            {
                eventId: 1,
                available: 3,
                remains: 3,
                dateTime: '2022-09-23 08:15:00',
            },
            {
                eventId: 1,
                available: 3,
                remains: 3,
                dateTime: '2022-09-23 08:30:00',
            },
        ],
    },
];

export const mockSlots: Slot[] = [
    {
        eventId: 1,
        available: 3,
        remains: 2,
        dateTime: '2022-09-23 08:00:00',
    },
    {
        eventId: 1,
        available: 3,
        remains: 3,
        dateTime: '2022-09-23 08:15:00',
    },
];

export const mockBooking: Booking = {
    id: 1,
    email: 'test@gmail.com',
    firstName: 'John',
    lastName: 'Brown',
    selectedDateTime: '2022-09-23 08:15:00',
    eventId: 2,
};

export const mockBookingDto: CreateBookingDto = {
    email: 'test@gmail.com',
    firstName: 'John',
    lastName: 'Brown',
    selectedDateTime: '2022-09-23 08:15:00',
    eventId: 2,
};
