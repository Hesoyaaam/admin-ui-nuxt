# Nuxt 4 + Tabler Admin Dashboard Boilerplate

## Instalasi Dependensi

```bash
npm install
```

## Konfigurasi Environment

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

## Akun Uji Coba

* **Username:** `superadmin` | **Password:** `password123` | **Role:** Superadmin
* **Username:** `adminhrd` | **Password:** `password123` | **Role:** Admin HRD
* **Username:** `managerhrd` | **Password:** `password123` | **Role:** Manager HRD
```
