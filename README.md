# School App

School App adalah aplikasi web untuk mengelola data Siswa, Kelas, dan Guru. Aplikasi ini menyediakan fitur autentikasi (Login, Register, Logout) serta fitur CRUD untuk masing-masing entitas. Proyek ini dibangun dengan:

- **Frontend:** Next.js 15.2+ (menggunakan struktur folder **app**, TypeScript, dan Tailwind CSS)
- **Backend:** Node.js dengan Express
- **Database:** Free Database Easy to Use ( menggunakan database PostgreSQL Online)

## Fitur

- **Autentikasi:** Register, Login, Logout  
- **Manage Siswa:** CRUD (Create, Read, Update, Delete) dengan filter berdasarkan kelas  
- **Manage Kelas:** CRUD (Create, Read, Update, Delete)  
- **Manage Guru:** CRUD (Create, Read, Update, Delete) dengan filter berdasarkan kelas  
- **Halaman Gabungan:** Menampilkan daftar lengkap Siswa, Kelas, dan Guru  
- **Navigasi:** Navbar responsif dengan Tailwind CSS yang muncul di semua halaman

## Instalasi & Penggunaan

### 1. Clone Repository
```bash
git clone https://github.com/username/school-app.git
cd manage-school-app
```
## 2. Setup Backend
Masuk ke folder backend dan instal dependensi:
```bash
cd backend
npm install
npm run dev
```
Backend akan berjalan di http://localhost:5000.

## 3. Jalankan Frontend
Masuk ke folder Frontend dan instal dependensi:
```bash
cd frontend
npm install
npm run dev
```
Buka browser di http://localhost:3000.
