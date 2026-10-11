# Digitak Backend — REST API

Backend Website Digitak (PT Metanouva Informatika) berbasis **Node.js + Express + PostgreSQL**.

## Fitur
- Service Request: create (Form Kebutuhan), cek status publik, kelola admin, riwayat perubahan (audit trail).
- Request ID otomatis `REQ-YYYY-NNN` + status awal `Menunggu Ditinjau`.
- Newsletter subscribe dengan validasi anti-duplikat.
- Auth admin (JWT + bcrypt) untuk seluruh endpoint `/api/admin/*`.
- CRUD layanan dengan soft delete & restore.
- Pengelolaan konten dinamis (produk, portofolio, artikel) dengan soft delete & restore.
- Soft delete + audit field (`created_by`, `updated_by`) pada seluruh tabel utama.

## Persyaratan
- Node.js >= 18
- PostgreSQL >= 14

## Cara Menjalankan

1. **Buat database**
   ```bash
   psql -U postgres -c "CREATE DATABASE digitak;"
   ```

2. **Konfigurasi**
   Salin `.env.example` menjadi `.env`, lalu sesuaikan `DATABASE_URL` dan `JWT_SECRET`.
   ```
   PORT=3000
   DATABASE_URL=postgres://postgres:postgres@localhost:5432/digitak
   DATABASE_SSL=false
   JWT_SECRET=secret-panjang-acak-anda
   JWT_EXPIRES_IN=8h
   ```

3. **Install dependency & setup skema + seed**
   ```bash
   npm install
   npm run db:setup
   ```
   `db:setup` membuat 6 tabel, akun admin default, 6 layanan, dan konten seed (produk + portofolio).

   Akun admin default: **admin@digitak.id / admin123** (ubah di production!).

4. **Jalankan server**
   ```bash
   npm run dev     # development (auto-restart)
   # atau
   npm start       # production
   ```
   API aktif di `http://localhost:3000`.

5. **Tes cepat**
   ```bash
   curl http://localhost:3000/api/services
   curl -X POST http://localhost:3000/api/admin/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@digitak.id\",\"password\":\"admin123\"}"
   ```

## Endpoint

### Publik (tanpa auth)
| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/api/services` | Daftar layanan aktif |
| POST | `/api/service-requests` | Buat request (CREATE) |
| GET | `/api/service-requests/:requestCode` | Cek status request |
| POST | `/api/newsletter/subscribe` | Subscribe email |
| GET | `/api/contents` | Konten yang publish (opsional `?category=`) |
| GET | `/api/contents/:slug` | Detail konten yang publish |

### Admin (JWT Bearer pada `Authorization: Bearer <token>`)
| Method | Endpoint | Fungsi |
|---|---|---|
| POST | `/api/admin/auth/login` | Login admin → token |
| GET | `/api/admin/stats` | KPI dashboard |
| GET | `/api/admin/service-requests` | Daftar request (`?status=&q=&page=&pageSize=`) |
| GET | `/api/admin/service-requests/:id` | Detail request |
| PATCH | `/api/admin/service-requests/:id` | Update status/respons + catat history |
| GET | `/api/admin/service-requests/:id/history` | Riwayat request |
| GET | `/api/admin/services` | Daftar layanan (termasuk soft-deleted) |
| POST | `/api/admin/services` | Tambah layanan |
| PATCH | `/api/admin/services/:id` | Update layanan |
| DELETE | `/api/admin/services/:id` | Soft delete layanan |
| POST | `/api/admin/services/:id/restore` | Restore layanan |
| GET | `/api/admin/newsletter-subscribers` | Daftar subscriber |
| PATCH | `/api/admin/newsletter-subscribers/:id` | Ubah status subscriber |
| DELETE | `/api/admin/newsletter-subscribers/:id` | Hapus subscriber |
| GET | `/api/admin/contents` | Daftar konten (semua) |
| POST | `/api/admin/contents` | Tambah konten |
| PATCH | `/api/admin/contents/:id` | Update konten |
| DELETE | `/api/admin/contents/:id` | Soft delete konten |
| POST | `/api/admin/contents/:id/restore` | Restore konten |

## Contoh Body

**POST /api/service-requests**
```json
{
  "customer_name": "Regista",
  "customer_type": "individu",
  "organization_name": null,
  "email": "customer@email.com",
  "phone": "081234567890",
  "service_id": 1,
  "description": "Membutuhkan pengembangan aplikasi."
}
```
Response:
```json
{
  "success": true,
  "message": "Permintaan berhasil dikirim",
  "data": { "request_code": "REQ-2026-001", "status": "Menunggu Ditinjau" }
}
```

## Status yang Dikenal
`Menunggu Ditinjau`, `Sedang Diproses`, `Menunggu Informasi`, `Selesai`.
Jenis customer: `individu`, `perusahaan`, `umkm`, `startup`, `organisasi`.

## Struktur File
```
backend/
├─ package.json
├─ .env / .env.example
└─ src/
   ├─ server.js            # bootstrap Express
   ├─ db.js                # pg Pool
   ├─ migration.sql        # DDL 6 tabel
   ├─ runMigration.js      # migration + seed
   ├─ middleware/auth.js   # JWT + authorizeAdmin
   ├─ utils/helpers.js     # validasi & utilitas
   └─ routes/
      ├─ public.js         # services, contents, newsletter
      ├─ requests.js       # create + cek status
      ├─ auth.js           # login admin
      └─ admin.js          # semua endpoint admin
```