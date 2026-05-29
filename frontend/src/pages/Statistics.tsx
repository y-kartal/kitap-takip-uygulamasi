import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { BarChart, TrendingUp, BookOpen, Clock, Target, Award } from 'lucide-react';
import { motion } from 'framer-motion';

interface Stats {
  totalBooks: number;
  totalPages: number;
  totalReadingMinutes: number;
  averagePagesPerDay: number;
  averageReadingSpeed: number;
  monthlyBooks: { month: string; count: number }[];
  genreDistribution: { genre: string; count: number }[];
  yearlyProgress: {
    goal: number;
    completed: number;
    percentage: number;
  };
}

const Statistics: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/statistics');
      setStats(response.data);
    } catch (error) {
      console.error('Stats fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">📊</div>
          <p className="text-xl text-gray-600 dark:text-gray-300">İstatistikler yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const readingHours = Math.floor(stats.totalReadingMinutes / 60);
  const readingMinutes = stats.totalReadingMinutes % 60;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <BarChart className="w-10 h-10 text-purple-500" />
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
          📊 Okuma İstatistiklerin
        </h1>
      </motion.div>

      {/* Yearly Goal */}
      {stats.yearlyProgress.goal > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card bg-gradient-to-r from-purple-500 to-pink-500 text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">🎯 Yıllık Hedef</h2>
              <p className="text-3xl font-bold">
                {stats.yearlyProgress.completed} / {stats.yearlyProgress.goal} kitap
              </p>
            </div>
            <div className="text-6xl">
              {stats.yearlyProgress.percentage >= 100 ? '🏆' : '📚'}
            </div>
          </div>
          <div className="w-full bg-white/30 rounded-full h-6">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(stats.yearlyProgress.percentage, 100)}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-full bg-white rounded-full flex items-center justify-center"
            >
              <span className="text-purple-600 font-bold text-sm">
                %{stats.yearlyProgress.percentage}
              </span>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card bg-gradient-to-br from-blue-500 to-cyan-500 text-white"
        >
          <BookOpen className="w-8 h-8 mb-3 opacity-80" />
          <p className="text-sm opacity-90 mb-1">Toplam Kitap</p>
          <p className="text-4xl font-bold">{stats.totalBooks}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card bg-gradient-to-br from-purple-500 to-pink-500 text-white"
        >
          <TrendingUp className="w-8 h-8 mb-3 opacity-80" />
          <p className="text-sm opacity-90 mb-1">Toplam Sayfa</p>
          <p className="text-4xl font-bold">{stats.totalPages.toLocaleString()}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card bg-gradient-to-br from-green-500 to-emerald-500 text-white"
        >
          <Clock className="w-8 h-8 mb-3 opacity-80" />
          <p className="text-sm opacity-90 mb-1">Okuma Süresi</p>
          <p className="text-4xl font-bold">
            {readingHours}s {readingMinutes}d
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card bg-gradient-to-br from-orange-500 to-red-500 text-white"
        >
          <Target className="w-8 h-8 mb-3 opacity-80" />
          <p className="text-sm opacity-90 mb-1">Ort. Sayfa/Gün</p>
          <p className="text-4xl font-bold">{stats.averagePagesPerDay.toFixed(1)}</p>
        </motion.div>
      </div>

      {/* Monthly Books Chart */}
      {stats.monthlyBooks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
            📅 Aylık Kitap Sayısı
          </h2>
          <div className="space-y-4">
            {stats.monthlyBooks.map((item, index) => {
              const maxCount = Math.max(...stats.monthlyBooks.map(m => m.count));
              const percentage = (item.count / maxCount) * 100;
              
              return (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 dark:text-gray-300 font-semibold">
                      {item.month}
                    </span>
                    <span className="text-purple-600 dark:text-purple-400 font-bold">
                      {item.count} kitap
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-8">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-end pr-3"
                    >
                      {item.count > 0 && (
                        <span className="text-white text-sm font-bold">📚</span>
                      )}
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Genre Distribution */}
      {stats.genreDistribution.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card"
        >
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
            🎭 Tür Dağılımı
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.genreDistribution.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-xl"
              >
                <span className="text-gray-800 dark:text-white font-semibold">
                  {item.genre || 'Belirtilmemiş'}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {item.count}
                  </span>
                  <Award className="w-5 h-5 text-purple-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Reading Speed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="card bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-700"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-300 mb-1">Ortalama Okuma Hızın</p>
            <p className="text-3xl font-bold text-gray-800 dark:text-white">
              {stats.averageReadingSpeed.toFixed(1)} sayfa/saat
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Harika gidiyorsun! 🚀
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Statistics;
