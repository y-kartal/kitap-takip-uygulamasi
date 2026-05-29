import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Book } from './Book';

@Entity('reading_sessions')
export class ReadingSession {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column()
  userId!: string;

  @ManyToOne(() => Book, { nullable: true })
  @JoinColumn({ name: 'bookId' })
  book?: Book;

  @Column({ nullable: true })
  bookId?: string;

  @Column({ type: 'int' })
  duration!: number; // in minutes

  @Column({ type: 'int', default: 0 })
  pagesRead!: number;

  @Column({ type: 'timestamp' })
  sessionDate!: Date;

  @CreateDateColumn()
  createdAt!: Date;
}
