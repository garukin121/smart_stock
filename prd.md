# Product Requirement Document (PRD)

## Prediksi Kebutuhan Stok Produk Secara Adaptif Menggunakan Metode Fuzzy Tsukamoto Berdasarkan Data Penjualan Harian untuk UMKM

### 1. Product Overview
**Deskripsi Sistem**
Sistem ini merupakan platform manajemen stok dan prediksi kebutuhan barang berbasis web dashboard dan Telegram bot yang dirancang khusus untuk Usaha Mikro, Kecil, dan Menengah (UMKM), khususnya tukang sayur, warung sembako, atau toko kecil. Sistem ini secara adaptif memprediksi jumlah stok produk (misal: sayuran segar, bumbu dapur, tahu/tempe) yang harus disiapkan untuk hari berikutnya menggunakan metode logika Fuzzy Tsukamoto berdasarkan data historis penjualan harian.

**Background Masalah**
Banyak UMKM kelas mikro kesulitan menentukan berapa banyak barang dagangan yang harus dibeli atau disiapkan setiap harinya. Jika stok terlalu banyak, barang mudah rusak (perishable goods) dan menimbulkan kerugian. Jika terlalu sedikit, penjual kehilangan potensi keuntungan dan mengecewakan pelanggan. Pencatatan yang konvensional/manual menyulitkan pedagang membuat keputusan operasional yang berbasis data (data-driven).

**Tujuan Sistem**
Membangun asisten cerdas yang mendigitalisasi pencatatan transaksi secara praktis via Telegram dan memberikan angka rekomendasi (prediksi) pengadaan stok barang secara otomatis setiap malam, agar pedagang siap berbelanja stok di pasar induk subuh harinya untuk meminimalisir kerugian (food waste) dan mengoptimalkan keuntungan.

**Value Proposition**
- Kemudahan administrasi dan input transaksi layaknya mengirim pesan obrolan via Telegram Bot yang familiar.
- Prediksi restock yang saintifik dan presisi menggunakan kecerdasan komputasional (Fuzzy Tsukamoto).
- Antarmuka visual yang informatif melalui Web Dashboard untuk laporan laba/rugi dan tren komoditas.

---

### 2. Problem Statement
**Masalah yang Dialami UMKM**
1. **Lemahnya Sistem Pencatatan**: Pedagang seringkali hanya mengingat-ingat atau mencatat di buku yang rawan basah, kotor, dan hilang.
2. **Estimasi Stok Berdasarkan Insting (Feeling)**: Keputusan pembelian pasokan harian di pasar grosir hanya mengandalkan intuisi, seringkali meleset dengan realita permintaan pasar harian.
3. **Kendala Adopsi Teknologi (Hardware)**: Pedagang sayur keliling atau pedagang pasar lapak kecil tidak memiliki anggaran atau tempat untuk menginstalasi komputer/tablet Point of Sales (POS) yang mahal dan kompleks.

**Dampak dari Masalah Tersebut**
1. **Food Waste & Kerugian Finansial**: Barang segar (sayuran, ayam, daging) yang tidak terjual kehilangan nilai jual drastis, busuk, dan dibuang.
2. **Kehilangan Pelanggan Setia**: Barang esensial yang dicari pelanggan sering habis terlalu pagi (stockout).
3. **Sulit Berkembang (Scaling)**: Sulit menganalisis secara tepat produk mana yang paling mendatangkan keuntungan (best seller) dan produk mana yang justru menghabiskan modal harian.

---

### 3. Product Goals
**Tujuan Utama**
Menyediakan asisten prediktif ringan dan cepat yang beroperasi di latar belakang, membebaskan waktu pemilik UMKM dari administrasi rumit sekaligus berperan sebagai penasihat suplai harian.

**Tujuan Bisnis**
- Menurunkan angka kerugian akibat sisa stok yang basi atau busuk sebesar 30-40%.
- Meningkatkan efisiensi sirkulasi modal belanja harian agar UMKM bisa bertahan lebih tangguh secara ekonomi.

**Tujuan Teknis**
- Mengimplementasikan sistem chatbot Telegram responsif dengan arsitektur async webhook ber-latency rendah (< 500 ms).
- Mengintegrasikan mesin algoritma Fuzzy Tsukamoto yang berjalan mulus melalui cron/job scheduler dengan nilai Mean Absolute Percentage Error (MAPE) yang dapat ditekan seminimal mungkin pada saat proses evaluasi (testing skripsi).
- Menyajikan dashboard web yang dinamis, ringan, dan ramah akses seluler (mobile-first design).

