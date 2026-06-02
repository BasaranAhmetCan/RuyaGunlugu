# 🏗️ Dream Journal — Proje Mimarisi ve Değişiklik Günlüğü

> **⚠️ AGENTLAR İÇİN ÖNEMLİ KURAL:**
> Bu dosyayı **HER İŞLEM ÖNCESİ OKU**, işlemi yap, sonra **YAPTIĞIN DEĞİŞİKLİĞİ BU DOSYAYA YAZ**.
> Böylece kod tabanını her seferinde baştan taramana gerek kalmaz.

---

## 📋 Proje Özeti

| Alan | Değer |
|------|-------|
| **Proje Adı** | Dream Journal (Rüya Günlüğü) |
| **Açıklama** | Yapay zeka destekli rüya analiz ve günlük uygulaması |
| **Dil** | Türkçe (UI tamamen Türkçe) |
| **Tasarım Teması** | Koyu/Dark, mor tonları ağırlıklı, glassmorphism |
| **Hedef Platform** | Mobil-öncelikli web uygulaması (max-w-md) |

---

## ⚙️ Teknoloji Yığını

| Teknoloji | Versiyon | Kullanım Amacı |
|-----------|----------|----------------|
| **React** | 19.2.6 | UI framework |
| **Vite** | 8.0.12 | Build tool & dev server |
| **React Router DOM** | 7.15.0 | Sayfa yönlendirme (client-side) |
| **Framer Motion** | 12.38.0 | Animasyonlar ve geçişler |
| **Lucide React** | 1.14.0 | İkonlar |
| **Recharts** | 3.8.1 | Grafik ve chartlar (Analytics sayfasında) |
| **TailwindCSS** | 3.4.19 | Utility-first CSS framework |
| **PostCSS** | 8.5.14 | CSS post-processor |
| **Autoprefixer** | 10.5.0 | Tarayıcı uyumu |
| **Capacitor** | 8.x | Native mobil uygulama sarmalayıcı (Android/iOS) |
| **@capacitor/local-notifications** | 8.1.0 | Native alarm bildirimleri |
| **@capacitor/splash-screen** | 8.0.1 | Uygulama açılış ekranı |
| **@capacitor/status-bar** | 8.0.2 | Status bar yapılandırması |
| **@capacitor/app** | 8.1.0 | Uygulama yaşam döngüsü |
| **@capacitor/haptics** | 8.0.2 | Titreşim geri bildirimi |

### Paket Yöneticisi
- **npm** kullanılıyor (`package-lock.json` mevcut)

### Geliştirme Komutları
```bash
npm run dev      # Vite dev sunucusu başlat
npm run build    # Üretim build'i oluştur
npm run lint     # ESLint çalıştır
npm run preview  # Üretim build'ini önizle
```

---

## 🎨 Tasarım Sistemi

### Renk Paleti (tailwind.config.js)
```
dream-dark    → #080B14  (Ana arkaplan - en koyu)
dream-mid     → #0E0D1F  (Orta ton arkaplan)
dream-light   → #1E1433  (Açık arkaplan)
dream-accent  → #8B5CF6  (Ana vurgu rengi - Mor)
```

### Gradient Kullanımı
- **Buton gradientleri:** `from-[#7C3AED] to-[#8B5CF6]`
- **Sayfa arkaplan:** `from-dream-dark via-dream-mid to-dream-light`
- **Glow efektleri:** `shadow-[0_0_20px_rgba(139,92,246,0.4)]`

### Font
- **Ana font:** `Inter` (Google Fonts, system-ui fallback)
- **Font ağırlıkları:** `font-light` (300), `font-medium` (500)
- **Tracking:** `tracking-widest`, `tracking-wider`, `tracking-[0.3em]`

### Glassmorphism Kalıpları
```
bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-xl
bg-dream-mid/80 backdrop-blur-lg
```

---

## 📁 Dosya Yapısı

