import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @Column({ default: 'Okuyucu' })
  name!: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ default: 15 })
  dailyReadingGoal!: number;

  @Column({ default: 0 })
  totalPagesRead!: number;

  @Column({ default: 0 })
  totalBooksCompleted!: number;

  @Column({ default: 0 })
  currentStreak!: number;

  @Column({ default: 0 })
  longestStreak!: number;

  @Column({ default: 0 })
  level!: number;

  @Column({ default: 0 })
  xp!: number;

  @Column({ default: 0 })
  yearlyBookGoal!: number;

  @Column({ default: 'purple', length: 50 })
  themeColor!: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ type: 'simple-array', nullable: true })
  favoriteGenres?: string[];

  @Column({ default: 0 })
  totalReadingMinutes!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
