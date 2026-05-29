import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

export enum AchievementType {
  FIRST_BOOK = 'first_book',
  BOOKS_5 = 'books_5',
  BOOKS_10 = 'books_10',
  BOOKS_25 = 'books_25',
  PAGES_100 = 'pages_100',
  PAGES_500 = 'pages_500',
  PAGES_1000 = 'pages_1000',
  STREAK_7 = 'streak_7',
  STREAK_30 = 'streak_30',
  STREAK_100 = 'streak_100',
  PERFECT_TEST = 'perfect_test',
  TESTS_10 = 'tests_10',
  TESTS_50 = 'tests_50',
  HIGH_RATING = 'high_rating'
}

@Entity('achievements')
export class Achievement {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'enum',
    enum: AchievementType
  })
  type!: AchievementType;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column()
  icon!: string;

  @Column({ default: false })
  unlocked!: boolean;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column()
  userId!: string;

  @CreateDateColumn()
  unlockedAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;
}
