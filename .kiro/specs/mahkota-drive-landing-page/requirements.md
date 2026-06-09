# Requirements Document

## Introduction

Mahkota Drive adalah bisnis jasa rental armada kendaraan (mobil) yang ditujukan khusus untuk para supir taksi online. Landing page ini berfungsi sebagai media pemasaran digital yang menampilkan profil bisnis, layanan yang tersedia, statistik kepercayaan, alur pendaftaran mitra driver, serta tautan unduhan aplikasi mobile di Google Play Store. Tujuan utama halaman ini adalah mengonversi pengunjung menjadi mitra driver yang terdaftar.

## Glossary

- **Landing_Page**: Halaman web tunggal yang berfungsi sebagai media pemasaran utama Mahkota Drive, dibangun dengan Next.js App Router.
- **Mitra_Driver**: Supir taksi online yang menyewa kendaraan dari Mahkota Drive.
- **Armada**: Kumpulan kendaraan (mobil) yang disediakan oleh Mahkota Drive untuk disewakan.
- **Katalog_Armada**: Daftar kendaraan yang tersedia untuk disewa, ditampilkan di Landing_Page.
- **CTA**: Call-to-Action, elemen interaktif yang mendorong pengunjung untuk melakukan tindakan tertentu (misalnya mendaftar atau mengunduh aplikasi).
- **Play_Store**: Platform distribusi aplikasi Android milik Google.
- **Aplikasi_Mobile**: Aplikasi Android Mahkota Drive yang dapat diunduh oleh Mitra_Driver.
- **Statistik_Ringkasan**: Angka-angka kunci yang menampilkan pencapaian bisnis Mahkota Drive.
- **Formulir_Pendaftaran**: Antarmuka yang digunakan calon Mitra_Driver untuk mendaftarkan diri.
- **Route_Handler**: Endpoint API yang diimplementasikan menggunakan Next.js Route Handlers (`app/api/*/route.ts`).
- **Server_Component**: Komponen React yang dirender di server (default di Next.js App Router), tidak mengirim JavaScript ke browser.
- **Client_Component**: Komponen React yang dirender di browser, ditandai dengan `'use client'` directive.
- **Toast**: Notifikasi sementara (auto-dismiss) yang muncul di UI admin untuk konfirmasi aksi berhasil/gagal.
- **Icon_Picker**: Komponen admin yang menampilkan grid ikon tersedia dari server dan memungkinkan pemilihan atau upload ikon baru.

---

## Requirements

### Requirement 1: Tampilan Profil Bisnis (Tentang Kami)

**User Story:** Sebagai pengunjung landing page, saya ingin membaca profil dan deskripsi bisnis Mahkota Drive, sehingga saya dapat memahami identitas dan nilai bisnis yang ditawarkan.

#### Acceptance Criteria

1. THE Landing_Page SHALL menampilkan nama bisnis "Mahkota Drive" sebagai elemen teks dengan ukuran font minimum 32px pada bagian hero/header halaman, terlihat tanpa perlu menggulir pada semua breakpoint yang didukung.
2. THE Landing_Page SHALL menampilkan deskripsi bisnis Mahkota Drive yang panjangnya antara 50 hingga 200 kata, mencakup: (a) bidang usaha (rental armada kendaraan), (b) target pasar (supir taksi online), dan (c) minimal satu nilai utama yang ditawarkan. Deskripsi ini diambil dari field `heroDescription` pada data kontak yang dapat dikelola melalui Admin_Panel.
3. THE Landing_Page SHALL menampilkan logo Mahkota Drive pada bagian header dengan tinggi minimum 40px; IF file logo gagal dimuat, THEN THE Landing_Page SHALL menampilkan teks "Mahkota Drive" sebagai fallback pada posisi yang sama.
4. WHEN pengunjung mengakses Landing_Page pada koneksi minimum 10 Mbps, THE Landing_Page SHALL menyelesaikan rendering seluruh konten bagian "Tentang Kami" (teks dan gambar) dalam waktu tidak lebih dari 3 detik, diukur dari saat permintaan HTTP dikirim hingga event DOMContentLoaded selesai.
5. THE Landing_Page SHALL menampilkan bagian "Tentang Kami" tanpa overflow horizontal dan tanpa teks yang terpotong pada lebar layar 320px, 768px, dan 1024px; pada lebar ≥ 1024px konten ditampilkan dalam tata letak dua kolom (teks dan gambar berdampingan), pada lebar 768px–1023px dalam satu kolom penuh, dan pada lebar < 768px dalam satu kolom penuh dengan padding minimum 16px di setiap sisi.
6. THE Landing_Page SHALL menampilkan gambar hero (`heroImageUrl`) yang dapat dikonfigurasi melalui Admin_Panel pada bagian "General"; IF gambar hero tidak dikonfigurasi, THEN THE Landing_Page SHALL menampilkan gambar default.

