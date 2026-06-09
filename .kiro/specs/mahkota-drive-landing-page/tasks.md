# Rencana Implementasi: Mahkota Drive Landing Page

## Gambaran Umum

Implementasi landing page Mahkota Drive menggunakan Next.js 14+ (App Router) + TypeScript + Tailwind CSS v3, di-deploy ke VPS dengan `next start`. Proyek ini mencakup landing page publik (Server Components untuk performa optimal) dan admin panel (Client Components untuk interaktivitas) dalam satu codebase. Data konten disimpan di file JSON terpisah per kategori, diakses via Route Handlers.

## Tasks

- [x] 1. Inisialisasi proyek Next.js + TypeScript + Tailwind CSS v3
  - Jalankan `npx create-next-app@latest` dengan opsi: TypeScript, Tailwind CSS, App Router, src directory: No
  - Konfigurasi `tailwind.config.ts` dengan warna brand (gold, brand-black, brand-dark, brand-card) dan font (heading: Playfair Display, body: Poppins)
  - Konfigurasi `next.config.ts` dengan security headers (X-Content-Type-Options, X-Frame-Options, CSP)
  - Setup `next/font/google` di `app/layout.tsx` untuk Playfair Display dan Poppins (self-hosted, tanpa CDN runtime)
  - Install dependensi: `iron-session`, `bcryptjs`, `zod`, `swiper`, `countup.js`
  - Install devDependencies: `vitest`, `@testing-library/react`, `fast-check`, `@playwright/test`, `@types/bcryptjs`
  - Buat `.env.example` dengan template: `SESSION_SECRET=`, `NODE_ENV=`
  - Buat `.gitignore` yang mengecualikan: `.env.local`, `data/`, `config/`, `node_modules/`, `.next/`
  - Buat struktur direktori: `data/`, `config/`, `components/sections/`, `components/ui/`, `components/admin/`, `lib/`, `types/`
  - _Requirements: 8.1, 8.2, 8.6_

- [x] 2. Buat TypeScript types dan Zod validation schemas
  - [x] 2.1 Buat `types/content.ts` dengan semua interfaces
    - `StatisticItem`, `Testimonial`, `Service`, `Advantage`, `RegistrationStep`
    - `StatisticsData`, `TestimonialsData`, `ServicesData`, `RegistrationData`, `ContactData`
    - `AllContent` (gabungan semua kategori)
    - _Requirements: 3.1, 4.1, 5.1_

  - [x] 2.2 Buat `lib/validation.ts` dengan Zod schemas per kategori
    - `statisticsSchema`: items length 3, label 1–30 char, value ≥ 0
    - `testimonialsSchema`: items min 3, name/quote non-empty, rating 1–5
    - `servicesSchema`: services min 3, description ≤ 150 char; advantages min 3, description ≤ 100 char
    - `registrationSchema`: steps 3–6, order unik, estimateMinutes 5–15
    - `contactSchema`: whatsappUrl/phone non-empty, address non-empty
    - Export `validateCategory(category: string, data: unknown)` function
    - _Requirements: 9.6, 10.5_

  - [x] 2.3 Buat `lib/content.ts` — fungsi baca/tulis file JSON
    - `readCategory(category)`: baca `data/{category}.json`, parse, return typed data
    - `writeCategory(category, data)`: validasi dengan Zod, tulis ke file
    - `readAllContent()`: baca semua 5 kategori, return `AllContent`
    - _Requirements: 3.5, 9.4_

  - [x] 2.4 Buat 5 file data awal di `data/`
    - `statistics.json`, `testimonials.json`, `services.json`, `registration.json`, `contact.json`
    - Isi dengan data placeholder valid sesuai constraint
    - _Requirements: 3.1, 4.1, 5.1, 6.1_

