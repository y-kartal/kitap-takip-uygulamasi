#!/bin/bash

echo "🚀 Kitap Takip Uygulaması V2 Başlatılıyor..."
echo ""

# Docker Compose ile servisleri başlat
docker-compose -f docker-compose-v2.yml up -d --build

echo ""
echo "✅ Servisler başlatıldı!"
echo ""
echo "📱 Frontend: http://192.168.1.9:3001"
echo "🔧 Backend API: http://192.168.1.9:5001"
echo "🗄️  PostgreSQL: localhost:5433"
echo ""
echo "📊 Logları görmek için: docker-compose -f docker-compose-v2.yml logs -f"
echo "🛑 Durdurmak için: docker-compose -f docker-compose-v2.yml down"
echo ""
