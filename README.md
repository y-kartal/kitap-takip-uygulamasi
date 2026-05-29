# 📚 Kitap ve Test Takip Uygulaması

8 yaşındaki çocuklar için tasarlanmış modern, renkli ve kullanıcı dostu bir kitap ve test takip uygulaması.

## 🎯 Özellikler

### 📖 Kitap Takip
- ✅ Kitap ekleme ve kapak fotoğrafı yükleme
- ✅ Sayfa ilerlemesi takibi
- ✅ Otomatik süre hesaplama
- ✅ Sürükle-bırak ile kategori değiştirme
- ✅ 5 yıldız rating sistemi
- ✅ İlerleme göstergeleri ve grafikler
- ✅ Kitap tamamlama kutlaması

### 📝 Test Takip
- ✅ Ders bazlı test girişi (Türkçe, Matematik, Hayat Bilgisi, İngilizce)
- ✅ Otomatik net hesaplama
- ✅ Başarı yüzdesi takibi
- ✅ Ders bazlı grafikler
- ✅ Haftalık ve aylık raporlar

### 🎮 Motivasyon Sistemi
- ✅ Rozet ve kazanım sistemi
- ✅ Günlük okuma serisi
- ✅ Başarı ödülleri
- ✅ Motivasyon mesajları

### 🎨 Tasarım
- ✅ Çocuk dostu renkli arayüz
- ✅ Büyük ikonlar ve butonlar
- ✅ Emoji desteği
- ✅ Karanlık mod
- ✅ Animasyonlar

## 🚀 Kurulum

### Gereksinimler
- Docker
- Docker Compose

### Tek Komutla Başlatma

```bash
docker compose up -d
```

Uygulama otomatik olarak başlayacak:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Database**: PostgreSQL (port 5432)

### İlk Giriş
- **Kullanıcı Adı**: vera
- **Şifre**: 03022018

## 📁 Proje Yapısı

```
.
├── backend/                 # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── controllers/    # API controllers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth & validation
│   │   └── utils/          # Helper functions
│   ├── uploads/            # Kitap kapak resimleri
│   └── Dockerfile
│
├── frontend/               # React + TypeScript + TailwindCSS
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── hooks/         # Custom hooks
│   │   └── utils/         # Helper functions
│   └── Dockerfile
│
└── docker-compose.yml     # Docker orchestration
```

## 🛠️ Geliştirme Modu

Backend geliştirme:
```bash
cd backend
npm install
npm run dev
```

Frontend geliştirme:
```bash
cd frontend
npm install
npm start
```

## 📊 Veritabanı

PostgreSQL kullanılmaktadır. Veriler Docker volume'de saklanır ve container silinse bile kaybolmaz.

### Volume'ler
- `postgres_data`: Veritabanı verileri
- `uploads`: Yüklenen kitap kapak resimleri

## 🔄 Yedekleme

Veritabanı yedeği almak için:
```bash
docker exec kitap-test-db pg_dump -U kitapapp kitap_test_db > backup.sql
```

Yedeği geri yüklemek için:
```bash
docker exec -i kitap-test-db psql -U kitapapp kitap_test_db < backup.sql
```

## 📱 Kullanım

1. **Dashboard**: Ana sayfa, genel istatistikler ve son aktiviteler
2. **Kitaplarım**: Kitap ekleme, düzenleme ve takip
3. **Testlerim**: Test girişi ve analiz
4. **Rozetlerim**: Kazanılan başarılar
5. **Raporlar**: Detaylı istatistikler ve grafikler

## 🎨 Özelleştirme

### Renk Teması
`frontend/src/index.css` dosyasından renkleri özelleştirebilirsiniz.

### Dersler
`backend/src/models/Test.ts` dosyasından ders listesini güncelleyebilirsiniz.

## 🐛 Sorun Giderme

Container'ları yeniden başlatma:
```bash
docker compose restart
```

Logları görüntüleme:
```bash
docker compose logs -f
```

Tüm container'ları silip yeniden başlatma:
```bash
docker compose down
docker compose up -d --build
```

## 📄 Lisans

Bu proje kişisel kullanım için geliştirilmiştir.

## 💝 Kızınıza İyi Okumalar!

Uygulama, çocuğunuzun okuma ve öğrenme alışkanlıklarını eğlenceli bir şekilde takip etmesine yardımcı olacak şekilde tasarlanmıştır. Başarılar! 🎉
