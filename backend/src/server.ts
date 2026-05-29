import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { initializeDatabase } from './config/database';
import routes from './routes';
import { startCronJobs } from './services/cronService';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API routes
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Kitap ve Test Takip API çalışıyor' });
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Sunucu hatası',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    await initializeDatabase();
    
    // Start cron jobs for daily reports
    startCronJobs();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📚 Kitap ve Test Takip API hazır!`);
      console.log(`📧 Daily email reports enabled at 19:00`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
