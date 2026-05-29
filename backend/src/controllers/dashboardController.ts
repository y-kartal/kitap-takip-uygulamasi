import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { Book, BookStatus } from '../models/Book';
import { Test } from '../models/Test';
import { Achievement } from '../models/Achievement';
import { ReadingStreak } from '../models/ReadingStreak';
import { Between } from 'typeorm';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';

const userRepository = AppDataSource.getRepository(User);
const bookRepository = AppDataSource.getRepository(Book);
const testRepository = AppDataSource.getRepository(Test);
const achievementRepository = AppDataSource.getRepository(Achievement);
const streakRepository = AppDataSource.getRepository(ReadingStreak);

const motivationalMessages = [
  '🌟 Harika gidiyorsun! Okumaya devam et!',
  '📚 Her kitap yeni bir macera!',
  '🎯 Hedefine çok yakınsın!',
  '💪 Sen yaparsın! İlerlemen muhteşem!',
  '🚀 Okuma yolculuğun harika!',
  '⭐ Bugün de harika bir gün!',
  '🎨 Hayal gücün sınırsız!',
  '🏆 Başarıların gurur verici!',
  '🌈 Her sayfa yeni bir renk!',
  '✨ Parlıyorsun!'
];

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    // Get user info
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    // Get reading books
    const readingBooks = await bookRepository.find({
      where: { userId, status: BookStatus.READING },
      order: { updatedAt: 'DESC' },
      take: 3
    });

    // Get recently completed books
    const completedBooks = await bookRepository.find({
      where: { userId, status: BookStatus.COMPLETED },
      order: { completedDate: 'DESC' },
      take: 3
    });

    // Get recent tests
    const recentTests = await testRepository.find({
      where: { userId },
      order: { testDate: 'DESC' },
      take: 5
    });

    // Get unlocked achievements
    const unlockedAchievements = await achievementRepository.find({
      where: { userId, unlocked: true },
      order: { unlockedAt: 'DESC' },
      take: 6
    });

    // This week's reading
    const now = new Date();
    const weekStart = startOfWeek(now);
    const weekEnd = endOfWeek(now);
    
    const weekStreaks = await streakRepository.find({
      where: {
        userId,
        date: Between(weekStart, weekEnd)
      }
    });

    const weeklyPagesRead = weekStreaks.reduce((sum, s) => sum + s.pagesRead, 0);
    const daysReadThisWeek = weekStreaks.filter(s => s.pagesRead > 0).length;

    // This month's stats
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const monthTests = await testRepository.find({
      where: {
        userId,
        testDate: Between(monthStart, monthEnd)
      }
    });

    const monthBooks = await bookRepository.find({
      where: {
        userId,
        status: BookStatus.COMPLETED,
        completedDate: Between(monthStart, monthEnd)
      }
    });

    // Random motivational message
    const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

    // Calculate daily goal progress
    const today = new Date().toISOString().split('T')[0];
    const todayStreak = await streakRepository.findOne({
      where: {
        userId,
        date: new Date(today)
      }
    });

    const todayPagesRead = todayStreak?.pagesRead || 0;
    const dailyGoalProgress = Math.min(100, Math.round((todayPagesRead / user.dailyReadingGoal) * 100));

    res.json({
      user: {
        name: user.name,
        totalPagesRead: user.totalPagesRead,
        totalBooksCompleted: user.totalBooksCompleted,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        dailyReadingGoal: user.dailyReadingGoal
      },
      readingBooks: readingBooks.map(book => ({
        ...book,
        progressPercentage: book.progressPercentage,
        daysRemaining: book.daysRemaining
      })),
      recentlyCompleted: completedBooks,
      recentTests,
      achievements: unlockedAchievements,
      weeklyStats: {
        pagesRead: weeklyPagesRead,
        daysRead: daysReadThisWeek,
        goal: user.dailyReadingGoal * 7
      },
      monthlyStats: {
        testsCompleted: monthTests.length,
        booksCompleted: monthBooks.length,
        averageTestScore: monthTests.length > 0 
          ? Math.round(monthTests.reduce((sum, t) => sum + t.successPercentage, 0) / monthTests.length)
          : 0
      },
      dailyProgress: {
        pagesRead: todayPagesRead,
        goal: user.dailyReadingGoal,
        percentage: dailyGoalProgress
      },
      motivationalMessage: randomMessage
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ message: 'Dashboard verileri alınırken bir hata oluştu' });
  }
};
