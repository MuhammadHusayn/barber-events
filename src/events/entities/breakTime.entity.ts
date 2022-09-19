import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BreakTime {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    start: string;

    @Column()
    end: string;

    @Column({ type: 'datetime' })
    createdAt: string;
}