---

### Requirement 2: Informasi Layanan Jasa Rental Armada

**User Story:** Sebagai calon Mitra_Driver, saya ingin mengetahui detail layanan rental armada yang tersedia, sehingga saya dapat mengevaluasi apakah layanan ini sesuai dengan kebutuhan saya.

#### Acceptance Criteria

1. THE Landing_Page SHALL menampilkan daftar layanan rental armada yang disediakan Mahkota Drive, mencakup minimal: jenis kendaraan yang tersedia, skema sewa (harian/mingguan/bulanan), dan ketentuan umum sewa.
2. THE Landing_Page SHALL menampilkan setiap layanan dalam kartu (card) terpisah yang memuat nama layanan, deskripsi singkat maksimal 150 karakter, dan ikon atau gambar representatif.
3. WHEN pengunjung mengarahkan kursor ke kartu layanan pada perangkat desktop (pointer: fine), THE Landing_Page SHALL menampilkan perubahan visual yang terukur pada kartu tersebut — misalnya perubahan warna latar belakang, bayangan (box-shadow), atau transformasi skala — dalam waktu transisi antara 150ms hingga 300ms.
4. THE Landing_Page SHALL menampilkan minimal 3 poin keunggulan layanan Mahkota Drive dibandingkan kompetitor pada bagian yang sama dengan informasi layanan, masing-masing poin terdiri dari judul singkat, deskripsi maksimal 100 karakter, dan ikon opsional (`iconUrl`/`iconAlt`); IF ikon tidak tersedia untuk keunggulan, THEN THE Landing_Page SHALL menampilkan ikon centang (checkmark SVG) sebagai fallback.
5. IF konten gambar layanan gagal dimuat, THEN THE Landing_Page SHALL menampilkan atribut alt text yang deskriptif (bukan kosong) sebagai pengganti gambar, sehingga konten kartu tetap dapat dipahami.
6. WHERE perangkat tidak mendukung hover (pointer: coarse, misalnya layar sentuh), THE Landing_Page SHALL menampilkan seluruh informasi kartu layanan dalam keadaan terbuka penuh tanpa memerlukan interaksi hover.

---

### Requirement 3: Ringkasan Statistik Bisnis

**User Story:** Sebagai calon Mitra_Driver, saya ingin melihat statistik pencapaian Mahkota Drive, sehingga saya dapat menilai kredibilitas dan skala bisnis ini sebelum bergabung.

#### Acceptance Criteria

1. THE Landing_Page SHALL menampilkan tepat 3 metrik dalam Statistik_Ringkasan: (a) jumlah Mitra_Driver aktif (bilangan bulat ≥ 0), (b) jumlah unit Armada yang tersedia (bilangan bulat ≥ 0), dan (c) skor rata-rata kepuasan (nilai desimal dari 1,0 hingga 5,0).
2. THE Landing_Page SHALL menampilkan setiap angka statistik dengan label deskriptif yang terdiri dari 1 hingga 30 karakter, terlihat tanpa interaksi tambahan pada semua breakpoint yang didukung.
3. WHEN pengunjung menggulir (scroll) ke bagian Statistik_Ringkasan sehingga elemen tersebut masuk ke dalam viewport, THE Landing_Page SHALL menampilkan animasi penghitung angka (count-up animation) dari 0 hingga nilai aktual dalam durasi antara 1 hingga 3 detik.
4. THE Landing_Page SHALL menampilkan bagian Statistik_Ringkasan dalam tata letak 3-kolom horizontal pada lebar layar > 768px, dan dalam tata letak 1-kolom atau 2-kolom pada lebar layar ≤ 768px, tanpa overflow horizontal pada kedua kondisi tersebut.
5. WHEN data statistik diperbarui oleh administrator, THE Landing_Page SHALL menampilkan nilai statistik terbaru tanpa memerlukan perubahan kode.

