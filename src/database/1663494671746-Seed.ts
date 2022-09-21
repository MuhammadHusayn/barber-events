import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class Seed1663494671746 implements MigrationInterface {
    name = '1663494671746-Seed';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // event table that holds a barbar events
        await queryRunner.createTable(
            new Table({
                name: 'event',
                columns: [
                    {
                        name: 'id',
                        type: 'integer',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    { name: 'name', type: 'varchar' },
                    { name: 'description', type: 'varchar', isNullable: true },
                    { name: 'slotDuration', type: 'integer' },
                    { name: 'maxUserCountPerSlot', type: 'integer' },
                    { name: 'breakTimeAfterSlot', type: 'integer' },
                    { name: 'availableBookingDays', type: 'integer' },
                    { name: 'startHour', type: 'varchar' },
                    { name: 'endHour', type: 'varchar' },
                    { name: 'startDate', type: 'date' },
                    { name: 'endDate', type: 'date' },
                    {
                        name: 'createdAt',
                        type: 'timestamp',
                        default: 'now()',
                    },
                ],
            }),
        );

        // day_off table holds dates such as holidays when a barber does not work
        await queryRunner.createTable(
            new Table({
                name: 'day_off',
                columns: [
                    {
                        name: 'id',
                        type: 'integer',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    { name: 'name', type: 'varchar' },
                    { name: 'description', type: 'varchar', isNullable: true },
                    { name: 'date', type: 'date' },
                    {
                        name: 'createdAt',
                        type: 'timestamp',
                        default: 'now()',
                    },
                ],
            }),
        );

        // break_time table holds time intervals between slots when a barber has a rest or do something else
        await queryRunner.createTable(
            new Table({
                name: 'break_time',
                columns: [
                    {
                        name: 'id',
                        type: 'integer',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    { name: 'name', type: 'varchar' },
                    { name: 'description', type: 'varchar', isNullable: true },
                    { name: 'start', type: 'varchar' },
                    { name: 'end', type: 'varchar' },
                    {
                        name: 'createdAt',
                        type: 'timestamp',
                        default: 'now()',
                    },
                ],
            }),
        );

        // booking table that holds user bookings of an event
        await queryRunner.createTable(
            new Table({
                name: 'booking',
                columns: [
                    {
                        name: 'id',
                        type: 'integer',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    { name: 'email', type: 'varchar' },
                    { name: 'firstName', type: 'varchar' },
                    { name: 'lastName', type: 'integer' },
                    { name: 'eventId', type: 'integer' },
                    { name: 'selectedDateTime', type: 'timestamp' },
                ],
            }),
        );

        // one-to-many relationship between booking and event
        await queryRunner.createForeignKey(
            'booking',
            new TableForeignKey({
                columnNames: ['eventId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'event',
                onDelete: 'CASCADE',
            }),
        );

        await queryRunner.startTransaction();

        // insert some mock (seed) data to the database
        try {
            // seed data for event
            await queryRunner.query(`
                INSERT INTO event (
                    id, 
                    name,
                    description,
                    slotDuration,
                    maxUserCountPerSlot,
                    breakTimeAfterSlot,
                    startHour,
                    endHour,
                    startDate,
                    endDate,
                    createdAt
                ) VALUES 
                (1, 'Men Haircut', null, 10, 3, 5, '08:00:00', '20:00:00', '2022-09-22', '2022-10-14', '2022-09-18 13:00:00'),
                (2, 'Women Haircut', null, 60, 3, 10, '08:00:00', '20:00:00', '2022-09-23', '2022-10-14', '2022-09-18 13:00:00')
            `);

            // seed data for day_off
            await queryRunner.query(`
                INSERT INTO day_off (id, name, description, date, createdAt) VALUES 
                (1, 'Bla-Bla Holiday', null, '2022-09-24', '2022-09-18 13:00:00'),
                (2, 'BirthDay Party', null, '2022-09-27', '2022-09-18 13:00:00')
            `);

            // seed data for break_time
            await queryRunner.query(`
                INSERT INTO break_time (id, name, description, start, end, createdAt) VALUES 
                (1, 'Launch Break', null, '12:00:00', '13:00:00', '2022-09-18 13:00:00'),
                (2, 'Cleanup Break', null, '15:00:00', '16:00:00', '2022-09-18 13:00:00')
            `);

            // seed data for break_time
            await queryRunner.query(`
                INSERT INTO booking (id, eventId, email, firstName, lastName, selectedDateTime) VALUES 
                (1, 1, 'fake@gmail.com', 'Tobbi', 'Bown', '2022-09-22 08:00:00'),
                (2, 2, 'fake@gmail.com', 'Jane', 'Bown', '2022-09-23 08:00:00')
            `);
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }

        await queryRunner.commitTransaction();
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE booking;`);
        await queryRunner.query(`DROP TABLE event;`);
        await queryRunner.query(`DROP TABLE day_off;`);
        await queryRunner.query(`DROP TABLE break_time;`);
    }
}