- [x] 3. Buat landing page — layout dan section components
  - [x] 3.1 Buat `app/layout.tsx` dan `app/globals.css`
    - Root layout dengan `next/font/google` (Playfair Display + Poppins)
    - Set CSS variables `--font-playfair` dan `--font-poppins`
    - Metadata: title, description, favicon
    - `globals.css` dengan `@tailwind base/components/utilities` dan custom `@layer components`
    - _Requirements: 7.2, 8.6_

  - [x] 3.2 Buat `app/page.tsx` — Server Component utama
    - Import `readAllContent()` untuk membaca data di server
    - Render semua section components dengan data sebagai props
    - Tidak ada `fetch` di client — data sudah ada di HTML yang dikirim
    - _Requirements: 8.6_

  - [x] 3.3 Buat `components/sections/Navbar.tsx` (Client Component)
    - `'use client'` — butuh scroll event listener
    - Sticky top-0, z-50, tautan ke semua section
    - Logo dengan `next/image` + fallback teks via onError
    - Scroll > 100px → tambah background solid + shadow
    - Mobile hamburger menu
    - `aria-label="Navigasi Utama"`, focus-visible outline
    - _Requirements: 7.1, 7.3, 7.5, 1.3_

  - [x] 3.4 Buat `components/sections/Hero.tsx` (Server Component)
    - H1 "Mahkota Drive" dengan `font-heading text-[clamp(32px,5vw,56px)]`
    - Deskripsi bisnis 50–200 kata
    - Tombol CTA Play Store (lokasi 1/3) menggunakan `PlayStoreButton`
    - Background `bg-brand-black`
    - Layout: `lg:grid-cols-2`, `md:grid-cols-1`, mobile padding 16px
    - _Requirements: 1.1, 1.2, 1.5, 6.1, 6.3_

  - [x] 3.5 Buat `components/sections/Services.tsx` (Server Component)
    - Grid kartu layanan dari data props
    - Setiap kartu: `next/image` ikon + alt, nama, deskripsi ≤ 150 char
    - Keunggulan: minimal 3 poin
    - Hover effect via Tailwind: `hover:shadow-lg hover:-translate-y-1 transition-all duration-200`
    - `@media (pointer: coarse)` — info terbuka penuh
    - Background `bg-gray-50`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

  - [x] 3.6 Buat `components/sections/Statistics.tsx` (Client Component)
    - `'use client'` — butuh IntersectionObserver + CountUp
    - 3 metrik dari props, animasi count-up 1–3 detik saat masuk viewport
    - Fallback: jika CountUp gagal import, tampilkan nilai final langsung
    - Layout: `md:flex md:justify-around`, mobile wrap
    - Background `bg-brand-black`, angka `text-gold font-heading`
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [x] 3.7 Buat `components/sections/Testimonials.tsx` (Client Component)
    - `'use client'` — butuh Swiper
    - Minimal 3 kartu: Avatar + nama + rating + kutipan
    - Mobile (< 768px): Swiper carousel, pagination dots
    - Desktop (≥ 768px): grid statis 2–3 kolom
    - Fallback: jika Swiper gagal, tampilkan grid statis
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [x] 3.8 Buat `components/sections/Registration.tsx` (Server Component)
    - 3–6 langkah bernomor dari props
    - Setiap langkah: nomor, ikon, judul, deskripsi
    - Estimasi waktu ditampilkan eksplisit
    - Tombol CTA "Daftar Sekarang" → formUrl
    - Layout: `lg:flex-row`, `< lg:flex-col`
    - Background `bg-gray-50`
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

  - [x] 3.9 Buat `components/sections/Download.tsx` (Server Component)
    - Mockup aplikasi dengan `next/image` (min 200×400px)
    - Tombol Play Store (lokasi 2/3)
    - Background `bg-brand-dark`
    - _Requirements: 6.1, 6.3, 6.4_

  - [x] 3.10 Buat `components/sections/Footer.tsx` (Server Component)
    - WhatsApp/telepon, alamat, media sosial
    - Tombol Play Store (lokasi 3/3)
    - Logo footer
    - Background `bg-brand-black`
    - _Requirements: 6.3, 7.6_

  - [x] 3.11 Buat `components/ui/BackToTop.tsx` (Client Component)
    - Scroll > 300px → visible, ≤ 300px → hidden
    - Smooth scroll ke atas saat diklik
    - `aria-label="Kembali ke atas"`, min 44×44px
    - _Requirements: 7.4_

  - [x] 3.12 Buat `components/ui/PlayStoreButton.tsx`, `StarRating.tsx`, `Avatar.tsx`
    - `PlayStoreButton`: link target="_blank" rel="noopener noreferrer", min 44×44px touch target
    - `StarRating`: filled + empty stars berdasarkan rating 1–5
    - `Avatar`: next/image dengan onError → div inisial (kontras ≥ 4.5:1)
    - _Requirements: 4.4, 4.5, 6.2, 6.5_