---

### 4. Target Users
**Persona Pengguna**
- **Nama Profil**: Pak Budi (Pedagang Sayur)
- **Umur**: 35-50 tahun
- **Pekerjaan**: Pemilik lapak pasar basah atau penjual sayuran segar di perumahan.

**Karakteristik Pengguna**
- Memiliki literasi digital menengah ke bawah; namun sangat fasih menggunakan WhatsApp, Facebook, dan Telegram untuk komunikasi harian.
- Lingkungan kerjanya sangat sibuk di rentang waktu jam 05:00 s.d. 10:00 pagi (melayani banyak transaksi tunai kecil secara cepat).
- Hanya memiliki waktu santai untuk mengecek rekap dan mengevaluasi dagangan di siang atau sore hari.

**Pain Points**
- "Saya selalu bingung, kalau besok libur panjang, cabai rawit dilarisin atau distok biasa saja? Kadang rugi busuk, kadang untung kehabisan gasik."
- "Mencatat pakai bolpoin itu merepotkan, tangan saya kotor dan habis pegang ikan/sayur basah."

---

### 5. User Stories
Berikut adalah batasan interaksi user dengan sistem (sebagai panduan alur program):

1. **Sebagai** pedagang sayur, **saya ingin** dapat mencatat penjualan 2 ikat kangkung hanya dengan ngetik di Telegram, **sehingga** saya tidak perlu buku catatan fisik di lapak.
2. **Sebagai** pedagang sayur, **saya ingin** bisa mengecek jumlah stok tomat saat ini via command `/cek_stok`, **sehingga** saya mengetahui sisa barang secara real-time.
3. **Sebagai** pengguna sistem, **saya ingin** mendapatkan pesan Telegram setiap jam 22:00 tentang rekomendasi jumlah kulakan besok, **sehingga** saya bisa menyalinnya sebagai catatan belanja subuh saya ke pasar induk.
4. **Sebagai** pengguna, **saya ingin** menambahkan sisa pasokan stok baru dari suplier (restock) lewat bot, **sehingga** data inventory di sistem otomatis terupdate naik.
5. **Sebagai** pemilik usaha, **saya ingin** melihat persentase penjualan produk yang paling laku di Web Dashboard, **sehingga** saya mengetahui komoditi pendorong omzet terbesar.
6. **Sebagai** analis (atau dosen penguji), **saya ingin** melihat perbandingan Riwayat Prediksi vs Penjualan Aktual, **sehingga** reliabilitas dan akurasi logika Fuzzy dapat dibuktikan.
7. **Sebagai** admin lapak, **saya ingin** mengelola (tambah, hapus, ubah) master data produk baru secara visual lewat Dashboard, **sehingga** produk baru tersebut dapat langsung ditransaksikan via Bot keesokan harinya.
8. **Sebagai** pedagang sayur, **saya ingin** mendapatkan pesan peringatan otomatis jika persediaan bawang merah telah di bawah persentase aman, **sehingga** saya segera bersiap menginformasikan pembeli.
9. **Sebagai** pemilik usaha, **saya ingin** meminta bot merekapitulasi total uang berputar hari ini dari total transaksi, **sehingga** saya mudah mencocokkan fisik uang tunai di tas pinggang saya.
10. **Sebagai** pengguna dengan mobilitas tinggi, **saya ingin** dapat membuka halaman web dashboard dari browser telepon genggam dengan antarmuka yang menyesuaikan ukuran layar, **sehingga** saya dapat memonitor performansi warung dari manapun di sore hari.

---

### 6. System Architecture

Sistem ini didesain mengkombinasikan pengolah pesan teks (chat application) dan aplikasi konvensional. Arsitektur mencakup:
- **Telegram Messaging Gateway / API**: Portal resmi API telegram yang berhubungan langsung dengan aplikasi smartphone Pak Budi, bertindak sebagai UI input data super cepat.
- **Backend API Server**: "Otak" sistem yang meregistrasi Webhook dari Telegram API untuk menerima setiap command, memvalidasinya, dan menjalankan logika bisnis (pengurangan/penambahan ke Database).
- **Tsukamoto Prediction Engine**: Pustaka klasifikasi algoritma fuzzy mandiri yang terslot ke backend; memuat rules, rentang fuzzy, proses fuzzifikasi, komputasi inferensi MIN, hingga kalkulasi Z Akhir (Defuzzifikasi rata-rata terbobot).
- **Job Scheduler Module**: Watchdog process yang menunggu jam tertentu untuk otomatis menyerahkan input terbaru ke Tsukamoto Prediction Engine dan mengirim payload via Webhook.
- **Relational Database**: Tempat penyandaran akhir (storage) yang mencatat entitas terstruktur dan riwayat logik.
- **Web Dashboard (Frontend)**: Web Application berupa Single Page Application (SPA) yang menvisualisasikan summary dari Database melalui RESTful JSON API yg disediakan Backend API Server.