---

### Requirement 4: Testimoni Mitra Driver

**User Story:** Sebagai calon Mitra_Driver, saya ingin membaca testimoni dari Mitra_Driver yang sudah bergabung, sehingga saya dapat memperoleh keyakinan sebelum mendaftar.

#### Acceptance Criteria

1. THE Landing_Page SHALL menampilkan minimal 3 testimoni dari Mitra_Driver yang sudah bergabung, masing-masing memuat nama driver (teks non-kosong), deskripsi opsional (misalnya "Driver Gojek Jakarta"), foto profil atau avatar default, dan kutipan testimoni (teks non-kosong).
2. THE Landing_Page SHALL menampilkan rating bintang (skala 1–5, bilangan bulat) pada setiap kartu testimoni sesuai nilai yang tersimpan di data, dengan representasi visual bintang terisi dan bintang kosong yang dapat dibedakan secara visual.
3. WHEN Landing_Page ditampilkan pada perangkat dengan lebar layar < 768px, THE Landing_Page SHALL menampilkan testimoni dalam format carousel yang dapat digeser secara horizontal, dengan indikator posisi (dots atau angka) yang menunjukkan jumlah total item dan posisi aktif saat ini.
4. WHEN foto profil Mitra_Driver tersedia (URL gambar valid dan dapat dimuat), THE Landing_Page SHALL menampilkan foto profil tersebut pada kartu testimoni dalam dimensi minimum 48x48px dengan rasio aspek 1:1.
5. IF foto profil Mitra_Driver tidak tersedia atau gagal dimuat, THEN THE Landing_Page SHALL menampilkan avatar default berupa inisial (1–2 karakter pertama nama driver) pada latar belakang berwarna solid yang kontras dengan teks inisial (rasio kontras minimum 4.5:1).
6. THE Landing_Page SHALL menampilkan kartu testimoni dengan layout horizontal: foto di sebelah kiri, nama dan deskripsi di sebelah kanan (tidak center-aligned).

---

### Requirement 5: Alur Cara Daftar Menjadi Mitra Driver

**User Story:** Sebagai calon Mitra_Driver, saya ingin memahami langkah-langkah pendaftaran untuk menjadi mitra, sehingga saya dapat mempersiapkan diri dan mendaftar dengan mudah.

#### Acceptance Criteria

1. THE Landing_Page SHALL menampilkan alur pendaftaran Mitra_Driver dalam format langkah (step-by-step) dengan minimal 3 langkah dan maksimal 6 langkah.
2. THE Landing_Page SHALL menampilkan setiap langkah pendaftaran dengan ikon unik, judul langkah (teks non-kosong), dan deskripsi singkat tindakan yang harus dilakukan (teks non-kosong). Nomor urut tidak ditampilkan secara visual — hanya ikon yang ditampilkan.
3. THE Landing_Page SHALL menampilkan tepat satu ikon atau ilustrasi per langkah pendaftaran, yang secara visual berbeda dari ikon langkah lainnya.
4. WHEN pengunjung mengklik tombol CTA "Daftar Sekarang" pada bagian alur pendaftaran, THE Landing_Page SHALL mengarahkan pengunjung ke URL Formulir_Pendaftaran yang telah dikonfigurasi.
5. THE Landing_Page SHALL menampilkan estimasi waktu penyelesaian proses pendaftaran dalam rentang 5 hingga 15 menit, dinyatakan secara eksplisit dalam teks yang terlihat tanpa interaksi tambahan.
6. IF pengunjung mengakses Landing_Page menggunakan perangkat dengan lebar layar < 1024px (mencakup mobile < 768px dan tablet 768px–1023px), THEN THE Landing_Page SHALL menampilkan alur pendaftaran dalam format vertikal (satu langkah per baris) dengan connector berupa garis vertikal dan panah ke bawah yang sejajar di bawah ikon.
7. WHILE pengunjung mengakses Landing_Page menggunakan perangkat dengan lebar layar ≥ 1024px, THE Landing_Page SHALL menampilkan alur pendaftaran dalam format horizontal (semua langkah dalam satu baris) dengan connector berupa garis horizontal dan ujung panah kecil antar langkah.

