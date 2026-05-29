import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Book, BookStatus } from '../models/Book';
import { User } from '../models/User';
import { Between } from 'typeorm';

export const getStatistics = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const bookRepository = AppDataSource.getRepository(Book);
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get all completed books
    const completedBooks = await bookRepository.find({
      where: { userId, status: BookStatus.COMPLETED },
    });

    // Total stats
    const totalBooks = completedBooks.length;
    const totalPages = completedBooks.reduce((sum, book) => sum + book.totalPages, 0);
    const totalReadingMinutes = user.totalReadingMinutes || 0;

    // Calculate average pages per day
    const oldestBook = completedBooks.reduce((oldest, book) => {
      if (!oldest || (book.startDate && book.startDate < oldest.startDate!)) {
        return book;
      }
      return oldest;
    }, completedBooks[0]);

    const daysSinceStart = oldestBook?.startDate
      ? Math.ceil((Date.now() - new Date(oldestBook.startDate).getTime()) / (1000 * 60 * 60 * 24))
      : 1;

    const averagePagesPerDay = totalPages / daysSinceStart;

    // Calculate average reading speed (pages per hour)
    const averageReadingSpeed = totalReadingMinutes > 0 ? (totalPages / totalReadingMinutes) * 60 : 0;

    // Monthly books (last 6 months)
    const monthlyBooks = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const count = await bookRepository.count({
        where: {
          userId,
          status: BookStatus.COMPLETED,
          completedDate: Between(monthStart, monthEnd),
        },
      });

      monthlyBooks.push({
        month: date.toLocaleDateString('tr-TR', { month: 'short', year: 'numeric' }),
        count,
      });
    }

    // Genre distribution
    const genreDistribution: { [key: string]: number } = {};
    completedBooks.forEach((book: any) => {
      const genre = book.genre || 'Belirtilmemiş';
      genreDistribution[genre] = (genreDistribution[genre] || 0) + 1;
    });

    const genreArray = Object.entries(genreDistribution)
      .map(([genre, count]) => ({ genre, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    // Yearly progress
    const currentYear = new Date().getFullYear();
    const yearStart = new Date(currentYear, 0, 1);
    const yearEnd = new Date(currentYear, 11, 31);

    const yearlyCompleted = await bookRepository.count({
      where: {
        userId,
        status: BookStatus.COMPLETED,
        completedDate: Between(yearStart, yearEnd),
      },
    });

    const yearlyProgress = {
      goal: user.yearlyBookGoal || 0,
      completed: yearlyCompleted,
      percentage: user.yearlyBookGoal > 0 ? Math.round((yearlyCompleted / user.yearlyBookGoal) * 100) : 0,
    };

    res.json({
      totalBooks,
      totalPages,
      totalReadingMinutes,
      averagePagesPerDay: Math.round(averagePagesPerDay * 10) / 10,
      averageReadingSpeed: Math.round(averageReadingSpeed * 10) / 10,
      monthlyBooks,
      genreDistribution: genreArray,
      yearlyProgress,
    });
  } catch (error) {
    console.error('Statistics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
