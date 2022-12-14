import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Booking {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ type: 'varchar' })
    selectedDateTime: string;

    @Column({ type: 'integer' })
    eventId: number;
}