---

### Requirement 6: Tautan Unduhan Aplikasi Mobile (Play Store)

**User Story:** Sebagai calon Mitra_Driver, saya ingin menemukan tautan unduhan aplikasi Mahkota Drive di Play Store, sehingga saya dapat mengunduh aplikasi dengan mudah setelah mendaftar.

#### Acceptance Criteria

1. THE Landing_Page SHALL menampilkan tombol/badge "Get it on Google Play" (menggunakan aset resmi Google Play badge atau teks setara dalam Bahasa Indonesia: "Unduh di Google Play") yang mengarah ke URL halaman aplikasi Mahkota Drive di Play_Store yang telah dikonfigurasi.
2. WHEN pengunjung mengklik tombol Play_Store, THE Landing_Page SHALL membuka URL Play_Store di tab baru (menggunakan atribut target="_blank" dan rel="noopener noreferrer") tanpa menutup atau menavigasi Landing_Page saat ini.
3. THE Landing_Page SHALL menampilkan tombol Play_Store pada tepat 3 lokasi: (a) bagian hero/header, (b) bagian seksi khusus unduhan aplikasi, dan (c) bagian footer — masing-masing tombol mengarah ke URL Play_Store yang sama.
4. THE Landing_Page SHALL menampilkan minimal satu gambar mockup atau screenshot Aplikasi_Mobile (`appMockupUrl` dari data kontak) dengan dimensi minimum 200x400px dan atribut alt text deskriptif. Gambar mockup dapat dikonfigurasi melalui Admin_Panel.
5. THE Landing_Page SHALL menampilkan setiap tombol Play_Store dengan area sentuh minimum 44x44 piksel pada semua perangkat (desktop maupun mobile), sesuai panduan aksesibilitas WCAG 2.5.5.

---

### Requirement 7: Navigasi dan Aksesibilitas Halaman

**User Story:** Sebagai pengunjung landing page, saya ingin dapat menavigasi seluruh bagian halaman dengan mudah, sehingga saya dapat menemukan informasi yang saya butuhkan secara efisien.

#### Acceptance Criteria

1. THE Landing_Page SHALL menampilkan navigasi (navbar) yang memuat tautan ke setiap bagian utama halaman: Tentang Kami, Layanan, Statistik, Armada, Cara Daftar, dan Unduh Aplikasi. Navbar memiliki tinggi h-14 (mobile) / h-16 (desktop) dengan logo dan teks "Mahkota Drive" berdampingan.
2. WHEN pengunjung mengklik tautan navigasi, THE Landing_Page SHALL menggulir halaman secara halus (smooth scroll, behavior: smooth) ke bagian yang dituju dalam waktu tidak lebih dari 1 detik.
3. WHILE pengunjung menggulir halaman melewati posisi 100px dari atas, THE Landing_Page SHALL menampilkan navbar dalam posisi tetap (position: sticky atau fixed) di bagian atas layar dengan z-index yang memastikan navbar selalu terlihat di atas konten lain.
4. WHILE pengunjung telah menggulir lebih dari 300px dari atas halaman, THE Landing_Page SHALL menampilkan tombol "Kembali ke Atas" yang terlihat; IF pengunjung menggulir kembali ke posisi ≤ 300px dari atas, THEN THE Landing_Page SHALL menyembunyikan tombol tersebut.
5. THE Landing_Page SHALL memenuhi standar aksesibilitas WCAG 2.1 Level AA, mencakup: (a) kontras warna minimum 4.5:1 untuk teks normal, (b) atribut alt pada semua gambar, dan (c) semua elemen interaktif (tautan dan tombol) dapat dijangkau menggunakan tombol Tab pada keyboard dengan indikator fokus yang terlihat secara visual.
6. THE Landing_Page SHALL menampilkan bagian footer yang selalu memuat nomor telepon atau tautan WhatsApp Mahkota Drive dan alamat bisnis; WHERE tautan media sosial Mahkota Drive tersedia, THE Landing_Page SHALL menampilkan tautan tersebut di footer.

