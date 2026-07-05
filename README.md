# 📚 CodeCatalyst - Learning Management System

> Modern LMS platform dengan React 18 & Node.js (Express + MySQL), sistem virtual currency (CodePoints), dan fitur pembelajaran lengkap.

## 🎯 Overview

CodeCatalyst adalah platform Learning Management System (LMS) modern untuk pembelajaran online.

**Fitur utama:**
- Sistem Virtual Currency (CodePoints)
- MySQL Database (bukan mock)
- Auto-Setup Script (`npm run setup:clean`)
- UI/UX Modern & Responsive

## 🛠 Tech Stack

- **Frontend**: React 18, deployed di Vercel
- **Backend**: Node.js + Express, deployed di Railway
- **Database**: MySQL
- **Auth**: Firebase Authentication
- **Requirements**: Node.js v18+, npm, MySQL aktif

## 🚀 Instalasi & Setup

### 1. Setup Database (MySQL)

Pastikan MySQL aktif, lalu import schema:

```bash
mysql -u root -p < backend/database/schema.sql
```

### 2. Konfigurasi Environment

Buat file `.env` di `backend/`:

```env
PORT=3003
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=isi_sesuai_mysql_anda
DB_NAME=codecatalyst_lms
JWT_SECRET=codecatalyst-uts-secret-please-change
USE_MYSQL=true
```

Buat file `.env` di `frontend/`:

```env
REACT_APP_API_BASE_URL=http://localhost:3003
```

### 3. Install Dependencies

```bash
npm run install-all
```

### 4. Jalankan Aplikasi

```bash
npm run dev
```

## 📝 Available Scripts

### Backend

```bash
npm run setup        # Install dependencies
npm run setup:clean  # Clean install + start
npm run start        # Start server
npm run dev          # Start with auto-reload
```

### Frontend

```bash
npm run setup        # Install dependencies
npm start            # Start development server
npm run build         # Build for production
```

## 🔧 Troubleshooting

**Port sudah dipakai (Windows)**
```bash
netstat -ano | findstr :3003
taskkill /PID <PID> /F
```

**Install gagal / error dependency**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Masalah koneksi backend/frontend**
- Pastikan file `.env` di backend & frontend sudah benar
- Cek port 3003 tidak bentrok
- Cek MySQL aktif & database sudah di-import
- Cek Network tab di browser DevTools
- Clear browser cache & localStorage jika frontend error

## 📊 API Endpoint Utama

**Auth**
- `POST /api/auth/register` — Register user
- `POST /api/auth/login` — Login user
- `GET /api/auth/profile` — Profil user (JWT)
- `POST /api/auth/logout` — Logout

**Kursus**
- `GET /api/courses` — Semua kursus
- `GET /api/courses/:id` — Detail kursus
- `GET /api/courses/category/:category` — Kursus per kategori

**Progress & Points**
- `GET /api/progress` — Progress belajar user
- `POST /api/progress/:courseId` — Update progress
- `GET /api/points` — Info CodePoints user
- `POST /api/points/topup` — Topup demo points

**Lainnya**
- `GET /api/faq` — FAQ
- `GET /api/testimonials` — Testimoni
- `GET /api/schedule` — Jadwal
- `GET /api/contact` — Kontak
- `GET /api/health` — Health check

## 📞 Support

- Cek README ini untuk solusi umum
- Lihat dokumentasi API di `/api`
- Cek error di browser console/devtools

---

**Setup Time**: 5-10 menit
**Node.js**: v18+
**Database**: MySQL (bukan mock)

**Last Updated**: Juli 2026
**Version**: 1.0.0
