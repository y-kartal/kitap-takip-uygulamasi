import bcrypt from 'bcryptjs';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { Book, BookStatus } from '../models/Book';
import { Test } from '../models/Test';
import { Achievement, AchievementType } from '../models/Achievement';

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

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected');

    const userRepository = AppDataSource.getRepository(User);
    const bookRepository = AppDataSource.getRepository(Book);
    const testRepository = AppDataSource.getRepository(Test);
    const achievementRepository = AppDataSource.getRepository(Achievement);

    // Create default user
    const hashedPassword = await bcrypt.hash('03022018', 10);
    let user = await userRepository.findOne({ where: { username: 'vera' } });

    if (!user) {
      user = userRepository.create({
        username: 'vera',
        password: hashedPassword,
        name: 'Vera',
        dailyReadingGoal: 15,
        totalPagesRead: 150,
        totalBooksCompleted: 2,
        currentStreak: 5,
        longestStreak: 12
      });
      await userRepository.save(user);
      console.log('✅ Default user created');
    }

    // Create sample books
    const existingBooks = await bookRepository.count({ where: { userId: user.id } });
    if (existingBooks === 0) {
      const sampleBooks = [
        {
          title: 'Küçük Prens',
          totalPages: 96,
          currentPage: 96,
          status: BookStatus.COMPLETED,
          rating: 5,
          startDate: new Date('2024-01-01'),
          completedDate: new Date('2024-01-10'),
          actualDays: 9,
          userId: user.id
        },
        {
          title: 'Harry Potter ve Felsefe Taşı',
          totalPages: 320,
          currentPage: 180,
          status: BookStatus.READING,
          rating: 0,
          startDate: new Date('2024-01-15'),
          targetEndDate: new Date('2024-02-15'),
          targetDays: 30,
          userId: user.id
        },
        {
          title: 'Heidi',
          totalPages: 240,
          currentPage: 0,
          status: BookStatus.TO_READ,
          rating: 0,
          userId: user.id
        },
        {
          title: 'Tom Sawyer',
          totalPages: 200,
          currentPage: 0,
          status: BookStatus.TO_READ,
          rating: 0,
          userId: user.id
        }
      ];

      for (const bookData of sampleBooks) {
        const book = bookRepository.create(bookData);
        await bookRepository.save(book);
      }
      console.log('✅ Sample books created');
    }

    // Create sample tests
    const existingTests = await testRepository.count({ where: { userId: user.id } });
    if (existingTests === 0) {
      const sampleTests = [
        {
          testName: 'Deneme 1',
          testNumber: 1,
          testDate: new Date('2024-01-05'),
          turkceCorrect: 18,
          turkceWrong: 2,
          turkceEmpty: 0,
          matematikCorrect: 16,
          matematikWrong: 3,
          matematikEmpty: 1,
          hayatBilgisiCorrect: 19,
          hayatBilgisiWrong: 1,
          hayatBilgisiEmpty: 0,
          ingilizceCorrect: 15,
          ingilizceWrong: 4,
          ingilizceEmpty: 1,
          userId: user.id
        },
        {
          testName: 'Deneme 2',
          testNumber: 2,
          testDate: new Date('2024-01-12'),
          turkceCorrect: 17,
          turkceWrong: 3,
          turkceEmpty: 0,
          matematikCorrect: 18,
          matematikWrong: 2,
          matematikEmpty: 0,
          hayatBilgisiCorrect: 18,
          hayatBilgisiWrong: 2,
          hayatBilgisiEmpty: 0,
          ingilizceCorrect: 16,
          ingilizceWrong: 3,
          ingilizceEmpty: 1,
          userId: user.id
        }
      ];

      for (const testData of sampleTests) {
        const test = testRepository.create(testData);
        test.calculateNets();
        await testRepository.save(test);
      }
      console.log('✅ Sample tests created');
    }

    // Create achievements
    const existingAchievements = await achievementRepository.count({ where: { userId: user.id } });
    if (existingAchievements === 0) {
      for (const achDef of achievementDefinitions) {
        const achievement = achievementRepository.create({
          ...achDef,
          userId: user.id,
          unlocked: achDef.type === AchievementType.FIRST_BOOK || achDef.type === AchievementType.PAGES_100
        });
        
        if (achievement.unlocked) {
          achievement.unlockedAt = new Date();
        }
        
        await achievementRepository.save(achievement);
      }
      console.log('✅ Achievements created');
    }

    console.log('🎉 Seed completed successfully!');
    console.log('👤 Login credentials:');
    console.log('   Username: vera');
    console.log('   Password: 03022018');
    
    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seed();
