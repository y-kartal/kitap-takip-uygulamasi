import { Router } from 'express';
import { login, getProfile, updateProfile } from '../controllers/authController';
import { getAllBooks, getBookById, createBook, updateBook, deleteBook, updateBookStatus } from '../controllers/bookController';
import { getAllTests, getTestById, createTest, updateTest, deleteTest, getTestStatistics } from '../controllers/testController';
import { getAllAchievements } from '../controllers/achievementController';
import { getDashboard } from '../controllers/dashboardController';
import { getStatistics } from '../controllers/statisticsController';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// Auth routes
router.post('/auth/login', login);
router.get('/auth/profile', authenticate, getProfile);
router.put('/auth/profile', authenticate, updateProfile);

// Dashboard
router.get('/dashboard', authenticate, getDashboard);

// Statistics
router.get('/statistics', authenticate, getStatistics);

// Book routes
router.get('/books', authenticate, getAllBooks);
router.get('/books/:id', authenticate, getBookById);
router.post('/books', authenticate, upload.single('coverImage'), createBook);
router.put('/books/:id', authenticate, upload.single('coverImage'), updateBook);
router.delete('/books/:id', authenticate, deleteBook);
router.patch('/books/:id/status', authenticate, updateBookStatus);

// Test routes
router.get('/tests', authenticate, getAllTests);
router.get('/tests/statistics', authenticate, getTestStatistics);
router.get('/tests/:id', authenticate, getTestById);
router.post('/tests', authenticate, createTest);
router.put('/tests/:id', authenticate, updateTest);
router.delete('/tests/:id', authenticate, deleteTest);

// Achievement routes
router.get('/achievements', authenticate, getAllAchievements);

export default router;
