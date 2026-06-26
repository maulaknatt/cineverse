# 🎬 CineVerse

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Clerk](https://img.shields.io/badge/Clerk-Authentication-6C47FF?style=for-the-badge&logo=clerk)](https://clerk.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-Google-4285F4?style=for-the-badge&logo=google-gemini)](https://ai.google.dev/)

**CineVerse** adalah sebuah platform sosial modern berbasis web yang dirancang khusus untuk para pencinta film dan acara TV. Di sini, pengguna tidak hanya dapat melacak film yang ditonton, tetapi juga berinteraksi dengan komunitas, mengulas, membuat koleksi kustom, bersaing dalam sistem pencapaian (gamifikasi), dan mendapatkan rekomendasi personal bertenaga AI (Google Gemini).

---

## 🌟 Fitur Utama

- **👤 Autentikasi Pengguna Aman**: Terintegrasi penuh dengan **Clerk Auth** untuk kemudahan pendaftaran dan masuk.
- **🎮 Sistem Gamifikasi (Level & XP)**: Pengguna memiliki Level dan XP yang dapat ditingkatkan dengan menyelesaikan aktivitas di platform.
- **🏆 Sistem Pencapaian (Achievements)**: Dapatkan medali atau pencapaian dengan kelangkaan mulai dari *Common* hingga *Legendary* dan menangkan hadiah XP.
- **✍️ Ulasan & Komentar Interaktif**: Tulis ulasan film dengan rating bintang (0.5 hingga 5.0), tandai spoiler jika ada, sukai ulasan orang lain, dan diskusikan di kolom komentar.
- **📊 Pelacak Watchlist & Riwayat**: Kelola daftar tontonan Anda dengan berbagai status (*Watching, Completed, Dropped, Plan to Watch*) serta pantau riwayat menonton (*Watch History*).
- **📂 Koleksi Kustom**: Buat dan bagikan daftar film buatan Anda sendiri (misal: "Film Horor Terbaik Dekade Ini").
- **👥 Sistem Sosial**: Cari dan ikuti (*follow*) sesama pecinta film untuk melihat ulasan dan aktivitas terbaru mereka.
- **🤖 Rekomendasi AI Gemini**: Dapatkan saran tontonan pintar yang disesuaikan dengan preferensi Anda langsung dari AI Google Gemini.
- **🔔 Notifikasi Real-time**: Pemberitahuan untuk ulasan yang disukai, pengikut baru, rilis film baru, saran AI, pengingat nonton, dan pencapaian yang berhasil diraih.

---

## 🛠️ Teknologi yang Digunakan

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router & React 19)
- **Desain & UI**: [Tailwind CSS v4](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/), & [Framer Motion](https://www.framer.com/motion/) (untuk animasi yang interaktif dan halus)
- **Manajemen State**: [Zustand](https://zustand-demo.pmnd.rs/) & [TanStack React Query v5](https://tanstack.com/query/latest)
- **Database & ORM**: PostgreSQL (Hosted on [Supabase](https://supabase.com/)) & [Prisma ORM](https://www.prisma.io/)
- **Autentikasi**: [Clerk](https://clerk.com/)
- **Integrasi AI**: [Google Generative AI SDK](https://ai.google.dev/) (Gemini API)
- **Penyimpanan Media**: [Cloudinary](https://cloudinary.com/) (untuk upload avatar, banner, dan gambar ulasan)
- **Sumber Data Film**: [TMDB (The Movie Database) API](https://www.themoviedb.org/)

---

## 🚀 Panduan Memulai

Ikuti langkah-langkah di bawah ini untuk menjalankan CineVerse di komputer lokal Anda:

### 1. Prasyarat
Pastikan Anda sudah menginstal:
- [Node.js](https://nodejs.org/) (versi 18 ke atas)
- [Git](https://git-scm.com/)

### 2. Klon Repositori
```bash
git clone https://github.com/maulaknatt/cineverse.git
cd cineverse
```

### 3. Instal Dependensi
```bash
npm install
```

### 4. Konfigurasi Environment Variables
Buat file bernama `.env.local` di root direktori proyek Anda dan isi nilai-nilainya sesuai dengan contoh di bawah ini (atau salin dari `.env.example`):

```env
# TMDB (The Movie Database)
# Dapatkan API Key di: https://www.themoviedb.org/settings/api
TMDB_API_KEY=api_key_tmdb_anda
TMDB_ACCESS_TOKEN=read_access_token_tmdb_anda
NEXT_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3
NEXT_PUBLIC_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p

# Database (Supabase PostgreSQL)
# Dapatkan string koneksi di panel Supabase Anda
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Clerk Authentication
# Dapatkan keys di: https://dashboard.clerk.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
CLERK_WEBHOOK_SECRET=whsec_...

# Google Gemini AI
# Dapatkan API key di: https://aistudio.google.com/apikey
GEMINI_API_KEY=api_key_gemini_anda

# Cloudinary (Penyimpanan Gambar)
# Dapatkan kredensial di: https://console.cloudinary.com
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=cloud_name_anda
CLOUDINARY_API_KEY=api_key_cloudinary_anda
CLOUDINARY_API_SECRET=api_secret_cloudinary_anda
CLOUDINARY_UPLOAD_PRESET=cineverse_uploads

# Konfigurasi Aplikasi
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=CineVerse
NODE_ENV=development
```

### 5. Sinkronisasi Database (Prisma)
Jalankan migrasi database atau langsung dorong struktur tabel ke database Supabase Anda:
```bash
# Push skema ke database
npx prisma db push

# Generate client Prisma
npx prisma generate

# (Opsional) Mengisi data awal seperti daftar pencapaian/achievements
npm run db:seed
```

### 6. Jalankan Server Pengembangan
```bash
npm run dev
```
Buka browser Anda dan akses [http://localhost:3000](http://localhost:3000) untuk melihat hasilnya.

---

## 📂 Struktur Folder Proyek

```text
cineverse/
├── app/                  # Direktori Next.js App Router (Halaman & Rute API)
│   ├── (auth)/           # Rute halaman pendaftaran dan masuk (Clerk)
│   ├── (main)/           # Halaman utama aplikasi (Dashboard, Search, AI, TV, dll.)
│   ├── api/              # Endpoint API internal (Watchlist, Favorites, Search, dll.)
│   ├── globals.css       # Styling CSS Global
│   └── layout.tsx        # Layout Root Utama
├── components/           # UI Components yang dapat digunakan kembali (Shadcn UI)
├── constants/            # Berisi konstanta aplikasi
├── features/             # Modul fitur spesifik aplikasi
├── hooks/                # Kustom React hooks
├── lib/                  # Utilitas pihak ketiga (Koneksi Prisma, Clerk Webhook, dll.)
├── prisma/               # Skema database & script data awal (seeding)
│   ├── schema.prisma
│   └── seed.ts
├── public/               # File aset statis (Gambar, Icon)
├── utils/                # Fungsi utilitas helper (Format tanggal, dll.)
├── package.json          # File manifes Node.js & dependencies
└── tsconfig.json         # Konfigurasi TypeScript
```

---

## 🔗 Kontribusi

Jika Anda ingin berkontribusi pada pengembangan CineVerse:
1. Fork repositori ini.
2. Buat branch baru untuk fitur Anda (`git checkout -b fitur/baru-anda`).
3. Commit perubahan Anda (`git commit -m 'Menambahkan fitur baru yang keren'`).
4. Push ke branch tersebut (`git push origin fitur/baru-anda`).
5. Buat Pull Request baru.

---

## 📝 Lisensi

Proyek ini dibuat untuk keperluan pembelajaran dan portofolio pribadi. Informasi lebih lanjut dapat menghubungi pemilik repositori ini.

---

*Dibuat dengan ❤️ oleh [maulaknatt](https://github.com/maulaknatt)*
