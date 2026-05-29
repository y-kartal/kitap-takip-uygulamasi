# 📚 Kitap Takip Uygulaması - Version 2.0

> Kitaplarını ve testlerini takip et, hedeflerini belirle, istatistiklerini gör! 🎯

[![Version](https://img.shields.io/badge/version-2.0-blue.svg)](https://github.com/y-kartal/kitap-takip-uygulamasi)
[![Docker](https://img.shields.io/badge/docker-ready-brightgreen.svg)](https://www.docker.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## 🌟 Version 2.0 - Yeni Özellikler

### 🎨 Görsel İyileştirmeler
- ✨ **Karanlık Mod Geçiş Butonu** - Sağ üst köşede güneş/ay ikonu ile kolay geçiş
- 📊 **Animasyonlu İstatistikler** - Dashboard'da sayılar yukarı doğru sayarak artıyor
- 🎨 **Kitap Kapağı Placeholder** - Kapak resmi olmayan kitaplar için renkli gradient arka planlar
- 🖱️ **Gelişmiş Hover Efektleri** - Kartlara hover'da animasyonlu gölge ve yükselme efekti

### 📊 Yeni Sayfalar
- **İstatistikler Sayfası**
  - 📈 Aylık/yıllık okunan kitap grafikleri
  - 🎭 Tür dağılımı analizi
  - ⚡ Ortalama okuma hızı (sayfa/saat)
  - 📖 Toplam okunan sayfa sayısı
  - 🎯 Yıllık hedef takibi

- **Ayarlar Sayfası**
  - 👤 Profil özelleştirme
  - 🎨 5 farklı tema rengi (Mor, Mavi, Yeşil, Pembe, Turuncu)
  - 🎯 Günlük/yıllık okuma hedefleri
  - 📚 Favori türler yönetimi

### 🔍 Kitaplar Sayfası İyileştirmeleri
- 🔎 **Arama** - Kitap adına göre anlık arama
- 🎚️ **Filtreleme** - Puana göre filtreleme (5⭐, 4+⭐, 3+⭐)
- 📊 **Sıralama** - İsim, sayfa sayısı, puan, tarihe göre sıralama
- 🎨 **Renkli Placeholder** - Kapak resmi olmayan kitaplar için baş harflerle gradient

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Docker & Docker Compose
- Git

### Kurulum

```bash
# Repo'yu klonla
git clone https://github.com/y-kartal/kitap-takip-uygulamasi.git
cd kitap-takip-uygulamasi

# V2 branch'ine geç
git checkout v2-development

# V2'yi başlat
docker-compose -f docker-compose-v2.yml up -d --build
```

### Erişim
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:5001
- **Database**: localhost:5433

### Varsayılan Kullanıcı
- **Kullanıcı Adı**: `vera`
- **Şifre**: `03022018`

## 📦 Branch Yapısı

### `main` - Version 1.0 (Stabil)
- Temel kitap takip özellikleri
- Test takip sistemi
- Başarı rozetleri
- Okuma serileri
- **Port**: 3000 (frontend), 5000 (backend), 5432 (db)

### `v2-development` - Version 2.0 (Yeni Özellikler)
- Tüm V1 özellikleri +
- 5 tema rengi sistemi
- İstatistikler sayfası
- Ayarlar sayfası
- Arama & filtreleme
- Gelişmiş animasyonlar
- **Port**: 3001 (frontend), 5001 (backend), 5433 (db)

## 🎯 Özellikler

### 📚 Kitap Yönetimi
- ✅ Kitap ekleme/düzenleme/silme
- ✅ Kapak resmi yükleme
- ✅ Drag & drop ile durum değiştirme (Okunacak → Okuyor → Bitti)
- ✅ İlerleme takibi (sayfa bazında)
- ✅ Hedef tarih belirleme
- ✅ Puan verme (5 yıldız sistemi)
- ✅ Notlar ekleme
- ✅ Tamamlanma süresi hesaplama

### 📝 Test Takibi
- ✅ Test sonuçları girişi
- ✅ Net hesaplama
- ✅ Başarı yüzdesi
- ✅ Ders bazlı analiz
- ✅ Grafik gösterimi

### 🏆 Başarı Sistemi
- ✅ Otomatik rozet kazanma
- ✅ Okuma serileri takibi
- ✅ Motivasyon mesajları
- ✅ İlerleme göstergeleri

### 📊 İstatistikler (V2)
- ✅ Aylık kitap grafikleri
- ✅ Tür dağılımı
- ✅ Okuma hızı analizi
- ✅ Yıllık hedef takibi

### ⚙️ Kişiselleştirme (V2)
- ✅ 5 farklı tema rengi
- ✅ Karanlık/aydınlık mod
- ✅ Profil özelleştirme
- ✅ Hedef belirleme

## 🛠️ Teknolojiler

### Frontend
- React 18 + TypeScript
- Tailwind CSS
- Framer Motion (animasyonlar)
- React Beautiful DnD (drag & drop)
- React Hot Toast (bildirimler)
- Lucide React (ikonlar)

### Backend
- Node.js + Express
- TypeScript
- TypeORM
- PostgreSQL
- JWT Authentication
- Multer (dosya yükleme)
- Node-cron (zamanlanmış görevler)

### DevOps
- Docker & Docker Compose
- Nginx (reverse proxy)
- Multi-stage builds

## 📖 Kullanım

### V1 ve V2'yi Birlikte Çalıştırma

```bash
# V1'i başlat
docker-compose up -d

# V2'yi başlat
docker-compose -f docker-compose-v2.yml up -d

# Her iki versiyon da çalışıyor!
# V1: http://localhost:3000
# V2: http://localhost:3001
```

### Logları İzleme

```bash
# V2 logları
docker-compose -f docker-compose-v2.yml logs -f

# Sadece backend logları
docker-compose -f docker-compose-v2.yml logs -f backend
```

### Durdurma

```bash
# V2'yi durdur
docker-compose -f docker-compose-v2.yml down

# Veritabanı ile birlikte sil
docker-compose -f docker-compose-v2.yml down -v
```

## 📸 Ekran Görüntüleri

### Dashboard
- Hoş geldin mesajı
- Günlük hedef göstergesi
- Okunan kitaplar
- Son testler
- Başarı rozetleri

### Kitaplar (V2)
- Arama çubuğu
- Filtreleme seçenekleri
- Drag & drop kolonlar
- Renkli placeholder'lar
- Bitirilen kitaplar tablosu

### İstatistikler (V2)
- Yıllık hedef göstergesi
- Aylık kitap grafikleri
- Tür dağılımı
- Okuma hızı kartı

### Ayarlar (V2)
- Profil bilgileri
- Tema rengi seçimi
- Okuma hedefleri
- Favori türler

## 🔜 Gelecek Özellikler

- 📖 Alıntılar bölümü
- ⏱️ Okuma zamanlayıcı (Pomodoro)
- 🏆 Daha fazla rozet ve başarılar
- 📱 Gelişmiş mobil optimizasyon
- 🔔 Bildirimler sistemi
- 👥 Sosyal özellikler
- 📚 Kitap kulübü

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'feat: Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 👤 Geliştirici

**Yasin Kartal**
- GitHub: [@y-kartal](https://github.com/y-kartal)

## 🙏 Teşekkürler

Bu projeyi kullandığınız için teşekkürler! ⭐ vermeyi unutmayın!

---

Made with 💖 for young readers
