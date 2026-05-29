# 📚 Kitap Takip Uygulaması - Version 2.0

## 🎉 Yeni Özellikler

### 🎨 Görsel İyileştirmeler
- ✅ **Karanlık Mod Geçiş Butonu** - Sağ üst köşede güneş/ay ikonu
- ✅ **Animasyonlu İstatistikler** - Sayılar yukarı doğru sayarak artıyor
- ✅ **Kitap Kapağı Placeholder** - Kapak resmi olmayan kitaplar için renkli gradient arka planlar
- ✅ **Gelişmiş Hover Efektleri** - Kartlara hover'da animasyonlar

### 📊 Yeni Özellikler
- ✅ **İstatistikler Sayfası**
  - Aylık/yıllık okunan kitap grafikleri
  - Tür dağılımı
  - Ortalama okuma hızı
  - Toplam okuma süresi
  
- ✅ **Kitap Arama ve Filtreleme**
  - Kitap adına göre arama
  - Puana göre filtreleme
  - Sayfa sayısına göre sıralama
  
- ✅ **Okuma Hedefleri**
  - Yıllık kitap okuma hedefi
  - Hedefe ulaşma yüzdesi
  - Motivasyon mesajları

- ✅ **Ayarlar Sayfası**
  - Profil özelleştirme
  - Tema rengi seçimi (Mor, Mavi, Yeşil, Pembe, Turuncu)
  - Günlük/yıllık hedef belirleme
  - Favori türler ekleme

### 🎯 Gelecek Özellikler (Yakında)
- 📖 Alıntılar bölümü
- ⏱️ Okuma zamanlayıcı (Pomodoro)
- 🏆 Daha fazla rozet ve başarılar
- 📱 Gelişmiş mobil optimizasyon
- 🔔 Bildirimler sistemi

## 🚀 Kurulum

### V2'yi Başlatma

```bash
# Linux/Mac
chmod +x start-v2.sh
./start-v2.sh

# Windows
docker-compose -f docker-compose-v2.yml up -d --build
```

### Erişim Bilgileri

- **Frontend**: http://192.168.1.9:3001
- **Backend API**: http://192.168.1.9:5001
- **PostgreSQL**: localhost:5433

### Varsayılan Kullanıcı
- **Kullanıcı Adı**: vera
- **Şifre**: 03022018

## 📝 V1 ile Farklar

| Özellik | V1 | V2 |
|---------|----|----|
| Port (Frontend) | 3000 | 3001 |
| Port (Backend) | 5000 | 5001 |
| Port (PostgreSQL) | 5432 | 5433 |
| Veritabanı | kitap_test_db | kitap_test_db_v2 |
| Tema Sistemi | Sadece Dark Mode | 5 Farklı Tema Rengi |
| İstatistikler | Basit | Detaylı Grafikler |
| Arama/Filtreleme | Yok | Var |
| Placeholder | Yok | Renkli Gradient |
| Animasyonlar | Basit | Gelişmiş |

## 🛠️ Geliştirme

### Backend Değişiklikleri
- Yeni modeller: `Quote`, `ReadingSession`
- User modeline eklenenler: `level`, `xp`, `yearlyBookGoal`, `themeColor`, `bio`, `favoriteGenres`, `totalReadingMinutes`
- Book modeline eklenenler: `genre`, `author`

### Frontend Değişiklikleri
- Yeni sayfalar: `Statistics.tsx`, `Settings.tsx`
- Yeni context: `ThemeContext.tsx`
- Güncellenmiş: `Books.tsx` (arama, filtreleme, placeholder)
- Güncellenmiş: `Dashboard.tsx` (animasyonlu sayaçlar)

## 📦 Docker Komutları

```bash
# V2'yi başlat
docker-compose -f docker-compose-v2.yml up -d

# Logları izle
docker-compose -f docker-compose-v2.yml logs -f

# Durdur
docker-compose -f docker-compose-v2.yml down

# Veritabanı ile birlikte sil
docker-compose -f docker-compose-v2.yml down -v

# Yeniden build et
docker-compose -f docker-compose-v2.yml up -d --build
```

## 🔄 V1'den V2'ye Geçiş

V1 ve V2 aynı anda çalışabilir! Farklı portlar kullanıyorlar:

```bash
# V1'i çalıştır
docker-compose up -d

# V2'yi çalıştır
docker-compose -f docker-compose-v2.yml up -d

# İkisi de çalışıyor!
# V1: http://192.168.1.9:3000
# V2: http://192.168.1.9:3001
```

## 🎨 Tema Renkleri

V2'de 5 farklı tema rengi var:
- 💜 **Mor** (Varsayılan)
- 💙 **Mavi**
- 💚 **Yeşil**
- 💗 **Pembe**
- 🧡 **Turuncu**

Ayarlar sayfasından değiştirebilirsin!

## 📸 Ekran Görüntüleri

### Yeni İstatistikler Sayfası
- Yıllık hedef göstergesi
- Aylık kitap grafikleri
- Tür dağılımı
- Okuma hızı

### Yeni Ayarlar Sayfası
- Profil bilgileri
- Tema rengi seçimi
- Okuma hedefleri
- Favori türler

### Güncellenmiş Kitaplar Sayfası
- Arama çubuğu
- Filtreleme seçenekleri
- Sıralama
- Renkli placeholder'lar

---

Made with 💖 for young readers - Version 2.0