---

### Requirement 8: Performa dan Kompatibilitas Teknis

**User Story:** Sebagai pengunjung landing page, saya ingin halaman dimuat dengan cepat dan berfungsi dengan baik di berbagai perangkat dan browser, sehingga saya mendapatkan pengalaman yang nyaman.

#### Acceptance Criteria

1. THE Landing_Page SHALL mencapai skor Google PageSpeed Insights minimum 80 pada kategori Performance untuk perangkat mobile dan minimum 85 untuk perangkat desktop, diukur menggunakan Lighthouse versi terbaru yang tersedia pada saat pengujian.
2. THE Landing_Page SHALL kompatibel dengan versi stabil terbaru (latest stable release) dari browser Google Chrome, Mozilla Firefox, Safari, dan Microsoft Edge pada saat pengujian, sehingga seluruh konten dan fungsionalitas berjalan tanpa error JavaScript yang tidak tertangani.
3. THE Landing_Page SHALL menampilkan seluruh konten tanpa scroll horizontal yang tidak disengaja, tanpa elemen yang saling tumpang tindih, dan tanpa teks yang terpotong pada resolusi layar dari 320px hingga 2560px lebar.
4. WHEN gambar raster (JPEG, PNG) dimuat pada Landing_Page, THE Landing_Page SHALL menggunakan komponen `next/image` dengan format WebP otomatis dan ukuran file maksimal 200KB per gambar raster; pengecualian berlaku untuk gambar format SVG yang tidak memiliki batas ukuran file.
5. THE Landing_Page SHALL menggunakan HTTPS untuk seluruh aset dan tautan eksternal; IF terdapat aset yang dimuat melalui HTTP (mixed content), THEN browser SHALL memblokir atau mengupgrade aset tersebut ke HTTPS secara otomatis sesuai kebijakan browser modern.
6. THE Landing_Page SHALL memanfaatkan Next.js Server Components untuk merender konten statis di server — mengurangi JavaScript yang dikirim ke browser dan meningkatkan First Contentful Paint (FCP).

---

### Requirement 9: Admin Panel Pengelolaan Konten

**User Story:** Sebagai administrator Mahkota Drive, saya ingin dapat mengelola seluruh konten landing page melalui antarmuka admin yang mudah digunakan, sehingga saya dapat memperbarui informasi bisnis tanpa perlu mengubah kode.

#### Acceptance Criteria

