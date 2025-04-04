import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'datetime' })
  date: Date;

  @Column({ default: false })
  isDone: boolean;

  @CreateDateColumn()
  createAt: Date; // Creation date
}
