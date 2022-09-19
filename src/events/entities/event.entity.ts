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
    maxSlotUsers: number;

    @Column()
    breakTimeAfterSlot: number;

    @Column()
    hourStart: string;

    @Column()
    hourEnd: string;

    @Column({ type: 'date' })
    dateStart: string;

    @Column({ type: 'date' })
    dateEnd: string;

    @Column({ type: 'datetime' })
    createdAt: string;
}