```
Dream Journal/
├── index.html                    # Ana HTML, root div
├── package.json                  # Bağımlılıklar & scriptler
├── capacitor.config.json         # Capacitor yapılandırması (appId, plugins)
├── tailwind.config.js            # Tailwind özelleştirmeleri
├── postcss.config.js             # PostCSS (tailwind + autoprefixer)
├── vite.config.js                # Vite yapılandırması (react plugin)
├── eslint.config.js              # ESLint kuralları
├── ARCHITECTURE.md               # ← BU DOSYA
│
├── android/                      # Capacitor Android projesi (auto-generated)
│   └── app/src/main/
│       ├── AndroidManifest.xml   # İzinler (alarm, bildirim, wake_lock)
│       ├── assets/public/        # Web build çıktısı (cap sync ile kopyalanır)
│       └── res/                  # Native kaynaklar (ikon, ses dosyaları)
│
├── public/                       # Statik dosyalar
│
└── src/
    ├── main.jsx                  # Uygulama giriş noktası (StrictMode + createRoot)
    ├── App.jsx                   # Router, DreamProvider, AnimatedRoutes, AlarmScheduler, NativeInitializer
    ├── App.css                   # Eski Vite template stilleri (KULLANILMIYOR)
    ├── index.css                 # Global stiller (Tailwind direktifleri + scrollbar)
    │
    ├── assets/
    │   ├── hero.png              # Hero görsel
    │   ├── react.svg             # React logosu (template'ten kalan)
    │   └── vite.svg              # Vite logosu (template'ten kalan)
    │
    ├── components/
    │   └── Layout.jsx            # Ana layout + Bottom Navigation Bar
    │
    ├── context/
    │   └── DreamContext.jsx      # Global state yönetimi (React Context)
    │
    ├── data/
    │   └── mockData.js           # 20 adet örnek rüya verisi + mood data
    │
    ├── utils/
    │   ├── alarmSounds.js        # Web Audio API ile 6 farklı alarm sesi üretimi
    │   └── nativeAlarm.js        # Capacitor native bildirim zamanlayıcı
    │
    └── pages/
        ├── Home.jsx              # Ana sayfa: rüya yazma/sesli kayıt + etiketler
        ├── Journal.jsx           # Günlük: takvim görünümü + rüya listesi
        ├── Analytics.jsx         # Analiz: istatistikler, grafik, etiket frekansı
        ├── Profile.jsx           # İçgörüler: AI bilinçaltı raporu
        ├── DreamDetail.jsx       # Rüya detay: 5 farklı yorumlama sekmesi
        ├── Onboarding.jsx        # Kayıt: isim + doğum tarihi + burç hesaplama
        ├── Alarm.jsx             # Alarm kurma, ses seçimi ve yönetme
        └── AlarmRinging.jsx      # Alarm çalma ekranı (ses + görsel efektler)
```

---

## 🧭 Yönlendirme (Routing) Haritası

```
/onboarding        → Onboarding.jsx    (Layout yok, Auth yok)
/alarm-ringing     → AlarmRinging.jsx   (Layout yok, Auth yok)

/ (Layout içinde, AuthWrapper ile korumalı)
├── /              → Home.jsx           (index route - Rüya girişi)
├── /journal       → Journal.jsx        (Günlük + Takvim)
├── /analytics     → Analytics.jsx      (Analizler)
├── /profile       → Profile.jsx        (AI İçgörüler)
└── /alarm         → Alarm.jsx          (Alarm yönetimi)

/dream/:id         → DreamDetail.jsx    (AuthWrapper ile korumalı, Layout dışında)
```

### Navigasyon Çubuğu (Bottom Nav - Layout.jsx)
| Sıra | İkon | Etiket | Route | Özel |
|------|------|--------|-------|------|
| 1 | Calendar | Günlük | /journal | - |
| 2 | BarChart2 | Analiz | /analytics | - |
| 3 | Mic | _(yok)_ | / | Ortada yükseltilmiş, 14x14 boyut, gradient bg |
| 4 | Sparkles | İçgörü | /profile | - |
| 5 | AlarmClock | Alarm | /alarm | - |

---

## 🧠 State Yönetimi (DreamContext.jsx)

### Context Provider: `DreamProvider`
Tüm uygulama `<DreamProvider>` içinde sarılı. LocalStorage ile persistence sağlanıyor.

### State'ler ve LocalStorage Anahtarları