- [x] 4. Checkpoint — Verifikasi landing page berfungsi
  - Jalankan `npm run dev`, verifikasi semua section tampil dengan data dari JSON
  - Verifikasi responsivitas di 320px, 768px, 1024px
  - Verifikasi tidak ada error di console

- [x] 5. Implementasikan backend — Route Handlers dan autentikasi
  - [x] 5.1 Buat `lib/auth.ts` — konfigurasi iron-session
    - Session options: password dari `process.env.SESSION_SECRET`, cookieName, ttl 3600
    - Helper: `getSession(req)`, `isAuthenticated(req)`
    - _Requirements: 9.2, 9.7, 10.7_

  - [x] 5.2 Buat `lib/rate-limit.ts` — rate limiter untuk login
    - In-memory Map: IP → { count, resetTime }
    - Max 5 percobaan gagal per IP per 15 menit
    - Return HTTP 429 jika terlampaui
    - _Requirements: 10.4_

  - [x] 5.3 Buat `app/api/content/route.ts` — GET publik
    - Baca semua kategori via `readAllContent()`
    - Return JSON gabungan
    - _Requirements: 9.4_

  - [x] 5.4 Buat `app/api/admin/login/route.ts` — POST login
    - Rate limit check
    - Baca `config/admin.json`, bandingkan bcrypt hash
    - Set session jika valid, return 401 jika tidak
    - _Requirements: 9.1, 9.2, 10.4, 10.6_

  - [x] 5.5 Buat `app/api/admin/logout/route.ts` — POST logout
    - Destroy session, return 200
    - _Requirements: 9.7_

  - [x] 5.6 Buat `app/api/admin/content/[category]/route.ts` — PUT per kategori
    - Check session (requireAdmin)
    - Validate category param (hanya 5 kategori valid)
    - Validate body dengan Zod schema per kategori
    - Sanitize strings (trim)
    - Write ke file JSON jika valid, return 400 jika tidak
    - _Requirements: 9.4, 9.5, 9.6, 10.5_

  - [x] 5.7 Buat `middleware.ts` — proteksi route admin
    - Redirect `/admin/dashboard` ke `/admin` jika tidak ada session
    - _Requirements: 9.1_

  - [x] 5.8 Buat `config/admin.json` dengan kredensial default
    - Username: "admin", password hash (bcrypt cost 10)
    - _Requirements: 10.6_

- [x] 6. Implementasikan Admin Panel
  - [x] 6.1 Buat `app/admin/page.tsx` — halaman login
    - Form username + password
    - Submit ke `POST /api/admin/login`
    - Tampilkan error jika login gagal
    - Redirect ke `/admin/dashboard` jika berhasil
    - _Requirements: 9.1, 9.2_

  - [x] 6.2 Buat `app/admin/dashboard/page.tsx` — dashboard
    - Fetch data dari `/api/content` saat mount
    - Tab navigasi: Statistik, Testimoni, Layanan, Cara Daftar, Kontak
    - Tombol "Keluar" → POST `/api/admin/logout`
    - _Requirements: 9.3, 9.8_

  - [x] 6.3 Buat `components/admin/StatisticsTab.tsx`
    - 3 input fields untuk metrik
    - Simpan → PUT `/api/admin/content/statistics`
    - _Requirements: 9.3, 9.5_

  - [x] 6.4 Buat `components/admin/TestimonialsTab.tsx`
    - Tabel CRUD testimoni
    - Simpan → PUT `/api/admin/content/testimonials`
    - _Requirements: 9.3, 9.5, 9.6_

  - [x] 6.5 Buat `components/admin/ServicesTab.tsx`
    - CRUD layanan + keunggulan
    - Simpan → PUT `/api/admin/content/services`
    - _Requirements: 9.3, 9.5, 9.6_

  - [x] 6.6 Buat `components/admin/RegistrationTab.tsx`
    - CRUD langkah + estimasi waktu
    - Simpan → PUT `/api/admin/content/registration`
    - _Requirements: 9.3, 9.5, 9.6_

  - [x] 6.7 Buat `components/admin/ContactTab.tsx`
    - Edit kontak footer
    - Simpan → PUT `/api/admin/content/contact`
    - _Requirements: 9.3, 9.5_