1. THE Admin_Panel SHALL dapat diakses melalui URL tersembunyi (`/admin`) yang hanya diketahui oleh administrator, dan SHALL menampilkan halaman login sebelum mengizinkan akses ke antarmuka pengelolaan konten. IF administrator sudah terautentikasi, THEN middleware SHALL redirect `/admin` ke `/admin/dashboard` secara otomatis.
2. WHEN administrator memasukkan username dan password yang benar pada halaman login, THE Admin_Panel SHALL memberikan akses ke dashboard pengelolaan konten; IF username atau password salah, THEN THE Admin_Panel SHALL menampilkan pesan error dan menolak akses.
3. THE Admin_Panel SHALL menyediakan antarmuka untuk mengedit semua konten berikut melalui tab navigasi: (a) General — profil bisnis (hero description, hero image, app mockup) dan kontak (WhatsApp, alamat, media sosial) dalam sub-tab "Profil & Media" dan "Kontak & Sosial Media", (b) Statistik — 3 metrik bisnis dalam layout grid 3-kolom (satu kartu per metrik), (c) Testimoni — CRUD dengan modal form dan photo upload, (d) Layanan — sub-tab "Layanan" dan "Keunggulan" dengan icon picker, (e) Cara Daftar — CRUD langkah dengan icon picker, (f) Armada — CRUD kendaraan dengan photo upload.
4. WHEN administrator menyimpan perubahan konten melalui Admin_Panel, THE sistem SHALL menyimpan data ke file JSON di server melalui Route_Handler dan THE Landing_Page SHALL menampilkan konten terbaru pada permintaan halaman berikutnya tanpa memerlukan deployment ulang. Operasi CRUD (tambah/edit/hapus) pada tab Testimoni, Layanan, Cara Daftar, dan Armada SHALL menyimpan otomatis (auto-save) tanpa tombol "Simpan" terpisah.
5. THE Admin_Panel SHALL menampilkan Toast notification (success/error, auto-dismiss 3 detik, slide-in animation) setelah setiap operasi CRUD berhasil atau gagal, menggantikan penggunaan `alert()`. THE Admin_Panel SHALL menampilkan ConfirmDialog (modal dengan ikon peringatan, tombol cancel/confirm) untuk konfirmasi hapus, menggantikan `window.confirm()`.
6. THE Admin_Panel SHALL memvalidasi input sebelum menyimpan: label statistik 1–30 karakter, nilai statistik sesuai tipe data, rating testimoni bilangan bulat 1–5, jumlah langkah pendaftaran 3–6, estimasi waktu 5–15 menit, tahun kendaraan 2000–2030, kapasitas 1–20, transmisi manual/matic.
7. IF sesi administrator tidak aktif selama lebih dari 60 menit, THEN THE Admin_Panel SHALL mengakhiri sesi secara otomatis dan mengarahkan administrator ke halaman login.
8. THE Admin_Panel SHALL dapat diakses dan digunakan dengan baik pada perangkat desktop (lebar layar ≥ 1024px) dan tablet (lebar layar 768px–1023px).
9. THE Admin_Panel SHALL menampilkan header dengan logo, teks "Mahkota Drive — Website Administrator" dalam warna gold, dan tombol logout dengan ikon.
10. THE Admin_Panel SHALL menyediakan komponen IconPicker yang menampilkan grid visual ikon yang tersedia dari `GET /api/admin/icons` dan opsi upload ikon baru. IconPicker digunakan pada tab Layanan (layanan + keunggulan) dan Cara Daftar.
11. THE Admin_Panel SHALL menyediakan komponen PhotoUpload untuk upload foto dengan preview. PhotoUpload digunakan pada tab Testimoni dan Armada.
12. THE Admin_Panel SHALL menggunakan modal dialog form untuk semua operasi tambah dan edit pada tab Testimoni, Layanan, Cara Daftar, dan Armada.

---

### Requirement 10: Keamanan Akses File dan Sumber Daya Server

**User Story:** Sebagai administrator Mahkota Drive, saya ingin memastikan bahwa file sensitif (data konten, kredensial admin) tidak dapat diakses oleh publik melalui URL, sehingga data bisnis dan akun admin terlindungi dari akses tidak sah.

#### Acceptance Criteria