| State | Tip | LocalStorage Key | Açıklama |
|-------|-----|-------------------|----------|
| `userProfile` | `{ name, dob, zodiac } \| null` | `dreamAI_user` | Kullanıcı profili, null ise Onboarding'e yönlendir |
| `dreams` | `Array<Dream>` | `dreamAI_dreams` | Rüya kayıtları, başlangıçta mockDreams |
| `alarms` | `Array<{ id, time, active, sound }>` | `dreamAI_alarms` | Alarm listesi (sound: alarm ses tonu id'si) |

### Context Fonksiyonları

| Fonksiyon | Parametre | İşlev |
|-----------|-----------|-------|
| `setUserProfile(profile)` | `{name, dob, zodiac}` veya `null` | Profil güncelle/sil (logout) |
| `addDream(dreamData)` | `{text, keywords, interpretations, sentiment, imageUrl}` | Yeni rüya ekle, id + tarih otomatik |
| `toggleFavorite(id)` | `string` | Favori durumunu değiştir |
| `setImageForDream(id, imageUrl)` | `string, string` | Rüyaya AI görsel ekle |
| `deleteDream(id)` | `string` | Rüyayı sil |
| `addAlarm(time, sound)` | `string (HH:MM), string` | Yeni alarm ekle (ses tonu ile) |
| `toggleAlarm(id)` | `string` | Alarm aktif/pasif yap |
| `removeAlarm(id)` | `string` | Alarmı sil |
| `updateAlarmSound(id, sound)` | `string, string` | Alarm ses tonunu değiştir |

### Dream Veri Modeli
```javascript
{
  id: string,               // Date.now().toString() ile oluşturulan benzersiz ID
  date: string,              // "10 Mayıs 2026" formatında Türkçe tarih
  text: string,              // Rüya metni
  keywords: string[],        // Etiketler ["Kabus", "Huzurlu", vb.]
  interpretations: {         // 5 farklı yorumlama
    classic: string,
    freud: string,
    jung: string,
    islamic: string,
    astrological: string
  },
  sentiment: "positive" | "negative" | "neutral",
  isFavorite: boolean,
  imageUrl: string | null    // AI tarafından üretilen görsel URL
}
```

---

## 📄 Sayfa Detayları

### 🏠 Home.jsx — Ana Sayfa (Rüya Girişi)
- **İşlev:** Yeni rüya kaydı oluşturma
- **Özellikler:**
  - Sesle metin girişi (Web Speech API, `tr-TR`)
  - Rastgele placeholder mesajları (5 adet)
  - 10 adet rüya etiketi seçimi (`DREAM_TAGS` sabiti)
  - "Yapay Zeka Yorumluyor" yükleme animasyonu (2.5s timeout)
  - Header: Kullanıcı adı + burç + logout butonu
  - Kayıt sonrası `/dream/:id` sayfasına yönlendirme
- **Sahte AI:** Yorumlamalar sabit metin, gerçek API entegrasyonu yok
- **Speech Recognition:** `window.SpeechRecognition || window.webkitSpeechRecognition`

### 📅 Journal.jsx — Günlük
- **İşlev:** Takvim + rüya listesi
- **Takvim:**
  - Dinamik ay gezinme (ileri/geri)
  - Rüya olan günlerde mor nokta göstergesi
  - Gün tıklama → filtreleme
  - Varsayılan: Mayıs 2026 (mock dataya uyumlu)
  - Haftanın günleri Pazartesi'den başlar
  - Tarih formatı: `"10 Mayıs 2026"` (mock data ile eşleşme zorunlu)
- **Liste:** Tarih, kısa metin, etiketler, favori/sil butonları

### 📊 Analytics.jsx — Analizler
- **İstatistikler:** Toplam rüya sayısı + favori sayısı
- **Grafik:** Recharts `AreaChart` - sentiment bazlı ruh hali eğilimi (0-5 skor)
- **Etiket Analizi:** Top 5 en sık etiket, yüzdelik bar ile gösterim
- **Özel Tooltip:** Mor temalı, puan + mood metni

### ✨ Profile.jsx — İçgörüler
- **İşlev:** AI bilinçaltı raporu (yazılı analiz)
- **Analiz Mantığı (useMemo):**
  - Sentiment dağılımı → pozitif/negatif/nötr baskınlık tespiti
  - En sık etiket → sembolik yorum
  - Kullanıcı burcu → astrolojik bağlam
- **Not:** Gerçek AI yok, rule-based metin üretimi

### 🔍 DreamDetail.jsx — Rüya Detayı
- **Route:** `/dream/:id`
- **Üst kısım:** Görsel alanı (AI üretimi veya placeholder)
  - "Yapay Zeka ile Görselleştir" butonu
  - Simüle DALL-E (4s timeout → Unsplash stok foto)
- **Yorumlama Sekmeleri:** Klasik, Freud, Jung, İslami, Astrolojik
- **Aksiyonlar:** Geri, favori toggle, sil

### 📝 Onboarding.jsx — Kayıt
- **Alanlar:** İsim + Doğum Tarihi (Gün/Ay/Yıl)
- **Burç Hesaplama:** `getZodiacSign()` fonksiyonu, 12 burç tam
- **Özel Dropdown:** `CustomSelect` bileşeni (tarayıcı select yerine)
- **Kayıt Sonrası:** `setUserProfile()` → `/` yönlendirme

### ⏰ Alarm.jsx — Alarm Yönetimi
- **Yeni alarm ekleme:** `<input type="time">` + ses seçici + ekleme butonu
- **Ses Seçici (SoundSelector):** 6 farklı alarm tonu seçimi (grid veya compact mod)
  - Huzurlu Uyanış 🌅, Klasik Alarm ⏰, Melodi 🎵, Kozmik 🌌, Kuş Sesleri 🐦, Rüya Çanı 🔔
  - Her ses için önizleme (play) butonu
- **Liste:** Aktif/pasif toggle, compact ses değiştirici, silme
- **Test butonu:** `/alarm-ringing` sayfasına yönlendirme (seçili sesle)

### 🔔 AlarmRinging.jsx — Alarm Çalma Ekranı
- **Ses:** Web Audio API ile seçilen alarm sesini çalar (loop)
- **Animasyonlar:** Arka plan nabız efekti, zil sallanma, ses dalgası halkaları, equalizer barları
- **Aksiyonlar:**
  - "Hemen Kaydet" → sesi durdur → `/` (Home'a git, rüya yaz)
  - "5 Dakika Ertele" → sesi durdur → 3s sonra geri (simüle)
  - "Sesi Kapat" → sadece sesi durdur

### 🔊 alarmSounds.js — Alarm Ses Modülü
- **Web Audio API** tabanlı, harici ses dosyası gerektirmez
- **6 Farklı Ton:** gentle, classic, melody, cosmic, birds, dream
- **API:** `playAlarmSound(id, loop)`, `previewAlarmSound(id)`, `stopAlarmSound()`
- **AlarmScheduler (App.jsx):** Her 15 saniyede aktif alarmları kontrol eder, saat eşleşirse alarm-ringing'e yönlendirir

---

## 🔐 Kimlik Doğrulama (Auth)

- **Yöntem:** `userProfile` state'inin null olup olmadığı kontrol edilir
- **AuthWrapper:** `userProfile === null && path !== '/onboarding'` ise `/onboarding`'e yönlendir
- **Logout:** `setUserProfile(null)` → LocalStorage temizlenmez (sadece state null'a döner)
  - **⚠️ BUG:** `localStorage.setItem` effect'i `if (userProfile)` koşulunda çalışır, bu yüzden logout'ta LocalStorage güncellenmez. Kullanıcı sayfayı yenilerse eski profil geri gelir!
- **Logout Butonu Konumu:** Home.jsx header'ında (sağ üst köşe, küçük LogOut ikonu)

---

## 📌 Bilinen Sorunlar & Teknik Borçlar

| # | Sorun | Dosya | Açıklama |
|---|-------|-------|----------|
| 1 | Logout LocalStorage'ı temizlemiyor | DreamContext.jsx L29 | `if (userProfile)` koşulu null durumunda çalışmaz |
| 2 | App.css kullanılmıyor | App.css | Vite template'inden kalan dosya, silinebilir |
| 3 | Sahte AI yorumlamaları | Home.jsx L112-129 | Tüm yorumlar sabit metin, gerçek AI entegrasyonu yok |
| 4 | Sahte DALL-E entegrasyonu | DreamDetail.jsx L27-33 | Sabit Unsplash URL'i kullanılıyor |
| 5 | mockMoodData kullanılmıyor | mockData.js L324-345 | Export ediliyor ama hiçbir yerde import edilmiyor |
| 6 | Template asset'ler | assets/ | react.svg ve vite.svg kullanılmıyor, silinebilir |
| 7 | ~~Alarm gerçekte çalmıyor~~ | ~~Alarm.jsx~~ | ✅ **ÇÖZÜLDÜ:** Web Audio API ses + AlarmScheduler zamanlayıcı eklendi |
| 8 | Web Speech API desteği | Home.jsx | Tüm tarayıcılarda desteklenmiyor |

---

## 🔄 Değişiklik Günlüğü

> **Kural:** Her değişiklik bu tabloya eklenecek. En yeni değişiklik EN ÜSTTE olacak.

| Tarih | Yapılan İşlem | Değişen Dosyalar | Detay |
|-------|---------------|------------------|-------|
| 2026-05-12 | 📱 Capacitor mobil entegrasyonu | capacitor.config.json, nativeAlarm.js, DreamContext.jsx, App.jsx, AndroidManifest.xml, android/ | Capacitor kurulumu, native alarm bildirimleri, platform-aware kod, Android projesi oluşturuldu |
| 2026-05-12 | 🔊 Alarm ses sistemi eklendi | alarmSounds.js, Alarm.jsx, AlarmRinging.jsx, DreamContext.jsx, App.jsx | Web Audio API ile 6 alarm tonu, ses seçici UI, gerçek zamanlayıcı (AlarmScheduler), alarm veri modeline sound alanı eklendi |
| 2026-05-12 | 🆕 ARCHITECTURE.md oluşturuldu | ARCHITECTURE.md | Proje mimarisi, dosya yapısı, state yönetimi, routing, veri modelleri ve bilinen sorunlar belgelendi |
| 2026-05-12 | Logout butonu Home header'a taşındı | Home.jsx, Layout.jsx, Profile.jsx | Profile'dan kaldırıldı, Home header'a LogOut ikonu eklendi |
| 2026-05-12 | Navbar "İçgörü" olarak güncellendi | Layout.jsx | Profile tab → "İçgörü" (Sparkles ikonu) |
| 2026-05-12 | Alarm sistemi eklendi | Alarm.jsx, AlarmRinging.jsx, Layout.jsx, App.jsx, DreamContext.jsx | Alarm kurma, test, çalma UI, 5 dk erteleme |
| 2026-05-12 | Branding "Rüya Günlüğü" olarak güncellendi | Home.jsx | Başlık "Dream AI" → "Rüya Günlüğü" |
| 2026-05-12 | Dinamik takvim eklendi | Journal.jsx | Statik takvim yerine ay gezinmeli dinamik takvim |
| 2026-05-12 | CustomSelect dropdown | Onboarding.jsx | Tarayıcı default select → özel mor temalı dropdown |
| 2026-05-12 | Proje oluşturuldu | Tüm dosyalar | Vite + React + TailwindCSS ile başlatıldı |

---

## 📐 Mimari Diyagram

```
┌─────────────────────────────────────────────┐
│                  main.jsx                    │
│            (StrictMode + createRoot)         │
└────────────────────┬────────────────────────┘
                     │
┌────────────────────▼────────────────────────┐
│                  App.jsx                     │
│     DreamProvider → Router → AnimatedRoutes  │
└────────────────────┬────────────────────────┘
                     │
          ┌──────────┼──────────┐
          │          │          │
     (Layout dışı)  (Layout)  (Layout dışı)
          │          │          │
   ┌──────▼──┐  ┌───▼────┐  ┌─▼────────────┐
   │Onboarding│  │Layout  │  │ DreamDetail  │
   │         │  │(NavBar)│  │ (/dream/:id) │
   │Alarm    │  ├────────┤  └──────────────┘
   │Ringing  │  │ Home   │
   └─────────┘  │ Journal│
                │Analytics│
                │ Profile │
                │ Alarm  │
                └────────┘
                     │
        ┌────────────▼────────────────┐
        │     DreamContext.jsx         │
        │  userProfile, dreams, alarms │
        │     ↕ LocalStorage           │
        └──────────────────────────────┘
```

---

## 🛠️ Geliştirme Notları

### Yeni Sayfa Ekleme Adımları
1. `src/pages/YeniSayfa.jsx` oluştur
2. `App.jsx`'te Route ekle (Layout içi mi dışı mı karar ver)
3. Eğer navbar'da yer alacaksa `Layout.jsx`'te NavLink ekle
4. Gerekiyorsa `DreamContext.jsx`'e state/fonksiyon ekle
5. Bu dosyanın **Değişiklik Günlüğü** tablosunu güncelle

### Yeni Veri Alanı Ekleme
1. `mockData.js`'teki Dream objesine alan ekle
2. `DreamContext.jsx`'teki `addDream` fonksiyonunu güncelle
3. İlgili sayfalarda alanı kullan
4. Bu dosyanın **Dream Veri Modeli** bölümünü güncelle

### Stil Kuralları
- Her zaman `dream-*` renklerini kullan
- Kartlar: `bg-white/[0.02] border border-white/5 rounded-3xl`
- Metin opacity: başlık `text-white/90`, açıklama `text-white/50`, etiket `text-white/40`
- Butonlar: gradient arka plan + glow shadow
- Animasyonlar: Framer Motion `initial/animate/exit` pattern'i

