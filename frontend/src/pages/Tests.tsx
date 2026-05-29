import React, { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Plus, Trash2, Edit, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

interface Test {
  id: string;
  testName: string;
  testNumber: number;
  subject: string;
  testDate: string;
  correctAnswers: number;
  wrongAnswers: number;
  emptyAnswers: number;
  netScore: number;
  successPercentage: number;
  notes?: string;
}

const subjects = ['Türkçe', 'Matematik', 'Hayat Bilgisi', 'İngilizce'];

const Tests: React.FC = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTest, setEditingTest] = useState<Test | null>(null);

  const [formData, setFormData] = useState({
    testName: '',
    testNumber: '',
    subject: 'Türkçe',
    testDate: new Date().toISOString().split('T')[0],
    correctAnswers: '',
    wrongAnswers: '',
    emptyAnswers: '',
    notes: '',
  });

  useEffect(() => {
    fetchTests();
    fetchStatistics();
  }, []);

  const fetchTests = async () => {
    try {
      const response = await api.get('/tests');
      setTests(response.data);
    } catch (error) {
      toast.error('Testler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await api.get('/tests/statistics');
      setStatistics(response.data);
    } catch (error) {
      console.error('Statistics fetch error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingTest) {
        await api.put(`/tests/${editingTest.id}`, formData);
        toast.success('Test güncellendi! 📝');
      } else {
        await api.post('/tests', formData);
        toast.success('Test eklendi! 🎉');
      }
      fetchTests();
      fetchStatistics();
      closeModal();
    } catch (error) {
      toast.error('Bir hata oluştu');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu testi silmek istediğinden emin misin?')) return;

    try {
      await api.delete(`/tests/${id}`);
      toast.success('Test silindi');
      fetchTests();
      fetchStatistics();
    } catch (error) {
      toast.error('Test silinemedi');
    }
  };

  const openModal = (test?: Test) => {
    if (test) {
      setEditingTest(test);
      setFormData({
        testName: test.testName,
        testNumber: test.testNumber.toString(),
        subject: test.subject,
        testDate: test.testDate.split('T')[0],
        correctAnswers: test.correctAnswers.toString(),
        wrongAnswers: test.wrongAnswers.toString(),
        emptyAnswers: test.emptyAnswers.toString(),
        notes: test.notes || '',
      });
    } else {
      setEditingTest(null);
      setFormData({
        testName: '',
        testNumber: '',
        subject: 'Türkçe',
        testDate: new Date().toISOString().split('T')[0],
        correctAnswers: '',
        wrongAnswers: '',
        emptyAnswers: '',
        notes: '',
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTest(null);
  };

  const getSubjectColor = (subject: string) => {
    const colors: any = {
      'Türkçe': 'from-red-500 to-pink-500',
      'Matematik': 'from-blue-500 to-cyan-500',
      'Hayat Bilgisi': 'from-green-500 to-emerald-500',
      'İngilizce': 'from-purple-500 to-indigo-500',
    };
    return colors[subject] || 'from-gray-500 to-gray-600';
  };

  const getSuccessEmoji = (percentage: number) => {
    if (percentage >= 90) return '🌟';
    if (percentage >= 80) return '⭐';
    if (percentage >= 70) return '✨';
    if (percentage >= 60) return '👍';
    return '💪';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">📝</div>
          <p className="text-xl text-gray-600 dark:text-gray-300">Testler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
          📝 Testlerim
        </h1>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Yeni Test Ekle
        </button>
      </div>

      {/* Statistics */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card bg-gradient-to-br from-blue-500 to-cyan-500 text-white"
          >
            <p className="text-sm opacity-90 mb-1">Toplam Test</p>
            <p className="text-5xl font-bold">{statistics.totalTests}</p>
          </motion.div>

          {statistics.bestSubject && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="card bg-gradient-to-br from-green-500 to-emerald-500 text-white"
            >
              <p className="text-sm opacity-90 mb-1">En Başarılı Ders</p>
              <p className="text-2xl font-bold">{statistics.bestSubject}</p>
              <p className="text-sm opacity-90">
                %{statistics.subjectStats[statistics.bestSubject]?.averageSuccess}
              </p>
            </motion.div>
          )}

          {statistics.worstSubject && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="card bg-gradient-to-br from-orange-500 to-red-500 text-white"
            >
              <p className="text-sm opacity-90 mb-1">Gelişim Alanı</p>
              <p className="text-2xl font-bold">{statistics.worstSubject}</p>
              <p className="text-sm opacity-90">
                %{statistics.subjectStats[statistics.worstSubject]?.averageSuccess}
              </p>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="card bg-gradient-to-br from-purple-500 to-indigo-500 text-white"
          >
            <p className="text-sm opacity-90 mb-1">Genel Ortalama</p>
            <p className="text-5xl font-bold">
              {statistics.totalTests > 0
                ? Math.round(
                    Object.values(statistics.subjectStats).reduce(
                      (sum: number, stat: any) => sum + stat.averageSuccess,
                      0
                    ) / Object.keys(statistics.subjectStats).length
                  )
                : 0}
              %
            </p>
          </motion.div>
        </div>
      )}

      {/* Charts */}
      {statistics && Object.keys(statistics.subjectStats).length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Subject Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card"
          >
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              📊 Ders Bazlı Başarı
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={Object.entries(statistics.subjectStats).map(([subject, stats]: any) => ({
                subject,
                başarı: stats.averageSuccess,
                net: stats.averageNet,
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="başarı" fill="#8b5cf6" name="Başarı %" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Weekly Progress */}
          {statistics.weeklyProgress && statistics.weeklyProgress.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="card"
            >
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                📈 Haftalık Gelişim
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={statistics.weeklyProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="averageSuccess"
                    stroke="#10b981"
                    strokeWidth={3}
                    name="Başarı %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </div>
      )}

      {/* Tests List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card"
      >
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          📋 Tüm Testler
        </h3>
        {tests.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Henüz test eklenmemiş
            </p>
            <button onClick={() => openModal()} className="btn-primary mt-4">
              İlk Testini Ekle
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {tests.map((test) => (
              <div
                key={test.id}
                className={`p-6 rounded-xl bg-gradient-to-r ${getSubjectColor(
                  test.subject
                )} text-white hover:shadow-xl transition-shadow`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-2xl font-bold">{test.testName}</h4>
                      <span className="text-3xl">{getSuccessEmoji(test.successPercentage)}</span>
                    </div>
                    <p className="text-lg opacity-90 mb-3">
                      {test.subject} - Test {test.testNumber}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-sm opacity-75">Doğru</p>
                        <p className="text-2xl font-bold">✅ {test.correctAnswers}</p>
                      </div>
                      <div>
                        <p className="text-sm opacity-75">Yanlış</p>
                        <p className="text-2xl font-bold">❌ {test.wrongAnswers}</p>
                      </div>
                      <div>
                        <p className="text-sm opacity-75">Boş</p>
                        <p className="text-2xl font-bold">⚪ {test.emptyAnswers}</p>
                      </div>
                      <div>
                        <p className="text-sm opacity-75">Net</p>
                        <p className="text-2xl font-bold">🎯 {test.netScore.toFixed(1)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 bg-white/20 rounded-full h-4">
                        <div
                          className="h-full bg-white rounded-full transition-all duration-500"
                          style={{ width: `${test.successPercentage}%` }}
                        />
                      </div>
                      <span className="text-2xl font-bold">%{test.successPercentage}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => openModal(test)}
                      className="p-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(test.id)}
                      className="p-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card max-w-2xl w-full my-8"
          >
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
              {editingTest ? '✏️ Testi Düzenle' : '➕ Yeni Test Ekle'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Test Adı *</label>
                  <input
                    type="text"
                    value={formData.testName}
                    onChange={(e) => setFormData({ ...formData, testName: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="label">Test Numarası *</label>
                  <input
                    type="number"
                    value={formData.testNumber}
                    onChange={(e) => setFormData({ ...formData, testNumber: e.target.value })}
                    className="input-field"
                    required
                    min="1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Ders *</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="input-field"
                    required
                  >
                    {subjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Test Tarihi *</label>
                  <input
                    type="date"
                    value={formData.testDate}
                    onChange={(e) => setFormData({ ...formData, testDate: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="label">Doğru Sayısı *</label>
                  <input
                    type="number"
                    value={formData.correctAnswers}
                    onChange={(e) => setFormData({ ...formData, correctAnswers: e.target.value })}
                    className="input-field"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label className="label">Yanlış Sayısı *</label>
                  <input
                    type="number"
                    value={formData.wrongAnswers}
                    onChange={(e) => setFormData({ ...formData, wrongAnswers: e.target.value })}
                    className="input-field"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label className="label">Boş Sayısı *</label>
                  <input
                    type="number"
                    value={formData.emptyAnswers}
                    onChange={(e) => setFormData({ ...formData, emptyAnswers: e.target.value })}
                    className="input-field"
                    required
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="label">Notlar</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="input-field"
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <button type="submit" className="flex-1 btn-primary">
                  {editingTest ? '💾 Kaydet' : '➕ Ekle'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-xl transition-colors"
                >
                  ❌ İptal
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Tests;
