# 🚀 Kurulum Rehberi

## Gereksinimler

Sisteminizde aşağıdaki yazılımların kurulu olması gerekiyor:

- **Docker Desktop** (Windows/Mac) veya **Docker Engine** (Linux)
- **Docker Compose** (genellikle Docker Desktop ile birlikte gelir)

## Docker Kurulumu

### Windows

1. [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/) indirin
2. İndirilen dosyayı çalıştırın ve kurulum talimatlarını izleyin
3. Kurulum tamamlandıktan sonra bilgisayarınızı yeniden başlatın
4. Docker Desktop'ı açın ve çalıştığından emin olun

### Mac

1. [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop/) indirin
2. .dmg dosyasını açın ve Docker'ı Applications klasörüne sürükleyin
3. Docker'ı Applications'dan başlatın

### Linux (Ubuntu/Debian)

```bash
# Docker kurulumu
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Docker Compose kurulumu
sudo apt-get update
sudo apt-get install docker-compose-plugin

# Kullanıcıyı docker grubuna ekle
sudo usermod -aG docker $USER
newgrp docker
```

## Projeyi Başlatma

### 1. Proje Klasörüne Gidin

```bash
cd kitap-test-takip
```

### 2. Uygulamayı Başlatın

```bash
docker compose up -d
```

Bu komut:
- PostgreSQL veritabanını başlatır
- Backend API'yi başlatır
- Frontend uygulamasını başlatır
- Tüm servisleri arka planda çalıştırır

### 3. İlk Kurulum (Sadece İlk Çalıştırmada)

Örnek verileri yüklemek için:

```bash
docker exec kitap-test-backend npm run seed
```

Bu komut:
- Varsayılan kullanıcı oluşturur (admin/admin123)
- Örnek kitaplar ekler
- Örnek testler ekler
- Rozetleri oluşturur

### 4. Uygulamaya Erişim

Tarayıcınızda şu adresleri açın:

- **Frontend (Ana Uygulama)**: http://localhost:3000
- **Backend API**: http://localhost:5000

**Giriş Bilgileri:**
- Kullanıcı Adı: `vera`
- Şifre: `03022018`

## Yararlı Komutlar

### Uygulamayı Durdurma

```bash
docker compose stop
```

### Uygulamayı Yeniden Başlatma

```bash
docker compose restart
```

### Logları Görüntüleme

Tüm servislerin logları:
```bash
docker compose logs -f
```

Sadece backend logları:
```bash
docker compose logs -f backend
```

Sadece frontend logları:
```bash
docker compose logs -f frontend
```

### Veritabanı Logları

```bash
docker compose logs -f postgres
```

### Container'ları Silme ve Yeniden Oluşturma

```bash
docker compose down
docker compose up -d --build
```

**⚠️ DİKKAT:** `docker compose down -v` komutu verileri de siler!

## Sorun Giderme

### Port Zaten Kullanılıyor Hatası

Eğer 3000, 5000 veya 5432 portları zaten kullanılıyorsa:

1. `docker-compose.yml` dosyasını açın
2. Port numaralarını değiştirin:
   ```yaml
   ports:
     - "3001:80"  # Frontend için
     - "5001:5000"  # Backend için
     - "5433:5432"  # PostgreSQL için
   ```

### Container Başlamıyor

```bash
# Container'ları durdurun
docker compose down

# Yeniden başlatın
docker compose up -d

# Logları kontrol edin
docker compose logs
```

### Veritabanı Bağlantı Hatası

```bash
# PostgreSQL container'ının çalıştığından emin olun
docker compose ps

# PostgreSQL loglarını kontrol edin
docker compose logs postgres

# Container'ı yeniden başlatın
docker compose restart postgres
```

### Resimler Yüklenmiyor

```bash
# Backend container'ını yeniden başlatın
docker compose restart backend

# Uploads klasörünün oluşturulduğundan emin olun
docker exec kitap-test-backend ls -la /app/uploads
```

### Tüm Verileri Sıfırlama

**⚠️ DİKKAT:** Bu işlem tüm kitapları, testleri ve verileri siler!

```bash
# Container'ları ve volume'leri sil
docker compose down -v

# Yeniden başlat
docker compose up -d

# Örnek verileri yükle
docker exec kitap-test-backend npm run seed
```

## Geliştirme Modu

Eğer kod üzerinde değişiklik yapmak istiyorsanız:

### Backend Geliştirme

```bash
cd backend
npm install
npm run dev
```

### Frontend Geliştirme

```bash
cd frontend
npm install
npm start
```

## Yedekleme

### Veritabanı Yedeği Alma

```bash
docker exec kitap-test-db pg_dump -U kitapapp kitap_test_db > backup_$(date +%Y%m%d).sql
```

### Yedeği Geri Yükleme

```bash
docker exec -i kitap-test-db psql -U kitapapp kitap_test_db < backup_20240115.sql
```

### Yüklenen Resimleri Yedekleme

```bash
docker cp kitap-test-backend:/app/uploads ./uploads_backup
```

## Güncelleme

Yeni bir versiyon yayınlandığında:

```bash
# Kodu güncelleyin (git kullanıyorsanız)
git pull

# Container'ları yeniden oluşturun
docker compose down
docker compose up -d --build
```

## Performans İpuçları

1. **Docker Desktop Ayarları**: Docker Desktop > Settings > Resources bölümünden RAM ve CPU ayarlarını artırabilirsiniz
2. **WSL 2 (Windows)**: Windows'ta WSL 2 kullanıyorsanız, projeyi WSL dosya sisteminde tutun
3. **Disk Temizliği**: Kullanılmayan Docker imajlarını temizleyin:
   ```bash
   docker system prune -a
   ```

## Destek

Sorun yaşarsanız:

1. Logları kontrol edin: `docker compose logs`
2. Container durumlarını kontrol edin: `docker compose ps`
3. Docker'ın çalıştığından emin olun: `docker --version`

## Sistem Gereksinimleri

- **RAM**: Minimum 4GB (8GB önerilir)
- **Disk**: Minimum 2GB boş alan
- **İşletim Sistemi**: 
  - Windows 10/11 (64-bit)
  - macOS 10.15 veya üzeri
  - Linux (Ubuntu 20.04+, Debian 10+, vb.)

Başarılar! 🎉
