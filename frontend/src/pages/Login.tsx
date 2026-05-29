import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { BookOpen, Sparkles } from 'lucide-react';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(username, password);
      toast.success('Hoş geldin! 🎉');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Giriş yapılamadı');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8 animate-float">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl shadow-2xl mb-4">
            <BookOpen className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            📚 Kitap ve Test Takip
          </h1>
          <p className="text-gray-600 dark:text-gray-300 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            Okuma serüvenine hoş geldin!
            <Sparkles className="w-4 h-4" />
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label">Kullanıcı Adı</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field text-lg"
                placeholder="Kullanıcı adını gir"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="label">Şifre</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field text-lg"
                placeholder="Şifreni gir"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '⏳ Giriş yapılıyor...' : '🚀 Giriş Yap'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
            <p className="text-sm text-blue-800 dark:text-blue-200 text-center">
              💡 <strong>İpucu:</strong> Kullanıcı adı: <code className="font-mono bg-white dark:bg-gray-700 px-2 py-1 rounded">vera</code>, Şifre: <code className="font-mono bg-white dark:bg-gray-700 px-2 py-1 rounded">03022018</code>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="flex justify-center gap-4 text-4xl">
            <span className="animate-bounce">📖</span>
            <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>✏️</span>
            <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🎯</span>
            <span className="animate-bounce" style={{ animationDelay: '0.3s' }}>⭐</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
