import React, { useEffect, useState, useMemo } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Plus, Star, Calendar, BookOpen, Target, Trash2, Edit, Upload, Search, Filter, SortAsc } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface Book {
  id: string;
  title: string;
  coverImage?: string;
  totalPages: number;
  currentPage: number;
  startDate?: string;
  targetEndDate?: string;
  completedDate?: string;
  targetDays?: number;
  actualDays?: number;
  status: 'to_read' | 'reading' | 'completed';
  rating: number;
  notes?: string;
  progressPercentage: number;
  daysRemaining: number | null;
}

const Books: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  
  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRating, setFilterRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'title' | 'pages' | 'rating' | 'date'>('title');

  const [formData, setFormData] = useState({
    title: '',
    totalPages: '',
    currentPage: '0',
    startDate: '',
    targetEndDate: '',
    targetDays: '',
    status: 'to_read',
    rating: 0,
    notes: '',
    coverImage: null as File | null,
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await api.get('/books');
      setBooks(response.data);
    } catch (error) {
      toast.error('Kitaplar yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append('title', formData.title);
    data.append('totalPages', formData.totalPages);
    data.append('currentPage', formData.currentPage);
    if (formData.startDate) data.append('startDate', formData.startDate);
    if (formData.targetEndDate) data.append('targetEndDate', formData.targetEndDate);
    if (formData.targetDays) data.append('targetDays', formData.targetDays);
    data.append('status', formData.status);
    data.append('rating', formData.rating.toString());
    if (formData.notes) data.append('notes', formData.notes);
    if (formData.coverImage) data.append('coverImage', formData.coverImage);

    try {
      if (editingBook) {
        await api.put(`/books/${editingBook.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Kitap güncellendi! 📚');
      } else {
        await api.post('/books', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Kitap eklendi! 🎉');
      }
      fetchBooks();
      closeModal();
    } catch (error) {
      toast.error('Bir hata oluştu');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu kitabı silmek istediğinden emin misin?')) return;

    try {
      await api.delete(`/books/${id}`);
      toast.success('Kitap silindi');
      fetchBooks();
    } catch (error) {
      toast.error('Kitap silinemedi');
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId === destination.droppableId) return;

    const statusMap: any = {
      'to_read': 'to_read',
      'reading': 'reading',
      'completed': 'completed',
    };

    const newStatus = statusMap[destination.droppableId];

    try {
      await api.patch(`/books/${draggableId}/status`, {
        status: newStatus,
        position: destination.index,
      });

      // Show celebration if completed
      if (newStatus === 'completed') {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }

      toast.success('Kitap durumu güncellendi! ✨');
      fetchBooks();
    } catch (error) {
      toast.error('Güncelleme başarısız');
    }
  };

  const openModal = (book?: Book) => {
    if (book) {
      setEditingBook(book);
      setFormData({
        title: book.title,
        totalPages: book.totalPages.toString(),
        currentPage: book.currentPage.toString(),
        startDate: book.startDate ? book.startDate.split('T')[0] : '',
        targetEndDate: book.targetEndDate ? book.targetEndDate.split('T')[0] : '',
        targetDays: book.targetDays?.toString() || '',
        status: book.status,
        rating: book.rating,
        notes: book.notes || '',
        coverImage: null,
      });
    } else {
      setEditingBook(null);
      setFormData({
        title: '',
        totalPages: '',
        currentPage: '0',
        startDate: '',
        targetEndDate: '',
        targetDays: '',
        status: 'to_read',
        rating: 0,
        notes: '',
        coverImage: null,
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBook(null);
  };

  // Get initials for placeholder
  const getInitials = (title: string) => {
    return title
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get random gradient for placeholder
  const getGradient = (title: string) => {
    const gradients = [
      'from-pink-500 to-rose-500',
      'from-purple-500 to-indigo-500',
      'from-blue-500 to-cyan-500',
      'from-green-500 to-emerald-500',
      'from-orange-500 to-red-500',
      'from-yellow-500 to-orange-500',
    ];
    const index = title.length % gradients.length;
    return gradients[index];
  };

  // Filter and sort books
  const filteredBooks = useMemo(() => {
    let filtered = books.filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRating = filterRating === 0 || book.rating >= filterRating;
      return matchesSearch && matchesRating;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'pages':
          return b.totalPages - a.totalPages;
        case 'rating':
          return b.rating - a.rating;
        case 'date':
          return new Date(b.completedDate || 0).getTime() - new Date(a.completedDate || 0).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [books, searchQuery, filterRating, sortBy]);

  const renderBookCard = (book: Book, index: number) => (
    <Draggable key={book.id} draggableId={book.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`card hover:scale-105 transition-transform ${
            snapshot.isDragging ? 'shadow-2xl rotate-3' : ''
          }`}
        >
          {/* Cover Image or Placeholder */}
          {book.coverImage ? (
            <img
              src={`http://localhost:5000${book.coverImage}`}
              alt={book.title}
              className="w-full h-48 object-cover rounded-xl mb-4"
            />
          ) : (
            <div className={`w-full h-48 bg-gradient-to-br ${getGradient(book.title)} rounded-xl mb-4 flex items-center justify-center`}>
              <span className="text-6xl font-bold text-white opacity-90">
                {getInitials(book.title)}
              </span>
            </div>
          )}
          
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            {book.title}
          </h3>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
              <span>{book.currentPage} / {book.totalPages} sayfa</span>
              <span className="font-bold text-purple-600 dark:text-purple-400">
                %{book.progressPercentage}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${book.progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Rating */}
          {book.rating > 0 && (
            <div className="flex gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= book.rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Days Remaining */}
          {book.daysRemaining !== null && book.status === 'reading' && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              ⏰ {book.daysRemaining > 0 ? `${book.daysRemaining} gün kaldı` : 'Hedef tarihi geçti!'}
            </p>
          )}

          {/* Completed Info */}
          {book.status === 'completed' && book.actualDays && (
            <p className="text-sm text-green-600 dark:text-green-400 mb-3">
              ✅ {book.actualDays} günde tamamlandı!
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => openModal(book)}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Düzenle
            </button>
            <button
              onClick={() => handleDelete(book.id)}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );

  const booksByStatus = {
    to_read: filteredBooks.filter((b) => b.status === 'to_read'),
    reading: filteredBooks.filter((b) => b.status === 'reading'),
    completed: filteredBooks.filter((b) => b.status === 'completed'),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">📚</div>
          <p className="text-xl text-gray-600 dark:text-gray-300">Kitaplar yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
          📚 Kitaplarım
        </h1>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Yeni Kitap Ekle
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Kitap ara..."
              className="input-field pl-10"
            />
          </div>

          {/* Filter by Rating */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(parseInt(e.target.value))}
              className="input-field pl-10"
            >
              <option value={0}>Tüm Puanlar</option>
              <option value={5}>⭐⭐⭐⭐⭐ 5 Yıldız</option>
              <option value={4}>⭐⭐⭐⭐ 4+ Yıldız</option>
              <option value={3}>⭐⭐⭐ 3+ Yıldız</option>
            </select>
          </div>

          {/* Sort */}
          <div className="relative">
            <SortAsc className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="input-field pl-10"
            >
              <option value="title">İsme Göre</option>
              <option value="pages">Sayfa Sayısına Göre</option>
              <option value="rating">Puana Göre</option>
              <option value="date">Tarihe Göre</option>
            </select>
          </div>
        </div>
      </div>

      {/* Celebration */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div className="text-center">
              <div className="text-9xl mb-4 animate-bounce">🎉</div>
              <h2 className="text-5xl font-bold text-white drop-shadow-lg">
                Tebrikler!
              </h2>
              <p className="text-3xl text-white drop-shadow-lg mt-2">
                Bir kitabı daha bitirdin! 🌟
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drag and Drop Columns */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* To Read */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              📖 Okunacak ({booksByStatus.to_read.length})
            </h2>
            <Droppable droppableId="to_read">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`space-y-4 min-h-[200px] p-4 rounded-2xl transition-colors ${
                    snapshot.isDraggingOver
                      ? 'bg-blue-100 dark:bg-blue-900/30'
                      : 'bg-gray-50 dark:bg-gray-800/50'
                  }`}
                >
                  {booksByStatus.to_read.map((book, index) => renderBookCard(book, index))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          {/* Reading */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              📕 Okuyor ({booksByStatus.reading.length})
            </h2>
            <Droppable droppableId="reading">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`space-y-4 min-h-[200px] p-4 rounded-2xl transition-colors ${
                    snapshot.isDraggingOver
                      ? 'bg-purple-100 dark:bg-purple-900/30'
                      : 'bg-gray-50 dark:bg-gray-800/50'
                  }`}
                >
                  {booksByStatus.reading.map((book, index) => renderBookCard(book, index))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          {/* Completed */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              ✅ Bitti ({booksByStatus.completed.length})
            </h2>
            <Droppable droppableId="completed">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`space-y-4 min-h-[200px] p-4 rounded-2xl transition-colors ${
                    snapshot.isDraggingOver
                      ? 'bg-green-100 dark:bg-green-900/30'
                      : 'bg-gray-50 dark:bg-gray-800/50'
                  }`}
                >
                  {booksByStatus.completed.map((book, index) => renderBookCard(book, index))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </DragDropContext>

      {/* Completed Books List */}
      {booksByStatus.completed.length > 0 && (
        <div className="mt-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            🏆 Bitirilen Kitaplar ({booksByStatus.completed.length})
          </h2>
          <div className="card overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Kitap Adı</th>
                  <th className="text-center py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Sayfa</th>
                  <th className="text-center py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Puan</th>
                  <th className="text-center py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Süre</th>
                  <th className="text-center py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Bitiş Tarihi</th>
                  <th className="text-center py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {booksByStatus.completed.map((book) => (
                  <tr key={book.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        {book.coverImage ? (
                          <img
                            src={`http://localhost:5000${book.coverImage}`}
                            alt={book.title}
                            className="w-12 h-16 object-cover rounded-lg"
                          />
                        ) : (
                          <div className={`w-12 h-16 bg-gradient-to-br ${getGradient(book.title)} rounded-lg flex items-center justify-center`}>
                            <span className="text-lg font-bold text-white">
                              {getInitials(book.title)}
                            </span>
                          </div>
                        )}
                        <span className="font-semibold text-gray-800 dark:text-white">{book.title}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center text-gray-600 dark:text-gray-300">
                      {book.totalPages} sayfa
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-center gap-1">
                        {book.rating > 0 ? (
                          [1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= book.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300 dark:text-gray-600'
                              }`}
                            />
                          ))
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500 text-sm">Puanlanmadı</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      {book.actualDays ? (
                        <span className="inline-flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
                          ⏱️ {book.actualDays} gün
                        </span>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500 text-sm">-</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center text-gray-600 dark:text-gray-300">
                      {book.completedDate
                        ? new Date(book.completedDate).toLocaleDateString('tr-TR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : '-'}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => openModal(book)}
                          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors"
                          title="Düzenle"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(book.id)}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card max-w-2xl w-full my-8"
          >
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
              {editingBook ? '✏️ Kitabı Düzenle' : '➕ Yeni Kitap Ekle'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Kitap Adı *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Toplam Sayfa *</label>
                  <input
                    type="number"
                    value={formData.totalPages}
                    onChange={(e) => setFormData({ ...formData, totalPages: e.target.value })}
                    className="input-field"
                    required
                    min="1"
                  />
                </div>
                <div>
                  <label className="label">Okunan Sayfa</label>
                  <input
                    type="number"
                    value={formData.currentPage}
                    onChange={(e) => setFormData({ ...formData, currentPage: e.target.value })}
                    className="input-field"
                    min="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Başlama Tarihi</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label">Hedef Bitiş Tarihi</label>
                  <input
                    type="date"
                    value={formData.targetEndDate}
                    onChange={(e) => setFormData({ ...formData, targetEndDate: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="label">Kapak Resmi</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({ ...formData, coverImage: e.target.files?.[0] || null })
                  }
                  className="input-field"
                />
              </div>

              <div>
                <label className="label">Puan</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="transition-transform hover:scale-125"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= formData.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
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
                  {editingBook ? '💾 Kaydet' : '➕ Ekle'}
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

export default Books;