---

### 7. Functional Requirements

#### Modul Chatbot (Telegram Bot):
1. **Input Transaksi Penjualan (`/jual [ID_Barang/Nama] [Jumlah]`)**
   Contoh: `/jual bayam 5`. Fitur ini mensyaratkan pengecekan stok (apabila stok tercatat hanya sisa 3, bot harus mengembalikan validasi error).
2. **Input Stok Masuk (`/restock [ID_Barang/Nama] [Jumlah]`)**
   Digunakan sepulang dari pasar pagi. Contoh: `/restock cabai 10`. Akan men-sumulasi kuantitas lama dengan 10 kg baru.
3. **Pengecekan Stok Aktif (`/cek_stok`)**
   Bot memformat hasil database mnjadi bullet points. misal: "- Bayam: 5 Ikat", "- Tahu: 15 Pcs".
4. **Perintah Rekap Keuangan (`/rekap_harian`)**
   Sistem men-SUM pendapatan dari subtotal Transaksi dan mengabarkannya ke chat.
5. **Auto-Broadcast (Non-Perintah)**
   Sistem diizinkan melakukan push-message kepada Chat ID pengguna ketika jadwal cron dieksekusi atau peringatan stok limit dipanggil.

#### Modul Web Dashboard:
1. **Overview Dashboard**
   - Menampilkan total modal pembelian vs. estimasi pendapatan perhari secara grafis ringan.
   - Ringkasan "Produk Kritis" (Stok < x).
2. **Monitoring Stok (Inventory Level)**
   - Matrix data visual menampilkan produk lengkap dengan status "Aman", "Menipis", "Warning Kosong".
3. **Grafik & Analytics**
   - Panel berisi Line Chart trend penjualan harian dalam rentang waktu terfilter (Daily, Weekly, Monthly) per SKU Produk.
4. **Riwayat Transaksi**
   - Tabel Data log historis kapan transaksi terjadi, berapa qty nya, dsb untuk keperluan audit stok jika dikira terjadi typo input.
5. **Halaman Riset/Laporan Prediksi (Prediction Results)**
   - Halaman laporan paling penting bagi skripsi: menampilkan tanggal prediksi, Output Rekomendasi Fuzzy, Actual Terjual, dan deviasi/selisih akurasinya.

---

### 8. Non Functional Requirements
- **Performance (Kinerja)**: Bot harus seketika menjawab (respon cepat menekan frustasi user) maksimal < 800ms per trigger. Proses iterasi array logika Fuzzy wajib selesai di bawah 15 detik untuk komputasi seluruh SKU.
- **Scalability (Skalabilitas)**: Backend minimal menggunakan pool database connection untuk bersiap melayani HTTP request secara asinkronus (async/await paradigm).
- **Security (Keamanan)**: Backend Telegram Webhook wajib diotentikasikan (hanya mendaftarkan token unik atau Chat ID unik pak Budi di level file environment, sehingga orang asing yang menemukan nama bot ini di pencarian telegram tidak bisa menjalankan update command apalagi `/jual`).
- **Usability (Kegunaan)**: Menanggulangi salah saji data, input telegram di-regex parsing dgn baik untuk menghindari error fatal jika user lupa memberi spasi. Desain Web mutlak Responsive Web Design (RWD).
- **Reliability (Keandalan)**: Implementasi blok logika Try-Except pada saat komunikasi eksternal (Telegram Down) agar server tidak mengalami aplikasi Crash/Exit process yang menghentikan scheduler.

---

### 9. Data Model / Database Design

**1. users**
Mengelola kredensial dan hak otorisasi UMKM.
- `id` (UUID, PK) -> Unique identifier.
- `telegram_chat_id` (String, Unique) -> ID percakapan pribadi telegram yang diizinkan untuk operasional bot.
- `name` (String) -> Nama panggilan (e.g. Pak Budi).
- `role` (String) -> "admin" atau "kasir".
- `created_at` (Timestamp).