- [x] 7. Checkpoint — Verifikasi admin panel end-to-end
  - Login → edit statistik → simpan → refresh landing page → verifikasi data berubah
  - Verifikasi rate limiting (6 percobaan login gagal → 429)
  - Verifikasi akses `/data/statistics.json` langsung → 404

- [x] 8. Implementasikan tests
  - [x] 8.1 Setup Vitest dengan konfigurasi jsdom
    - `vitest.config.ts` dengan environment jsdom, setup files
    - _Requirements: 8.2_

  - [x] 8.2 Unit tests — validasi dan lib functions
    - Test Zod schemas: valid data passes, invalid data fails
    - Test `readCategory` / `writeCategory`
    - Test `validateCategory` per kategori
    - _Requirements: 9.6_

  - [x] 8.3 Unit tests — UI components
    - Test `StarRating`: filled count = rating, empty = 5 - rating
    - Test `Avatar`: fallback inisial saat foto gagal
    - Test `PlayStoreButton`: href, target, rel attributes
    - _Requirements: 4.2, 4.5, 6.2_

  - [x] 8.4 Property-based tests dengan fast-check
    - Property 6: Label statistik 1–30 karakter
    - Property 10: Rating bintang akurat
    - Property 18: BackToTop visibility
    - Property 21: PUT menolak data tidak valid
    - Property 23: Direktori sensitif tidak bisa diakses
    - _Requirements: 3.2, 4.2, 7.4, 9.6, 10.1_

  - [x] 8.5 Setup Playwright untuk E2E tests
    - `playwright.config.ts` dengan multi-browser, multi-viewport
    - _Requirements: 8.2_

  - [x] 8.6 E2E tests — responsivitas dan aksesibilitas
    - Tidak ada overflow horizontal di semua viewport
    - Layout responsif per section
    - axe-core accessibility audit
    - _Requirements: 1.5, 3.4, 5.6, 7.5, 8.3_

  - [x] 8.7 E2E tests — admin panel flow
    - Login → dashboard → edit → save → verify
    - Rate limiting test
    - Unauthorized access test
    - _Requirements: 9.1, 9.2, 10.4_

- [x] 9. Checkpoint akhir — Semua tests lulus
  - `npm run test` (Vitest) — semua pass
  - `npm run test:e2e` (Playwright) — semua pass
  - `npm run build` — no TypeScript errors
  - Verifikasi `next start` berjalan di production mode

## Catatan

- Task yang ditandai `*` bersifat opsional untuk MVP
- Server Components digunakan untuk section yang tidak butuh interaktivitas → mengurangi JS bundle
- Client Components hanya untuk: Navbar (scroll), Statistics (CountUp), Testimonials (Swiper), BackToTop (scroll), Admin panel
- `next/image` otomatis mengoptimasi gambar ke WebP — tidak perlu manual `<picture>` element
- `next/font` self-host font — tidak ada request ke Google Fonts CDN saat runtime
- Data di `data/` dan `config/` aman karena di luar `public/` dan `.next/static/`
- Deploy ke VPS: `npm run build` → `pm2 start npm -- start` atau `node .next/standalone/server.js`

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1"] },
    { "id": 1, "tasks": ["2.1", "2.2", "2.3", "2.4"] },
    { "id": 2, "tasks": ["3.1", "3.2"] },
    { "id": 3, "tasks": ["3.3", "3.4", "3.5", "3.6", "3.7", "3.8", "3.9", "3.10", "3.11", "3.12"] },
    { "id": 4, "tasks": ["4"] },
    { "id": 5, "tasks": ["5.1", "5.2", "5.3", "5.4", "5.5", "5.6", "5.7", "5.8"] },
    { "id": 6, "tasks": ["6.1", "6.2"] },
    { "id": 7, "tasks": ["6.3", "6.4", "6.5", "6.6", "6.7"] },
    { "id": 8, "tasks": ["7"] },
    { "id": 9, "tasks": ["8.1", "8.5"] },
    { "id": 10, "tasks": ["8.2", "8.3", "8.4", "8.6", "8.7"] },
    { "id": 11, "tasks": ["9"] }
  ]
}
```
