#!/bin/bash

echo "========================================"
echo "  Kitap ve Test Takip Uygulaması"
echo "  Başlatılıyor..."
echo "========================================"
echo ""

# Docker kontrolü
if ! command -v docker &> /dev/null; then
    echo "HATA: Docker bulunamadı!"
    echo "Lütfen Docker'ı yükleyin: https://docs.docker.com/get-docker/"
    exit 1
fi

echo "Docker çalışıyor..."
echo ""

# Container'ları başlat
echo "Container'lar başlatılıyor..."
docker compose up -d

if [ $? -ne 0 ]; then
    echo ""
    echo "HATA: Container'lar başlatılamadı!"
    echo "Lütfen KURULUM.md dosyasını okuyun."
    exit 1
fi

echo ""
echo "========================================"
echo "  Başarılı! Uygulama başlatıldı."
echo "========================================"
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:5000"
echo ""
echo "Giriş Bilgileri:"
echo "  Kullanıcı Adı: vera"
echo "  Şifre: 03022018"
echo ""
echo "İlk kullanımda örnek verileri yüklemek için:"
echo "  docker exec kitap-test-backend npm run seed"
echo ""
echo "Uygulamayı durdurmak için:"
echo "  docker compose stop"
echo ""