**2. products**
Katalog inventory dagangan toko.
- `id` (UUID, PK).
- `kode_sku` (String, Unique) -> Kode pendek (e.g. TR-BYM untuk Terikat Bayam) untuk memudahkan diketik di hp.
- `name` (String) -> Nama produk (e.g. Bayam Segar).
- `price` (Decimal) -> Harga jual harian ke pelanggan.
- `unit` (String) -> Unit kemasan (Ikat, Kg, Pcs, Gram).
- `min_stock_alert` (Decimal) -> Threshold alert notifikasi menipis.

**3. transactions**
Historis rekaman jurnal penjualan yang di-entry via Bot.
- `id` (UUID, PK).
- `product_id` (UUID, FK -> products).
- `quantity` (Decimal) -> Jumlah item terjual.
- `subtotal` (Decimal) -> Qty x Harga.
- `created_at` (Timestamp) -> Bukti datetime penjualan.

**4. inventory**
Log state yang menandakan real-time stok sekarang di fisik keranjang lapak.
- `id` (UUID, PK).
- `product_id` (UUID, FK -> products).
- `current_qty` (Decimal) -> Sisa kuantiti asli sekarang.
- `last_updated` (Timestamp).

**5. predictions**
Tabel krusial untuk menyimpan result defuzzifikasi Tsukamoto per hari.
- `id` (UUID, PK).
- `product_id` (UUID, FK -> products).
- `target_date` (Date) -> Tanggal "Target/Untuk Kapan" prediksi ini (biasanya date_now + 1 Hari/Besok).
- `demand_value` (Decimal) -> (INPUT FISIK) Angka demand/penjualan akumulatif di hari ini sebagai parameter masuk Tsukamoto.
- `stock_value` (Decimal) -> (INPUT FISIK) Angka Sisa stok akhir di lapak sore ini sebagai parameter Tsukamoto.
- `predicted_restock_qty` (Decimal) -> (OUTPUT TEGAS/CRISP) Rekomendasi/Saran keputusan "Berapa banyak belanja besok".
- `created_timestamp` (Timestamp) -> Waktu cron berjalan (misal: 22:00:03).

---

### 10. Prediction System (Fuzzy Tsukamoto)

Metode Fuzzy Tsukamoto sangat tepat untuk case skripsi ini sebab setiap konsekuen / aturan IF-THEN dibentuk dengan sebuah himpunan fuzzy linear monoton, dan nilai keluaran akhirnya sangat definitif (*crisp*) sehingga mudah dibaca pedagang (bukan nilai probabilitas, langsung angka konkret).

**Variabel Input (Contoh Himpunan)**
1. **Permintaan (Volume Penjualan Hari Ini)**:
   Terdiri dari himpunan: `{Turun, Stabil, Naik}`. Batasan parameter (range of universe) ditentukan adaptif mengikuti rata-rata historis (misal batas bawah 5 ikat, batas atas 25 ikat).
2. **Sisa Stok (Kuantitas di Inventory Sore / Malam Ini)**:
   Terdiri dari himpunan: `{Sedikit, Sedang, Banyak}`.

**Variabel Output**
- **Saran Pengadaan (Tingkat Barang Tambahan Dibeli)**:
  Terdiri dari himpunan: `{Berkurang/Sedikit, Sedang, Bertambah/Banyak}`.

**Fungsi Keanggotaan (Membership Function)**
Sistem menggunakan Representasi Kurva Linear turun dan naik. Contoh: Untuk mengevaluasi kebenaran linguistik "Permintaan Turun", apabila penjualan (y) semakin mendekati batas bawah (y_min), maka derajat kebenarannya (μ) memuncak di 1.

**Contoh Aturan (Fuzzy Rules Formulation)**
Sebagian matriks rule (Total rule biasanya 3 x 3 = 9 Kombinasi Aturan):
- **[R1]**: **IF** Permintaan NAIK **AND** Sisa Stok BANYAK **THEN** Saran Pengadaan SEDANG.
- **[R2]**: **IF** Permintaan NAIK **AND** Sisa Stok SEDIKIT **THEN** Saran Pengadaan BANYAK.
- **[R3]**: **IF** Permintaan TURUN **AND** Sisa Stok BANYAK **THEN** Saran Pengadaan SEDIKIT.

