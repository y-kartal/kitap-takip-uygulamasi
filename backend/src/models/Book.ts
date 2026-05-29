import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

export enum BookStatus {
  TO_READ = 'to_read',
  READING = 'reading',
  COMPLETED = 'completed'
}

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ nullable: true })
  coverImage?: string;

  @Column()
  totalPages!: number;

  @Column({ default: 0 })
  currentPage!: number;

  @Column({ type: 'date', nullable: true })
  startDate?: Date;

  @Column({ type: 'date', nullable: true })
  targetEndDate?: Date;

  @Column({ type: 'date', nullable: true })
  completedDate?: Date;

  @Column({ nullable: true })
  targetDays?: number;

  @Column({ nullable: true })
  actualDays?: number;

  @Column({
    type: 'enum',
    enum: BookStatus,
    default: BookStatus.TO_READ
  })
  status!: BookStatus;

  @Column({ type: 'float', default: 0 })
  rating!: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ nullable: true, length: 100 })
  genre?: string;

  @Column({ nullable: true, length: 200 })
  author?: string;

  @Column({ default: 0 })
  position!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column()
  userId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Virtual fields
  get progressPercentage(): number {
    return this.totalPages > 0 ? Math.round((this.currentPage / this.totalPages) * 100) : 0;
  }

  get daysRemaining(): number | null {
    if (!this.targetEndDate || this.status === BookStatus.COMPLETED) return null;
    const today = new Date();
    const target = new Date(this.targetEndDate);
    const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  }
}
