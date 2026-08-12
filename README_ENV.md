# Environment Setup Documentation

Dokumentasi ini menjelaskan cara menyiapkan environment untuk menjalankan proyek Nuxt 4 + Tabler Admin Dashboard.

## Prasyarat

- Node.js 18 atau versi terbaru yang kompatibel dengan Nuxt 4
- npm
- MariaDB / MySQL jika ingin menggunakan backend database lokal
- Akses internet untuk memuat CDN reCAPTCHA dan dependensi

## Instalasi Dependensi

Jalankan perintah berikut di direktori proyek:

```bash
npm install
```

Perintah ini akan menginstal semua dependensi dari `package.json`.

## Konfigurasi Environment

Salin file contoh `.env.example` ke `.env` di root proyek:

```bash
cp .env.example .env
```

Kemudian edit nilai variabel sesuai kebutuhan.

### Variabel yang tersedia

```dotenv
APP_NAME=NAME_APP_HERE
APP_CLIENT=NAME_CLIENT_HERE
NUXT_PUBLIC_RECAPTCHA_SITE_KEY=YOUR_SITE_KEY
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=kepegawaian_db
JWT_SECRET=your_jwt_secret
```

### Penjelasan variabel

- `APP_NAME`: Nama aplikasi yang akan digunakan di beberapa tempat tampilan.
- `APP_CLIENT`: Nama klien atau organisasi yang muncul di tampilan.
- `NUXT_PUBLIC_RECAPTCHA_SITE_KEY`: Kunci publik Google reCAPTCHA untuk login captcha.
- `DB_HOST`: Host database MariaDB / MySQL.
- `DB_USER`: Username database.
- `DB_PASSWORD`: Password database.
- `DB_NAME`: Nama database default.
- `JWT_SECRET`: Kunci rahasia untuk membuat dan memverifikasi JSON Web Token.

> Jika variabel database tidak diatur, server akan menggunakan default:
> `localhost`, user `root`, password kosong, dan database `kepegawaian_db`.

## Struktur Konfigurasi Nuxt

Nuxt mengikat environment publik dan runtime config di `nuxt.config.js`:

- `appName` dan `appClient` diambil dari `process.env.APP_NAME` dan `process.env.APP_CLIENT`
- `recaptchaSiteKey` diambil dari `process.env.NUXT_PUBLIC_RECAPTCHA_SITE_KEY`

Fungsinya:

- `useRuntimeConfig()` di Vue / API server untuk membaca nilai runtime config.
- `NUXT_PUBLIC_` otomatis tersedia di klien.

## Menjalankan Aplikasi

### Development

```bash
npm run dev
```

Buka browser di:

```text
http://localhost:3000
```

### Build Production

```bash
npm run build
```

### Preview Hasil Build

```bash
npm run preview
```

## Catatan Tambahan

- Pastikan `zod` sudah terpasang karena digunakan untuk validasi schema pada frontend dan backend.
- Jika menggunakan fitur login, pastikan properti `NUXT_PUBLIC_RECAPTCHA_SITE_KEY` terisi.
- Untuk pengaturan database, pastikan MariaDB berjalan dan database `kepegawaian_db` sudah ada atau bisa dibuat terlebih dahulu.
- `server/utils/db.js` membaca variabel `DB_HOST`, `DB_USER`, `DB_PASSWORD`, dan `DB_NAME` dari environment.
- `server/api/auth/login.post.js` dan `server/api/me.get.js` menggunakan `JWT_SECRET` untuk validasi token.

## Troubleshooting

- Jika muncul error `Failed to resolve import "~/utils/schemas"`, pastikan alias Nuxt `~` dipakai dengan benar dan file `app/utils/schemas.js` tersedia.
- Jika reCAPTCHA gagal, cek kembali `NUXT_PUBLIC_RECAPTCHA_SITE_KEY` dan apakah script Google reCAPTCHA di-load.
- Jika koneksi database gagal, pastikan kredensial database sudah benar dan server MariaDB berjalan.