**Contoh Proses Inferensi & Kalkulasi Harian**
1. **Fuzzifikasi**: Malam ini, Kangkung terjual 18 Ikat. Berdasar algoritma, sistem menghitung bahwa 18 Ikat masuk derajat `μ(NAIK) = 0.8` dan derajat `μ(STABIL) = 0.2`. Dan di lapak sisa stok Kangkung sore ini berjumlah 3 Ikat, alias `μ(SEDIKIT) = 0.9`.
2. **Inferensi Mesin**: Sistem menjalankan operasi `MIN` pada setiap interaksi rule untuk menemukan predikat Alpha (α-predicate) dari semua kombinasi, lalu memetakan batas nilai keluaran (Output Z).
3. **Defuzzifikasi**: Penentuan Crisp Value di Tsukamoto ditertibkan menggunakan persamaan Rata-Rata Terpusat (Weighted Average), yaitu `Output Z_akhir = Σ(α_i * Z_i) / Σ(α_i)`.
Misalnya jika dihitung matematika hasilnya adalah `Z_akhir = 22.46`. Maka besok subuh hari, pedagang direkomendasikan berbelanja atau memborong kangkung sebesar **22 Ikat**.

---

### 11. Scheduler System
Scheduler merupakan inti utama pembawa pesan.
**Langkah Flow Scheduler Jam 22:00:**
1. **Trigger Engine**: Pukul 22:00, service background Python (misal `APScheduler` cron tugas) terbangun secara eksklusif (agar tidak diganggu I/O Telegram lain).
2. **Aggregation Phase**: Meringkas atau `SELECT SUM()` total transaksi di tabel `transactions` yang berwaktu stempel "Hari Ini" dari jam 00:00 sampai 21:59. Mengambil data current_qty per row barang dari tabel `inventory`.
3. **Execution Phase**: Sistem melooping (Foreach) seluruh produk yang aktif. Melimpahkan Variabel 1 (SUM Transaksi Harian) dan Variabel 2 (Sisa Stok Terakhir) menuju Method defuzzifikasi Tsukamoto.
4. **Recording Phase**: Data decimal/integer balikan Tsukamoto di INSERT ke record DB berstatus tabel `predictions`.
5. **Broadcasting Phase**: Mengompilasi string teks pesan notifikasi:
   > *"Halo Pak Budi!\nIni Rangkuman Evaluasi AI Lapak Anda untuk persiapan kulakan BESOK PAGI:\n\n1. Kangkung: Disarankan Membeli 22 Ikat (karena Sisa: 3, Penjualan tinggi)\n2. Bayam: Disarankan Membeli 5 Ikat (Sisa lapak masih banyak: 12 ikat)... dst"*
6. Melakukan Push API `POST https://api.telegram.org/bot<TOKEN>/sendMessage` ke `chat_id` Pak Budi.

---

### 12. API Design
Standarisasi RESTful API untuk melayani Web Dashboard (dan mungkin komunikasi internal bot).

**1. POST /api/v1/bot/webhook**
- *Deskripsi*: Menerima event rahasia callback dari Telegram Server (saat ada chat masuk). Method internal bot.

**2. GET /api/v1/products**
- *Deskripsi*: Endpoints Web Dashboard mengambil daftar SKU.
- *Response (200 OK)*:
```json
{
  "status": "success",
  "data": [
    {
      "id": "1a2b3c",
      "kode_sku": "KNGK",
      "name": "Kangkung Cabut",
      "price": 2500,
      "unit": "ikat"
    }
  ]
}
```

**3. GET /api/v1/dashboard/overview**
- *Deskripsi*: Endpoints untuk widget KPI Home Dashboard.
- *Request*: `GET /api/v1/dashboard/overview?date=today`
- *Response (200 OK)*:
```json
{
  "total_revenue_today": 450000.00,
  "total_items_sold": 128,
  "out_of_stock_alerts_count": 2,
  "transaction_count": 56
}
```

**4. GET /api/v1/predictions/evaluasi**
- *Deskripsi*: Mengambil Riwayat Hasil Prediction (Tabel Evaluasi Tsukamoto).
- *Response (200 OK)*:
```json
{
  "data": [
    {
      "date": "2026-03-15",
      "product_name": "Tahu Balok",
      "predicted_demand_fuzzy": 45,
      "actual_sold_on_date": 42,
      "error_margin_percentage": "6.6%"
    }
  ]
}
```

---

### 13. Dashboard UI Modules

