import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Event {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    slotDuration: number;

    @Column()
    maxUserCountPerSlot: number;

    @Column()
    breakTimeAfterSlot: number;

    @Column()
    startHour: string;

    @Column()
    endHour: string;

    @Column()
    availableBookingDays: number;

    @Column({ type: 'date' })
    startDate: string;

    @Column({ type: 'date' })
    endDate: string;

    @Column({ type: 'datetime' })
    createdAt: string;
}
