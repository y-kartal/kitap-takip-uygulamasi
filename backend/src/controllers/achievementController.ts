import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Achievement, AchievementType } from '../models/Achievement';
import { User } from '../models/User';
import { Book, BookStatus } from '../models/Book';
import { Test } from '../models/Test';

const achievementRepository = AppDataSource.getRepository(Achievement);
const userRepository = AppDataSource.getRepository(User);
const bookRepository = AppDataSource.getRepository(Book);
const testRepository = AppDataSource.getRepository(Test);

const achievementDefinitions = [
  { type: AchievementType.FIRST_BOOK, title: 'İlk Kitap', description: 'İlk kitabını bitirdin!', icon: '📖' },
  { type: AchievementType.BOOKS_5, title: '5 Kitap', description: '5 kitap okudun!', icon: '📚' },
  { type: AchievementType.BOOKS_10, title: '10 Kitap', description: '10 kitap okudun!', icon: '📕' },
  { type: AchievementType.BOOKS_25, title: '25 Kitap', description: '25 kitap okudun!', icon: '🎓' },
  { type: AchievementType.PAGES_100, title: '100 Sayfa', description: '100 sayfa okudun!', icon: '📄' },
  { type: AchievementType.PAGES_500, title: '500 Sayfa', description: '500 sayfa okudun!', icon: '📃' },
  { type: AchievementType.PAGES_1000, title: '1000 Sayfa', description: '1000 sayfa okudun!', icon: '📜' },
  { type: AchievementType.STREAK_7, title: '7 Gün Seri', description: '7 gün üst üste okudun!', icon: '🔥' },
  { type: AchievementType.STREAK_30, title: '30 Gün Seri', description: '30 gün üst üste okudun!', icon: '⭐' },
  { type: AchievementType.STREAK_100, title: '100 Gün Seri', description: '100 gün üst üste okudun!', icon: '🏆' },
  { type: AchievementType.PERFECT_TEST, title: 'Mükemmel Test', description: 'Bir testte tam puan aldın!', icon: '💯' },
  { type: AchievementType.TESTS_10, title: '10 Test', description: '10 test çözdün!', icon: '✏️' },
  { type: AchievementType.TESTS_50, title: '50 Test', description: '50 test çözdün!', icon: '📝' },
  { type: AchievementType.HIGH_RATING, title: 'Yüksek Puan', description: 'Bir kitaba 5 yıldız verdin!', icon: '⭐' }
];

export const getAllAchievements = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    // Get or create achievements for user
    let achievements = await achievementRepository.find({
      where: { userId },
      order: { unlocked: 'DESC', createdAt: 'ASC' }
    });

    // If no achievements exist, create them
    if (achievements.length === 0) {
      achievements = achievementDefinitions.map(def => 
        achievementRepository.create({
          ...def,
          userId,
          unlocked: false
        })
      );
      await achievementRepository.save(achievements);
    }

    res.json(achievements);
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({ message: 'Rozetler alınırken bir hata oluştu' });
  }
};

export const checkAndUnlockAchievements = async (userId: string) => {
  try {
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) return [];

    const completedBooks = await bookRepository.count({
      where: { userId, status: BookStatus.COMPLETED }
    });

    const tests = await testRepository.find({ where: { userId } });
    const perfectTests = tests.filter(t => t.successPercentage === 100);

    const achievements = await achievementRepository.find({ where: { userId } });
    const newlyUnlocked: Achievement[] = [];

    for (const achievement of achievements) {
      if (achievement.unlocked) continue;

      let shouldUnlock = false;

      switch (achievement.type) {
        case AchievementType.FIRST_BOOK:
          shouldUnlock = completedBooks >= 1;
          break;
        case AchievementType.BOOKS_5:
          shouldUnlock = completedBooks >= 5;
          break;
        case AchievementType.BOOKS_10:
          shouldUnlock = completedBooks >= 10;
          break;
        case AchievementType.BOOKS_25:
          shouldUnlock = completedBooks >= 25;
          break;
        case AchievementType.PAGES_100:
          shouldUnlock = user.totalPagesRead >= 100;
          break;
        case AchievementType.PAGES_500:
          shouldUnlock = user.totalPagesRead >= 500;
          break;
        case AchievementType.PAGES_1000:
          shouldUnlock = user.totalPagesRead >= 1000;
          break;
        case AchievementType.STREAK_7:
          shouldUnlock = user.currentStreak >= 7;
          break;
        case AchievementType.STREAK_30:
          shouldUnlock = user.currentStreak >= 30;
          break;
        case AchievementType.STREAK_100:
          shouldUnlock = user.currentStreak >= 100;
          break;
        case AchievementType.PERFECT_TEST:
          shouldUnlock = perfectTests.length > 0;
          break;
        case AchievementType.TESTS_10:
          shouldUnlock = tests.length >= 10;
          break;
        case AchievementType.TESTS_50:
          shouldUnlock = tests.length >= 50;
          break;
        case AchievementType.HIGH_RATING:
          const highRatedBooks = await bookRepository.count({
            where: { userId, rating: 5 }
          });
          shouldUnlock = highRatedBooks > 0;
          break;
      }

      if (shouldUnlock) {
        achievement.unlocked = true;
        achievement.unlockedAt = new Date();
        await achievementRepository.save(achievement);
        newlyUnlocked.push(achievement);
      }
    }

    return newlyUnlocked;
  } catch (error) {
    console.error('Check achievements error:', error);
    return [];
  }
};
