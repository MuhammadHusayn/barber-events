import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DayOff {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column({ type: 'date' })
    date: string;

    @Column({ type: 'datetime' })
    createdAt: string;
}
