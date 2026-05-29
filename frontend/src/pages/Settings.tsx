import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Settings as SettingsIcon, User, Palette, Target, Bell, Save } from 'lucide-react';
import { motion } from 'framer-motion';

const Settings: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { themeColor, setThemeColor } = useTheme();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: '',
    dailyReadingGoal: user?.dailyReadingGoal || 15,
    yearlyBookGoal: 0,
    favoriteGenres: [] as string[],
  });

  const [newGenre, setNewGenre] = useState('');

  const themeColors = [
    { name: 'purple', label: 'Mor', gradient: 'from-purple-500 to-pink-500' },
    { name: 'blue', label: 'Mavi', gradient: 'from-blue-500 to-cyan-500' },
    { name: 'green', label: 'Yeşil', gradient: 'from-green-500 to-emerald-500' },
    { name: 'pink', label: 'Pembe', gradient: 'from-pink-500 to-rose-500' },
    { name: 'orange', label: 'Turuncu', gradient: 'from-orange-500 to-red-500' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await api.put('/auth/profile', formData);
      updateUser(response.data);
      toast.success('Ayarlar kaydedildi! ✨');
    } catch (error) {
      toast.error('Ayarlar kaydedilemedi');
    }
  };

  const addGenre = () => {
    if (newGenre.trim() && !formData.favoriteGenres.includes(newGenre.trim())) {
      setFormData({
        ...formData,
        favoriteGenres: [...formData.favoriteGenres, newGenre.trim()],
      });
      setNewGenre('');
    }
  };

  const removeGenre = (genre: string) => {
    setFormData({
      ...formData,
      favoriteGenres: formData.favoriteGenres.filter(g => g !== genre),
    });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <SettingsIcon className="w-10 h-10 text-purple-500" />
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
          ⚙️ Ayarlar
        </h1>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center gap-3 mb-6">
            <User className="w-6 h-6 text-purple-500" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              👤 Profil Bilgileri
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="label">İsim</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                placeholder="Adın"
              />
            </div>

            <div>
              <label className="label">Biyografi</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="input-field"
                rows={3}
                placeholder="Kendinden bahset..."
              />
            </div>
          </div>
        </motion.div>

        {/* Theme Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center gap-3 mb-6">
            <Palette className="w-6 h-6 text-purple-500" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              🎨 Tema Rengi
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {themeColors.map((color) => (
              <button
                key={color.name}
                type="button"
                onClick={() => setThemeColor(color.name as any)}
                className={`p-4 rounded-xl transition-all ${
                  themeColor === color.name
                    ? 'ring-4 ring-purple-500 scale-105'
                    : 'hover:scale-105'
                }`}
              >
                <div className={`w-full h-20 rounded-lg bg-gradient-to-r ${color.gradient} mb-2`} />
                <p className="text-center font-semibold text-gray-800 dark:text-white">
                  {color.label}
                </p>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Reading Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-6 h-6 text-purple-500" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              🎯 Okuma Hedefleri
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">Günlük Sayfa Hedefi</label>
              <input
                type="number"
                value={formData.dailyReadingGoal}
                onChange={(e) => setFormData({ ...formData, dailyReadingGoal: parseInt(e.target.value) || 0 })}
                className="input-field"
                min="1"
                placeholder="15"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Her gün kaç sayfa okumak istiyorsun?
              </p>
            </div>

            <div>
              <label className="label">Yıllık Kitap Hedefi</label>
              <input
                type="number"
                value={formData.yearlyBookGoal}
                onChange={(e) => setFormData({ ...formData, yearlyBookGoal: parseInt(e.target.value) || 0 })}
                className="input-field"
                min="0"
                placeholder="12"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Bu yıl kaç kitap okumak istiyorsun?
              </p>
            </div>
          </div>
        </motion.div>

        {/* Favorite Genres */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-6 h-6 text-purple-500" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              📚 Favori Türler
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newGenre}
                onChange={(e) => setNewGenre(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGenre())}
                className="input-field flex-1"
                placeholder="Tür ekle (örn: Bilim Kurgu)"
              />
              <button
                type="button"
                onClick={addGenre}
                className="btn-primary px-6"
              >
                Ekle
              </button>
            </div>

            {formData.favoriteGenres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.favoriteGenres.map((genre, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full font-semibold"
                  >
                    {genre}
                    <button
                      type="button"
                      onClick={() => removeGenre(genre)}
                      className="hover:text-red-500 transition-colors"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <button
            type="submit"
            className="w-full btn-primary flex items-center justify-center gap-2 text-lg py-4"
          >
            <Save className="w-5 h-5" />
            Ayarları Kaydet
          </button>
        </motion.div>
      </form>
    </div>
  );
};

export default Settings;
