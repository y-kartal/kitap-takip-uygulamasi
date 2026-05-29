import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { BookOpen, FileText, Award, TrendingUp, Target, Flame } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface DashboardData {
  user: any;
  readingBooks: any[];
  recentlyCompleted: any[];
  recentTests: any[];
  achievements: any[];
  weeklyStats: any;
  monthlyStats: any;
  dailyProgress: any;
  motivationalMessage: string;
}

// Animated Counter Component
const AnimatedCounter: React.FC<{ value: number; duration?: number }> = ({ value, duration = 2 }) => {
  const [count, setCount] = useState(0);
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true });

  useEffect(() => {
    if (inView) {
      let start = 0;
      const end = value;
      const increment = end / (duration * 60);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 1000 / 60);
      return () => clearInterval(timer);
    }
  }, [inView, value, duration]);

  return <span ref={ref}>{count}</span>;
};

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await api.get('/dashboard');
      setData(response.data);
    } catch (error) {
      console.error('Dashboard fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">📚</div>
          <p className="text-xl text-gray-600 dark:text-gray-300">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-8">
      {/* Welcome Message */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Merhaba {data.user.name}! 👋</h2>
            <p className="text-xl opacity-90">{data.motivationalMessage}</p>
          </div>
          <div className="text-6xl animate-bounce-slow">🌟</div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.05, rotate: 2 }}
          className="card bg-gradient-to-br from-pink-500 to-rose-500 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Toplam Sayfa</p>
              <p className="text-4xl font-bold">
                <AnimatedCounter value={data.user.totalPagesRead} />
              </p>
            </div>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <BookOpen className="w-12 h-12 opacity-80" />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.05, rotate: -2 }}
          className="card bg-gradient-to-br from-purple-500 to-indigo-500 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Bitirilen Kitap</p>
              <p className="text-4xl font-bold">
                <AnimatedCounter value={data.user.totalBooksCompleted} />
              </p>
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
            >
              <Award className="w-12 h-12 opacity-80" />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05, rotate: 2 }}
          className="card bg-gradient-to-br from-green-500 to-emerald-500 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Toplam Test</p>
              <p className="text-4xl font-bold">
                <AnimatedCounter value={data.monthlyStats.testsCompleted} />
              </p>
            </div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            >
              <FileText className="w-12 h-12 opacity-80" />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Daily Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card"
      >
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-6 h-6 text-purple-500" />
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Günlük Hedef</h3>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between text-lg">
            <span className="text-gray-600 dark:text-gray-300">
              {data.dailyProgress.pagesRead} / {data.dailyProgress.goal} sayfa
            </span>
            <span className="font-bold text-purple-600 dark:text-purple-400">
              %{data.dailyProgress.percentage}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${data.dailyProgress.percentage}%` }}
              transition={{ duration: 1, delay: 0.6 }}
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-end pr-2"
            >
              {data.dailyProgress.percentage >= 20 && (
                <span className="text-white text-sm font-bold">
                  {data.dailyProgress.percentage >= 100 ? '🎉' : '📖'}
                </span>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Reading Books */}
      {data.readingBooks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card"
        >
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            📖 Şu An Okuduğun Kitaplar
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.readingBooks.map((book: any) => (
              <div
                key={book.id}
                className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 hover:shadow-lg transition-shadow"
              >
                <h4 className="font-bold text-lg text-gray-800 dark:text-white mb-2">
                  {book.title}
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                    <span>{book.currentPage} / {book.totalPages} sayfa</span>
                    <span className="font-bold text-purple-600 dark:text-purple-400">
                      %{book.progressPercentage}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-500 rounded-full h-3">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      style={{ width: `${book.progressPercentage}%` }}
                    />
                  </div>
                  {book.daysRemaining !== null && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      ⏰ {book.daysRemaining > 0 ? `${book.daysRemaining} gün kaldı` : 'Hedef tarihi geçti'}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recent Tests */}
      {data.recentTests.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card"
        >
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            📝 Son Testlerin
          </h3>
          <div className="space-y-3">
            {data.recentTests.slice(0, 3).map((test: any) => (
              <div
                key={test.id}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-xl"
              >
                <div>
                  <p className="font-bold text-gray-800 dark:text-white">{test.testName}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Test {test.testNumber} - {new Date(test.testDate).toLocaleDateString('tr-TR')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {test.totalNet?.toFixed(1) || '0.0'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    %{test.successPercentage || 0}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}


    </div>
  );
};

export default Dashboard;