Agar dashboard elegan dan fungsional, tata letak antarmuka dipecah per rute halaman (routing):
- **Home / Overview (`/`)**: Navigasi KPI paling atas (Revenue, Items Sold, Warning Stok Mepet). Di balut dengan chart area tren 7 hr ke belakang.
- **Stock Monitoring (`/inventory`)**: Master interface daftar barang komoditi fisik. Terdapat tombol "+ Add New Item", "Edit Harga", dan fungsi sinkronasi stok fisik / reset kuantitas kalau membusuk / rusak saat penyimpanan.
- **Sales Analytics (`/analytics`)**: Komposisi visualisasi lebih dalem: Bar chart waktu (jam berapa saja paling ramai), dan Top 5 Best Selling item (bayam vs kangkung vs sawi dlsb).
- **Prediction Results / Tsukamoto Report (`/predictions`)**: Halaman wajib untuk evaluasi skripsi. Menampilkan dataset terprediksi vs yang terjual riil (Actual). Ini adalah tempat dosen penguji melihat kesuksesan algoritma matematika (MSE / MAPE evaluasi table chart).
- **Transaction History (`/transactions`)**: Audit-trail, tabel mentah untuk menunjukan row jurnal "Jam 06:15 - Pak Budi Jual Kangkung 2 via Bot Telegram".

---

### 14. Tech Stack Recommendation
Membentuk keseimbangan antara kurva pembelajaran dan industri standar teknologi saat ini.

- **Backend Logic + AI Core**: **Python (FastAPI)**. Alasan: Sangat dominan pada algoritma numerik & Machine Learning/Fuzzy Logic (dukungan libraries komputasi luar biasa seperti Numpy jika rule sangat massive). FastAPI berjalan asinkronus dengan Pydantic validasi.
- **Frontend SPA**: **React.js + Vite + Tailwind CSS**. Alasan: Modul styling `Tailwind` memudahkan desain aplikasi minimalis yg ringan diakses peramban smartphone penjual UMKM lapak tradisional tanpa jeda ngelag.
- **Basis Data Server**: **PostgreSQL**. Sangat powerfull dalam handling query agregasi (SUM penjualan per hari secara cepat).
- **Telegram Wrapper**: Library `python-telegram-bot` yang sudah matang dipakai framework industri.
- **Task Queue/Cron**: Python bawaan `APScheduler` sudah cukup solid memikul tugas 1x penjadwalan perhari.

---

### 15. MVP Scope (Lingkup Fitur Skripsi Minimum)
Untuk memastikan kelulusan skripsi berhasil tepat waktu tanpa merusak fokus dari judul ke penelitian (Penekanan di Fuzzy Tsukamoto):
1. Sistem bisa mendaftarkan (Add Object) jenis barang dari Dashboard.
2. Bot Tele bisa dieksekusi memotong kuantiti barang lewat chat sederhana berbasis ID Kode barang.
3. Arsitektur logika matematika _Fuzzy Tsukamoto_ di_hard-code_ rule dan member function nya agar meluarkan angka bulat defuzzifikasi spesifik untuk setidaknya 1-3 produk secara sempurna dan empiris.
4. Auto-Run penjadwalan Scheduler yang berhasil mengirim broadcast ke telegram penguji/dosen jam tertentu dan tercatat di History Database (`predictions`).
5. Web Dashboard memuat satu halaman spesial khusus mengevaluasi angka akurasi komparasi Tsukamoto.
*(Fitur Point of Sales, Bon Struk Cetak, atau Mobile APK native tidak perlu dikejar dalam scope ini).*

---

### 16. Future Development
Visi lanjutan yang bisa disertakan dalam Bab Kesimpulan (Saran Pengembangkan Selanjutnya) di laporan skripsi jika proyek dinilai inovatif:
- **Integrasi API Cuaca Terbuka (OpenWeatherMap)**: Jika parameter cuaca di kota Surabaya besok diprediksi badai hujan lebat pagi hari; logikanya demand dan trafic ibu-ibu belanja ke pasar berkurang drastis, sehingga Rule Fuzzy otomatis memangkas rekomendasi restock untuk barang perishable menghindari mubazir kerugian masif.
- **AI Deep Demand Forecasting**: Migrasi sebagian skrip logic dari Fuzzy Tsukamoto ke Model Machine Learning/Prediksi berbasis Waktu (LSTM RNN Neural Networks) jika data historis penjualan yang terekam sudah mapan mencapai tahapan ribuan row time-series 1 tahun.
- **Multi-Tenant (Model Bisnis SaaS)**: Platform di buka "Berlangganan Cloud". Memungkinkan registrasi banyak pak sayur se-indonesia. Tiap Pak Sayur tinggal melakukan register Telegram ID ke bot pusat.
- **Manajemen Modal**: Mengelola saldo e-money / integrasi QRIS payment di telegram.
