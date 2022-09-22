import { EventsRepository } from './events.repository';
import { DataSource, EntityManager } from 'typeorm';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { EventsModule } from './events.module';
import { Errors } from '../enums/errors';
import { Test } from '@nestjs/testing';
import * as supertest from 'supertest';

describe('User', () => {
    let app: INestApplication;
    const dataSource = new DataSource({
        type: 'sqlite',
        database: 'test.db.sqlite',
        synchronize: false,
        entities: [__dirname + '/entities/*.entity.{js,ts}'],
    });

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [
                EventsModule,
                EntityManager,
                TypeOrmModule.forRoot({
                    type: 'sqlite',
                    database: 'test.db.sqlite',
                    synchronize: false,
                    entities: [__dirname + '/entities/*.entity.{js,ts}'],
                }),
            ],
            providers: [EventsRepository],
        }).compile();

        app = module.createNestApplication();
        dataSource
            .initialize()
            .then(() => {
                console.log('Data Source has been initialized!');
            })
            .catch((err) => {
                console.error('Error during Data Source initialization', err);
            });

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('GET /events', () => {
        it('should return an array of events', async () => {
            const x = await supertest
                .agent(app.getHttpServer())
                .get('/events')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
            const body = x.body as [];

            body.forEach((element: Event) => {
                expect(element).toMatchObject({
                    id: expect.any(Number),
                    name: expect.any(String),
                    description: expect.any(String),
                    slotDuration: expect.any(Number),
                    maxUserCountPerSlot: expect.any(Number),
                    breakTimeAfterSlot: expect.any(Number),
                    startHour: expect.any(String),
                    endHour: expect.any(String),
                    startDate: expect.any(String),
                    endDate: expect.any(String),
                    createdAt: expect.any(String),
                    availableBookingDays: expect.any(Number),
                });
            });
        });
    });

    describe('POST /book', () => {
        it('should return a booking', async () => {
            const { body } = await supertest
                .agent(app.getHttpServer())
                .post('/events/book')
                .set('Accept', 'application/json')
                .send({
                    email: 'test@gmail.com',
                    firstName: 'John',
                    lastName: 'Brown',
                    selectedDateTime: '2022-09-23 08:15:00',
                    eventId: 1,
                })
                .expect('Content-Type', /json/)
                .expect(201);

            expect(body).toEqual({
                id: body.id,
                email: 'test@gmail.com',
                firstName: 'John',
                lastName: 'Brown',
                selectedDateTime: '2022-09-23 08:15:00',
                eventId: 1,
            });

            await dataSource.manager.query('DELETE FROM booking WHERE id > 3;');
        });

        it('should throw error if slot time or eventId are invalid', async () => {
            const { body } = await supertest
                .agent(app.getHttpServer())
                .post('/events/book')
                .set('Accept', 'application/json')
                .send({
                    email: 'test@gmail.com',
                    firstName: 'John',
                    lastName: 'Brown',
                    selectedDateTime: '2022-09-22 08:00:00',
                    eventId: 11,
                })
                .expect('Content-Type', /json/)
                .expect(400);

            expect(body).toEqual({
                error: 'Bad Request',
                message: Errors.InvalidSlotTime,
                statusCode: 400,
            });
        });

        it('should throw error if slot has not remain', async () => {
            const { body } = await supertest
                .agent(app.getHttpServer())
                .post('/events/book')
                .set('Accept', 'application/json')
                .send({
                    email: 'test@gmail.com',
                    firstName: 'John',
                    lastName: 'Brown',
                    selectedDateTime: '2022-09-23 08:00:00',
                    eventId: 1,
                })
                .expect('Content-Type', /json/)
                .expect(400);

            expect(body).toEqual({
                error: 'Bad Request',
                message: Errors.SlotExceed,
                statusCode: 400,
            });
        });
    });
});
