# 📖 Kullanım Kılavuzu

## İçindekiler

1. [Giriş Yapma](#giriş-yapma)
2. [Ana Sayfa (Dashboard)](#ana-sayfa)
3. [Kitap Takibi](#kitap-takibi)
4. [Test Takibi](#test-takibi)
5. [Rozetler](#rozetler)
6. [İpuçları](#ipuçları)

---

## Giriş Yapma

1. Tarayıcınızda http://localhost:3000 adresini açın
2. Kullanıcı adı: `vera`
3. Şifre: `03022018`
4. "Giriş Yap" butonuna tıklayın

---

## Ana Sayfa (Dashboard)

Ana sayfada şunları görebilirsin:

### 📊 İstatistikler
- **Toplam Sayfa**: Şimdiye kadar okuduğun toplam sayfa sayısı
- **Bitirilen Kitap**: Tamamladığın kitap sayısı
- **Güncel Seri**: Kaç gündür üst üste okuyorsun
- **Aylık Test**: Bu ay çözdüğün test sayısı

### 🎯 Günlük Hedef
- Her gün kaç sayfa okumak istediğini gösterir
- İlerleme çubuğu bugün kaç sayfa okuduğunu gösterir
- Hedefini tamamladığında kutlama göreceksin! 🎉

### 📚 Şu An Okuduğun Kitaplar
- Okumakta olduğun kitapların listesi
- Her kitabın ilerleme durumu
- Kalan gün sayısı

### 📝 Son Testlerin
- En son çözdüğün testler
- Net puanların
- Başarı yüzdelerin

### 🏆 Son Kazandığın Rozetler
- Yeni açtığın rozetler burada görünür

---

## Kitap Takibi

### Yeni Kitap Ekleme

1. "Kitaplarım" sayfasına git
2. "Yeni Kitap Ekle" butonuna tıkla
3. Formu doldur:
   - **Kitap Adı**: Kitabın ismini yaz
   - **Toplam Sayfa**: Kitapta kaç sayfa var?
   - **Okunan Sayfa**: Şu ana kadar kaç sayfa okudun?
   - **Başlama Tarihi**: Ne zaman başladın?
   - **Hedef Bitiş Tarihi**: Ne zaman bitirmek istiyorsun?
   - **Kapak Resmi**: Kitabın kapak fotoğrafını yükle
   - **Puan**: Kitabı ne kadar beğendin? (1-5 yıldız)
   - **Notlar**: Kitap hakkında notlar

4. "Ekle" butonuna tıkla

### Kitap Durumlarını Değiştirme

Kitaplar 3 kategoride olabilir:

1. **📖 Okunacak**: Henüz başlamadığın kitaplar
2. **📕 Okuyor**: Şu an okumakta olduğun kitaplar
3. **✅ Bitti**: Tamamladığın kitaplar

**Sürükle-Bırak ile Taşıma:**
- Bir kitabı fareyle tut
- İstediğin kategoriye sürükle
- Bırak!

Kitabı "Bitti" kategorisine taşıdığında kutlama animasyonu göreceksin! 🎉

### Kitap Düzenleme

1. Kitap kartındaki "Düzenle" butonuna tıkla
2. Bilgileri güncelle
3. "Kaydet" butonuna tıkla

### Kitap Silme

1. Kitap kartındaki çöp kutusu ikonuna tıkla
2. Onay ver
3. Kitap silinecek

---

## Test Takibi

### Yeni Test Ekleme

1. "Testlerim" sayfasına git
2. "Yeni Test Ekle" butonuna tıkla
3. Formu doldur:
   - **Test Adı**: Örn: "Deneme 1"
   - **Test Numarası**: Kaçıncı test?
   - **Ders**: Türkçe, Matematik, Hayat Bilgisi veya İngilizce
   - **Test Tarihi**: Testi ne zaman çözdün?
   - **Doğru Sayısı**: Kaç doğru yaptın?
   - **Yanlış Sayısı**: Kaç yanlış yaptın?
   - **Boş Sayısı**: Kaç boş bıraktın?
   - **Notlar**: Test hakkında notlar

4. "Ekle" butonuna tıkla

### Net Hesaplama

Net puanın otomatik hesaplanır:
```
Net = Doğru - (Yanlış / 4)
```

### Başarı Yüzdesi

Başarı yüzden otomatik hesaplanır:
```
Başarı % = (Doğru / Toplam Soru) × 100
```

### Grafikler

**📊 Ders Bazlı Başarı:**
- Her dersten ortalama başarın
- Hangi derste daha iyi olduğunu gösterir

**📈 Haftalık Gelişim:**
- Son 4 haftadaki gelişimin
- İlerlemen artıyor mu?

### İstatistikler

- **Toplam Test**: Kaç test çözdün?
- **En Başarılı Ders**: Hangi derste en iyisin?
- **Gelişim Alanı**: Hangi derste daha çok çalışmalısın?
- **Genel Ortalama**: Tüm testlerdeki ortalama başarın

---

## Rozetler

### Rozet Türleri

#### 📚 Kitap Rozetleri
- **İlk Kitap** 📖: İlk kitabını bitir
- **5 Kitap** 📚: 5 kitap oku
- **10 Kitap** 📕: 10 kitap oku
- **25 Kitap** 🎓: 25 kitap oku

#### 📄 Sayfa Rozetleri
- **100 Sayfa** 📄: 100 sayfa oku
- **500 Sayfa** 📃: 500 sayfa oku
- **1000 Sayfa** 📜: 1000 sayfa oku

#### 🔥 Seri Rozetleri
- **7 Gün Seri** 🔥: 7 gün üst üste oku
- **30 Gün Seri** ⭐: 30 gün üst üste oku
- **100 Gün Seri** 🏆: 100 gün üst üste oku

#### 📝 Test Rozetleri
- **Mükemmel Test** 💯: Bir testte tam puan al
- **10 Test** ✏️: 10 test çöz
- **50 Test** 📝: 50 test çöz

#### ⭐ Özel Rozetler
- **Yüksek Puan** ⭐: Bir kitaba 5 yıldız ver

### Rozet Kazanma

Rozetler otomatik olarak kazanılır:
- Kitap bitirdiğinde
- Test çözdüğünde
- Günlük okuma hedefini tutturduğunda

Yeni bir rozet kazandığında bildirim göreceksin! 🎉

---

## İpuçları

### 🎯 Günlük Hedef Belirleme

1. Profil ayarlarına git
2. Günlük okuma hedefini belirle (örn: 10 sayfa)
3. Her gün bu hedefi tutturmaya çalış
4. Seri oluştur ve rozetler kazan!

### 📚 Kitap Okuma İpuçları

1. **Küçük Hedefler Koy**: Her gün 10-15 sayfa okumak, haftada 1 kitap demek!
2. **Düzenli Ol**: Her gün aynı saatte okumaya çalış
3. **Notlar Al**: Beğendiğin bölümleri not et
4. **Puan Ver**: Kitapları puanla, en sevdiklerini hatırla

### 📝 Test Çözme İpuçları

1. **Düzenli Çalış**: Haftada en az 2-3 test çöz
2. **Yanlışlarını İncele**: Hangi konularda zorlanıyorsun?
3. **Grafikleri Takip Et**: Gelişimini gör
4. **Hedef Koy**: Her hafta biraz daha iyi olmaya çalış

### 🏆 Rozet Toplama İpuçları

1. **Çeşitlilik**: Hem kitap oku, hem test çöz
2. **Düzenlilik**: Her gün biraz çalış
3. **Hedefler**: Bir sonraki rozeti hedefle
4. **Eğlen**: En önemlisi eğlenmek!

### 🎨 Karanlık Mod

Sağ üstteki ay/güneş ikonuna tıklayarak karanlık modu açabilirsin.

### 💾 Veriler

- Tüm veriler güvenle saklanır
- Docker volume kullanıldığı için veriler kaybolmaz
- Düzenli yedek almayı unutma!

---

## Sık Sorulan Sorular

**S: Şifremi değiştirebilir miyim?**
C: Şu anda bu özellik yok, ama gelecek versiyonda eklenecek!

**S: Birden fazla kullanıcı olabilir mi?**
C: Şu an tek kullanıcı için tasarlandı, ama ileride eklenebilir.

**S: Kitap kapağı nasıl yüklenir?**
C: Kitap eklerken veya düzenlerken "Kapak Resmi" bölümünden resim seçebilirsin.

**S: Testlerde kaç soru var?**
C: Doğru + Yanlış + Boş = Toplam soru sayısı otomatik hesaplanır.

**S: Rozetler ne zaman açılır?**
C: Hedeflere ulaştığında otomatik olarak açılır!

---

## Klavye Kısayolları

Şu an klavye kısayolu yok, ama gelecek versiyonda eklenebilir!

---

## Destek

Sorun yaşarsan:
1. Sayfayı yenile (F5)
2. Çıkış yap ve tekrar giriş yap
3. Tarayıcı önbelleğini temizle

İyi okumalar ve başarılar! 📚✨