1. THE server SHALL menolak semua permintaan HTTP langsung ke file JSON di direktori `data/` dan `config/` dengan mengembalikan HTTP 403 atau 404 — file-file ini tidak boleh dapat diunduh melalui browser karena disimpan di luar direktori `public/` Next.js.
2. THE sistem SHALL memisahkan file sensitif (`data/`, `config/`) dari aset publik (`public/`) sehingga Next.js tidak pernah melayani file sensitif sebagai aset statis — hanya Route_Handler yang dapat membaca file tersebut di sisi server.
3. THE server SHALL menerapkan HTTP security headers pada semua respons melalui `next.config.ts`: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection: 1; mode=block`, dan `Content-Security-Policy` yang membatasi sumber skrip dan gaya hanya dari origin yang diizinkan. CSP headers SHALL hanya diterapkan di production (`NODE_ENV=production`) untuk menghindari pemblokiran hydration scripts Next.js saat development.
4. THE Route_Handler untuk login (`POST /api/admin/login`) SHALL menerapkan rate limiting: maksimal 5 percobaan login gagal per IP dalam 15 menit; IF batas terlampaui, THEN server SHALL mengembalikan HTTP 429 dan memblokir percobaan login berikutnya dari IP tersebut selama 15 menit.
5. THE Route_Handler untuk update konten SHALL memvalidasi dan membersihkan (sanitize) semua input sebelum menyimpan ke file JSON, untuk mencegah injeksi karakter berbahaya atau payload yang tidak terduga.
6. THE `config/admin.json` SHALL menyimpan password hanya dalam bentuk bcrypt hash (cost factor minimum 10) — plaintext password tidak boleh tersimpan di file manapun di server.
7. THE server SHALL menggunakan session secret yang kuat (minimum 32 karakter acak) yang disimpan sebagai environment variable (`SESSION_SECRET` di file `.env.local`), bukan hardcoded di kode sumber.
8. IF server berjalan di lingkungan production (`NODE_ENV=production`), THEN THE server SHALL memaksa HTTPS dan SHALL mengatur cookie session dengan flag `secure: true` dan `sameSite: 'strict'`.
9. THE Route_Handler untuk upload (`POST /api/admin/upload`) SHALL memvalidasi file yang diupload: ukuran maksimal 2MB, tipe file yang diizinkan hanya JPEG, PNG, WebP, dan SVG. File disimpan ke `public/images/{category}/` dengan kategori yang valid (testimonials, services, fleet).

---

### Requirement 11: Katalog Armada Kendaraan

**User Story:** Sebagai calon Mitra_Driver, saya ingin melihat katalog armada kendaraan yang tersedia, sehingga saya dapat mengetahui tipe kendaraan yang bisa disewa.

#### Acceptance Criteria

1. THE Landing_Page SHALL menampilkan section "Katalog Armada" setelah section Layanan, berisi daftar kendaraan yang tersedia.
2. THE Landing_Page SHALL menampilkan setiap kendaraan dalam kartu yang memuat: nama/tipe kendaraan, tahun, kapasitas penumpang, dan jenis transmisi (manual/matic).
3. WHEN Landing_Page ditampilkan pada perangkat dengan lebar layar < 768px, THE Landing_Page SHALL menampilkan katalog armada dalam format carousel horizontal (Swiper) dengan peek pada kartu berikutnya.
4. WHEN Landing_Page ditampilkan pada perangkat dengan lebar layar >= 768px, THE Landing_Page SHALL menampilkan katalog dalam format grid statis 2-3 kolom.
5. THE Admin_Panel SHALL menyediakan antarmuka CRUD untuk mengelola katalog armada (tambah, edit, hapus kendaraan) dengan upload foto kendaraan.
6. WHEN data katalog diperbarui oleh administrator, THE Landing_Page SHALL menampilkan data terbaru tanpa memerlukan perubahan kode.

---

### Requirement 12: Upload Gambar dan Manajemen Aset

**User Story:** Sebagai administrator Mahkota Drive, saya ingin dapat mengupload gambar (foto testimoni, ikon layanan, foto kendaraan) melalui Admin_Panel, sehingga saya dapat mengelola aset visual tanpa akses langsung ke server.

#### Acceptance Criteria

1. THE Admin_Panel SHALL menyediakan endpoint `POST /api/admin/upload` yang menerima file gambar dan menyimpannya ke `public/images/{category}/` di server.
2. THE Route_Handler upload SHALL memvalidasi: (a) ukuran file maksimal 2MB, (b) tipe MIME yang diizinkan: `image/jpeg`, `image/png`, `image/webp`, `image/svg+xml`, (c) kategori yang valid: `testimonials`, `services`, `fleet`.
3. THE Admin_Panel SHALL menyediakan endpoint `GET /api/admin/icons` yang mengembalikan daftar file ikon yang tersedia di `public/images/services/`, digunakan oleh IconPicker.
4. THE Admin_Panel SHALL menyediakan komponen IconPicker yang menampilkan grid visual ikon tersedia dan opsi untuk upload ikon baru. IconPicker digunakan pada form layanan, keunggulan, dan langkah pendaftaran.
5. THE Admin_Panel SHALL menyediakan komponen PhotoUpload yang menampilkan preview gambar yang dipilih sebelum upload, dan mengembalikan URL gambar yang tersimpan setelah upload berhasil. PhotoUpload digunakan pada form testimoni dan armada.
