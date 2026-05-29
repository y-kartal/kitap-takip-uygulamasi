@echo off
echo.
echo ========================================
echo   Kitap Takip Uygulamasi V2 Baslatiliyor...
echo ========================================
echo.

docker-compose -f docker-compose-v2.yml up -d --build

echo.
echo ========================================
echo   Servisler baslatildi!
echo ========================================
echo.
echo   Frontend: http://192.168.1.9:3001
echo   Backend API: http://192.168.1.9:5001
echo   PostgreSQL: localhost:5433
echo.
echo   Loglari gormek icin:
echo   docker-compose -f docker-compose-v2.yml logs -f
echo.
echo   Durdurmak icin:
echo   docker-compose -f docker-compose-v2.yml down
echo.
echo ========================================
pause
