import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Award, Lock } from 'lucide-react';

interface Achievement {
  id: string;
  type: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

const Achievements: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const response = await api.get('/achievements');
      setAchievements(response.data);
    } catch (error) {
      console.error('Achievements fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const progressPercentage = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">🏆</div>
          <p className="text-xl text-gray-600 dark:text-gray-300">Rozetler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block"
        >
          <div className="text-8xl mb-4 animate-bounce-slow">🏆</div>
          <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-2">
            Rozetlerim
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Başarılarını topla, daha fazlasını kazan!
          </p>
        </motion.div>
      </div>

      {/* Progress */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="card bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-white"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold mb-2">Toplam İlerleme</h2>
            <p className="text-xl opacity-90">
              {unlockedCount} / {totalCount} rozet kazandın!
            </p>
          </div>
          <div className="text-6xl">
            {progressPercentage === 100 ? '👑' : progressPercentage >= 75 ? '🌟' : progressPercentage >= 50 ? '⭐' : '✨'}
          </div>
        </div>
        <div className="w-full bg-white/20 rounded-full h-6">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, delay: 0.3 }}
            className="h-full bg-white rounded-full flex items-center justify-end pr-2"
          >
            {progressPercentage >= 10 && (
              <span className="text-orange-500 font-bold text-sm">
                %{progressPercentage}
              </span>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Unlocked Achievements */}
      {unlockedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
            <Award className="w-8 h-8 text-yellow-500" />
            Kazanılan Rozetler ({unlockedCount})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {achievements
              .filter((a) => a.unlocked)
              .map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.8, rotateY: 180 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.1, rotateZ: 5 }}
                  className="card text-center bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-4 border-yellow-400 dark:border-yellow-600 relative overflow-hidden"
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent animate-pulse" />
                  
                  <div className="relative">
                    <div className="text-7xl mb-3 animate-bounce-slow">
                      {achievement.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                      {achievement.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      {achievement.description}
                    </p>
                    {achievement.unlockedAt && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        🎉 {new Date(achievement.unlockedAt).toLocaleDateString('tr-TR')}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
          </div>
        </motion.div>
      )}

      {/* Locked Achievements */}
      {totalCount - unlockedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
            <Lock className="w-8 h-8 text-gray-500" />
            Kilitli Rozetler ({totalCount - unlockedCount})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {achievements
              .filter((a) => !a.unlocked)
              .map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  className="card text-center bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 relative"
                >
                  {/* Lock overlay */}
                  <div className="absolute inset-0 bg-gray-900/10 dark:bg-gray-900/30 backdrop-blur-[2px] rounded-2xl flex items-center justify-center">
                    <Lock className="w-12 h-12 text-gray-400 dark:text-gray-600" />
                  </div>
                  
                  <div className="opacity-50">
                    <div className="text-7xl mb-3 grayscale">
                      {achievement.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                      {achievement.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {achievement.description}
                    </p>
                  </div>
                </motion.div>
              ))}
          </div>
        </motion.div>
      )}

      {/* Motivational Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="card bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white text-center"
      >
        <div className="text-6xl mb-4">
          {progressPercentage === 100 ? '🎊' : progressPercentage >= 75 ? '🚀' : progressPercentage >= 50 ? '💪' : '🌱'}
        </div>
        <h3 className="text-3xl font-bold mb-2">
          {progressPercentage === 100
            ? 'Tüm rozetleri topladın! Muhteşemsin! 👑'
            : progressPercentage >= 75
            ? 'Harika gidiyorsun! Neredeyse hepsini topladın! 🌟'
            : progressPercentage >= 50
            ? 'Yarı yoldasın! Devam et! ⭐'
            : progressPercentage >= 25
            ? 'İyi bir başlangıç! Okumaya devam et! ✨'
            : 'Yeni rozetler kazanmak için okumaya devam et! 📚'}
        </h3>
        <p className="text-xl opacity-90">
          Her kitap, her test seni yeni bir rozete yaklaştırıyor!
        </p>
      </motion.div>

      {/* Achievement Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="card"
      >
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          💡 Rozet Kazanma İpuçları
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <p className="font-bold text-blue-800 dark:text-blue-300 mb-2">📚 Kitap Rozetleri</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Daha fazla kitap oku ve bitir! Her kitap seni yeni bir rozete yaklaştırır.
            </p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
            <p className="font-bold text-green-800 dark:text-green-300 mb-2">📄 Sayfa Rozetleri</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Her gün düzenli oku! Toplam okuduğun sayfa sayısı arttıkça yeni rozetler kazanırsın.
            </p>
          </div>
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
            <p className="font-bold text-orange-800 dark:text-orange-300 mb-2">🔥 Seri Rozetleri</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Günlük okuma hedefini tuttur! Üst üste okuma günleri seni seri rozetlerine götürür.
            </p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
            <p className="font-bold text-purple-800 dark:text-purple-300 mb-2">📝 Test Rozetleri</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Testlerini düzenli çöz ve yüksek puanlar al! Başarılı testler rozet kazandırır.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Achievements;
