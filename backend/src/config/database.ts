import { DataSource } from 'typeorm';
import { User } from '../models/User';
import { Book } from '../models/Book';
import { Test } from '../models/Test';
import { Achievement } from '../models/Achievement';
import { ReadingStreak } from '../models/ReadingStreak';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: false,
  entities: [User, Book, Test, Achievement, ReadingStreak],
  migrations: [],
  subscribers: [],
});

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
};
