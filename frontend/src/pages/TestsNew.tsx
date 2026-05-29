import React, { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Plus, Trash2, Edit } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

interface Test {
  id: string;
  testName: string;
  testNumber: number;
  testDate: string;
  turkceCorrect: number;
  turkceWrong: number;
  turkceEmpty: number;
  turkceNet: number;
  matematikCorrect: number;
  matematikWrong: number;
  matematikEmpty: number;
  matematikNet: number;
  hayatBilgisiCorrect: number;
  hayatBilgisiWrong: number;
  hayatBilgisiEmpty: number;
  hayatBilgisiNet: number;
  ingilizceCorrect: number;
  ingilizceWrong: number;
  ingilizceEmpty: number;
  ingilizceNet: number;
  totalNet: number;
  successPercentage: number;
  notes?: string;
}

const TestsNew: React.FC = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTest, setEditingTest] = useState<Test | null>(null);

  const [formData, setFormData] = useState({
    testName: '',
    testNumber: '',
    testDate: new Date().toISOString().split('T')[0],
    turkceCorrect: '0',
    turkceWrong: '0',
    turkceEmpty: '0',
    matematikCorrect: '0',
    matematikWrong: '0',
    matematikEmpty: '0',
    hayatBilgisiCorrect: '0',
    hayatBilgisiWrong: '0',
    hayatBilgisiEmpty: '0',
    ingilizceCorrect: '0',
    ingilizceWrong: '0',
    ingilizceEmpty: '0',
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
        testDate: test.testDate.split('T')[0],
        turkceCorrect: test.turkceCorrect.toString(),
        turkceWrong: test.turkceWrong.toString(),
        turkceEmpty: test.turkceEmpty.toString(),
        matematikCorrect: test.matematikCorrect.toString(),
        matematikWrong: test.matematikWrong.toString(),
        matematikEmpty: test.matematikEmpty.toString(),
        hayatBilgisiCorrect: test.hayatBilgisiCorrect.toString(),
        hayatBilgisiWrong: test.hayatBilgisiWrong.toString(),
        hayatBilgisiEmpty: test.hayatBilgisiEmpty.toString(),
        ingilizceCorrect: test.ingilizceCorrect.toString(),
        ingilizceWrong: test.ingilizceWrong.toString(),
        ingilizceEmpty: test.ingilizceEmpty.toString(),
        notes: test.notes || '',
      });
    } else {
      setEditingTest(null);
      setFormData({
        testName: '',
        testNumber: '',
        testDate: new Date().toISOString().split('T')[0],
        turkceCorrect: '0',
        turkceWrong: '0',
        turkceEmpty: '0',
        matematikCorrect: '0',
        matematikWrong: '0',
        matematikEmpty: '0',
        hayatBilgisiCorrect: '0',
        hayatBilgisiWrong: '0',
        hayatBilgisiEmpty: '0',
        ingilizceCorrect: '0',
        ingilizceWrong: '0',
        ingilizceEmpty: '0',
        notes: '',
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTest(null);
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
                    (Object.values(statistics.subjectStats).reduce(
                      (sum: number, stat: any) => sum + stat.averageSuccess,
                      0
                    ) as number) / Object.keys(statistics.subjectStats).length
                  )
                : 0}
              %
            </p>
          </motion.div>
        </div>
      )}

      {/* Charts */}
      {statistics && (
        <div className="space-y-6">
          {/* Subject Performance - Always show all 4 subjects */}
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
              <BarChart data={[
                {
                  subject: 'Türkçe',
                  başarı: statistics.subjectStats['Türkçe']?.averageSuccess || 0,
                  net: statistics.subjectStats['Türkçe']?.averageNet || 0,
                },
                {
                  subject: 'Matematik',
                  başarı: statistics.subjectStats['Matematik']?.averageSuccess || 0,
                  net: statistics.subjectStats['Matematik']?.averageNet || 0,
                },
                {
                  subject: 'Hayat Bilgisi',
                  başarı: statistics.subjectStats['Hayat Bilgisi']?.averageSuccess || 0,
                  net: statistics.subjectStats['Hayat Bilgisi']?.averageNet || 0,
                },
                {
                  subject: 'İngilizce',
                  başarı: statistics.subjectStats['İngilizce']?.averageSuccess || 0,
                  net: statistics.subjectStats['İngilizce']?.averageNet || 0,
                }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="başarı" fill="#8b5cf6" name="Başarı %" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Weekly and Monthly Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Progress */}
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
                <LineChart data={statistics.weeklyProgress || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="averageSuccess"
                    stroke="#10b981"
                    strokeWidth={3}
                    name="Başarı %"
                    dot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Monthly Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="card"
            >
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                📅 Aylık Gelişim
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={statistics.monthlyProgress || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="averageSuccess"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    name="Başarı %"
                    dot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </div>
      )}

      {/* Tests List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
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
                className="p-6 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-2xl font-bold">{test.testName}</h4>
                      <span className="text-3xl">{getSuccessEmoji(test.successPercentage)}</span>
                    </div>
                    <p className="text-lg opacity-90 mb-3">
                      Test {test.testNumber} - {new Date(test.testDate).toLocaleDateString('tr-TR')}
                    </p>
                    
                    {/* Ders Netleri */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div className="bg-white/20 rounded-lg p-3">
                        <p className="text-sm opacity-75">Türkçe</p>
                        <p className="text-2xl font-bold">📖 {test.turkceNet.toFixed(1)}</p>
                        <p className="text-xs opacity-75">
                          ✅{test.turkceCorrect} ❌{test.turkceWrong} ⚪{test.turkceEmpty}
                        </p>
                      </div>
                      <div className="bg-white/20 rounded-lg p-3">
                        <p className="text-sm opacity-75">Matematik</p>
                        <p className="text-2xl font-bold">🔢 {test.matematikNet.toFixed(1)}</p>
                        <p className="text-xs opacity-75">
                          ✅{test.matematikCorrect} ❌{test.matematikWrong} ⚪{test.matematikEmpty}
                        </p>
                      </div>
                      <div className="bg-white/20 rounded-lg p-3">
                        <p className="text-sm opacity-75">Hayat Bilgisi</p>
                        <p className="text-2xl font-bold">🌍 {test.hayatBilgisiNet.toFixed(1)}</p>
                        <p className="text-xs opacity-75">
                          ✅{test.hayatBilgisiCorrect} ❌{test.hayatBilgisiWrong} ⚪{test.hayatBilgisiEmpty}
                        </p>
                      </div>
                      <div className="bg-white/20 rounded-lg p-3">
                        <p className="text-sm opacity-75">İngilizce</p>
                        <p className="text-2xl font-bold">🇬🇧 {test.ingilizceNet.toFixed(1)}</p>
                        <p className="text-xs opacity-75">
                          ✅{test.ingilizceCorrect} ❌{test.ingilizceWrong} ⚪{test.ingilizceEmpty}
                        </p>
                      </div>
                    </div>

                    {/* Toplam */}
                    <div className="flex items-center gap-4 bg-white/20 rounded-lg p-3">
                      <div>
                        <p className="text-sm opacity-75">Toplam Net</p>
                        <p className="text-3xl font-bold">🎯 {test.totalNet.toFixed(1)}</p>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Başarı Oranı</span>
                          <span className="font-bold">%{test.successPercentage}</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-4">
                          <div
                            className="h-full bg-white rounded-full transition-all duration-500"
                            style={{ width: `${test.successPercentage}%` }}
                          />
                        </div>
                      </div>
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
            className="card max-w-4xl w-full my-8"
          >
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
              {editingTest ? '✏️ Testi Düzenle' : '➕ Yeni Test Ekle'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Test Bilgileri */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

              {/* Türkçe */}
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl">
                <h3 className="text-xl font-bold text-red-700 dark:text-red-300 mb-3">📖 Türkçe</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="label">Doğru</label>
                    <input
                      type="number"
                      value={formData.turkceCorrect}
                      onChange={(e) => setFormData({ ...formData, turkceCorrect: e.target.value })}
                      className="input-field"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="label">Yanlış</label>
                    <input
                      type="number"
                      value={formData.turkceWrong}
                      onChange={(e) => setFormData({ ...formData, turkceWrong: e.target.value })}
                      className="input-field"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="label">Boş</label>
                    <input
                      type="number"
                      value={formData.turkceEmpty}
                      onChange={(e) => setFormData({ ...formData, turkceEmpty: e.target.value })}
                      className="input-field"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Matematik */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                <h3 className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-3">🔢 Matematik</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="label">Doğru</label>
                    <input
                      type="number"
                      value={formData.matematikCorrect}
                      onChange={(e) => setFormData({ ...formData, matematikCorrect: e.target.value })}
                      className="input-field"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="label">Yanlış</label>
                    <input
                      type="number"
                      value={formData.matematikWrong}
                      onChange={(e) => setFormData({ ...formData, matematikWrong: e.target.value })}
                      className="input-field"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="label">Boş</label>
                    <input
                      type="number"
                      value={formData.matematikEmpty}
                      onChange={(e) => setFormData({ ...formData, matematikEmpty: e.target.value })}
                      className="input-field"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Hayat Bilgisi */}
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
                <h3 className="text-xl font-bold text-green-700 dark:text-green-300 mb-3">🌍 Hayat Bilgisi</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="label">Doğru</label>
                    <input
                      type="number"
                      value={formData.hayatBilgisiCorrect}
                      onChange={(e) => setFormData({ ...formData, hayatBilgisiCorrect: e.target.value })}
                      className="input-field"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="label">Yanlış</label>
                    <input
                      type="number"
                      value={formData.hayatBilgisiWrong}
                      onChange={(e) => setFormData({ ...formData, hayatBilgisiWrong: e.target.value })}
                      className="input-field"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="label">Boş</label>
                    <input
                      type="number"
                      value={formData.hayatBilgisiEmpty}
                      onChange={(e) => setFormData({ ...formData, hayatBilgisiEmpty: e.target.value })}
                      className="input-field"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* İngilizce */}
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl">
                <h3 className="text-xl font-bold text-purple-700 dark:text-purple-300 mb-3">🇬🇧 İngilizce</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="label">Doğru</label>
                    <input
                      type="number"
                      value={formData.ingilizceCorrect}
                      onChange={(e) => setFormData({ ...formData, ingilizceCorrect: e.target.value })}
                      className="input-field"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="label">Yanlış</label>
                    <input
                      type="number"
                      value={formData.ingilizceWrong}
                      onChange={(e) => setFormData({ ...formData, ingilizceWrong: e.target.value })}
                      className="input-field"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="label">Boş</label>
                    <input
                      type="number"
                      value={formData.ingilizceEmpty}
                      onChange={(e) => setFormData({ ...formData, ingilizceEmpty: e.target.value })}
                      className="input-field"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Notlar */}
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

export default TestsNew;
