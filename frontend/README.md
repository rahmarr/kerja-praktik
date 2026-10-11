# Digitak Frontend — React + Vite

Frontend Website Digitak (React + Vite + Tailwind CSS v4 + React Router + Axios).

## Halaman

### Publik
| Route | Halaman |
|---|---|
| `/` | Beranda |
| `/produk` | Produk |
| `/layanan` | Layanan |
| `/layanan/:slug` | Detail Layanan (6 layanan) |
| `/portofolio` | Portofolio (filter tahun) |
| `/perusahaan` | Perusahaan |
| `/kontak` | Kontak Kami |
| `/form-pengajuan` | Form Pengajuan (service_id dibawa otomatis via `?service=`) |
| `/konfirmasi?code=REQ-...` | Konfirmasi berhasil + Request ID |
| `/cek-status` | Cek status permintaan |

### Admin
| Route | Halaman |
|---|---|
| `/admin/login` | Login Admin |
| `/admin` | Dashboard (KPI + request terbaru) |
| `/admin/permintaan` | Daftar permintaan |
| `/admin/permintaan/:id` | Detail + update status/respons + riwayat |
| `/admin/layanan` | Kelola layanan (CRUD + soft delete/restore) |
| `/admin/konten` | Kelola konten dinamis |
| `/admin/subscriber` | Kelola subscriber newsletter |

## Cara Menjalankan

1. **Pastikan backend berjalan** di `http://localhost:3000` (lihat `backend/README.md`).

2. **Install dependency & jalankan**
   ```bash
   npm install
   npm run dev
   ```
   Buka `http://localhost:5173`.

   Konfigurasi proxy sudah diatur di `vite.config.js` — semua request `/api/*` otomatis
   diteruskan ke `http://localhost:3000`, sehingga tidak perlu setup CORS manual di frontend.

3. **Build produksi**
   ```bash
   npm run build   # hasil di dist/
   npm run preview
   ```

## Alur Utama
- **Ajukan Proyek** di halaman publik membawa `?service=<slug>` → Form Pengajuan menampilkan
  layanan terpilih (read-only) → submit `POST /api/service-requests` → redirect ke
  `/konfirmasi?code=<request_code>`.
- **Cek Status** menggunakan Request ID publik → `GET /api/service-requests/:code`.
- **Login Admin** (JWT disimpan di localStorage) → mengelola request, layanan, konten, subscriber.

## Akun Demo Admin
`admin@digitak.id` / `admin123`

## Struktur File
```
frontend/
├─ vite.config.js     # proxy /api + Tailwind v4
├─ index.html
└─ src/
   ├─ main.jsx / App.jsx / index.css
   ├─ api/client.js   # axios + interceptor JWT
   ├─ api/format.js
   ├─ context/AuthContext.jsx
   ├─ components/     # Navbar/Footer di PortalLayout, ServiceCard, StatusBadge, dll.
   └─ pages/
      ├─ public/      # 10 halaman publik
      └─ admin/       # Login + 5 halaman dashboard
```