import cron from 'node-cron';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { Book, BookStatus } from '../models/Book';
import { sendDailyReport } from './emailService';
import { startOfDay, endOfDay } from 'date-fns';
import { Between } from 'typeorm';

const userRepository = AppDataSource.getRepository(User);
const bookRepository = AppDataSource.getRepository(Book);

export const startCronJobs = () => {
  // Her gün saat 19:00'da çalışır (0 19 * * *)
  cron.schedule('0 19 * * *', async () => {
    console.log('🕐 Running daily report cron job...');
    
    try {
      const users = await userRepository.find();
      
      for (const user of users) {
        // Bugün okunan sayfaları hesapla
        const today = new Date();
        const todayStart = startOfDay(today);
        const todayEnd = endOfDay(today);
        
        // Bugün güncellenen kitapları bul
        const updatedBooks = await bookRepository.find({
          where: {
            userId: user.id,
            updatedAt: Between(todayStart, todayEnd)
          }
        });
        
        // Bugün bitirilen kitapları bul
        const completedToday = await bookRepository.count({
          where: {
            userId: user.id,
            status: BookStatus.COMPLETED,
            completedDate: Between(todayStart, todayEnd)
          }
        });
        
        // Basit hesaplama: Bugün güncellenen kitapların toplam okunan sayfası
        // (Daha doğru hesaplama için ReadingStreak tablosunu kullanabilirsiniz)
        const pagesRead = updatedBooks.reduce((sum, book) => {
          // Eğer kitap bugün güncellenmiş ve ilerleme varsa
          return sum + (book.currentPage > 0 ? 10 : 0); // Ortalama 10 sayfa varsayımı
        }, 0);
        
        // Email gönder
        await sendDailyReport(user.name, pagesRead, completedToday);
      }
      
      console.log('✅ Daily reports sent successfully');
    } catch (error) {
      console.error('❌ Cron job error:', error);
    }
  });
  
  console.log('✅ Cron jobs started - Daily report will be sent at 19:00');
};
