import db from '../db.js';

export const STATUSES = ['Menunggu Ditinjau', 'Sedang Diproses', 'Menunggu Informasi', 'Selesai'];
export const CUSTOMER_TYPES = ['individu', 'perusahaan', 'umkm', 'startup', 'organisasi'];
export const SUBSCRIBER_STATUSES = ['subscribed', 'unsubscribed'];
export const CONTENT_CATEGORIES = ['portfolio', 'article', 'product', 'hero_section', 'page'];

export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

export function isValidPhone(phone) {
  return typeof phone === 'string' && /^(\+62|62|0)8\d{8,12}$/.test(phone.trim());
}

export function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function generateRequestCode() {
  const year = new Date().getFullYear();
  for (let attempt = 0; attempt < 10; attempt++) {
    const { count } = db
      .prepare(
        `SELECT COUNT(*) AS count
           FROM service_requests
          WHERE strftime('%Y', created_at) = ?`
      )
      .get(String(year));
    const seq = (count || 0) + 1 + attempt;
    const code = `REQ-${year}-${String(seq).padStart(3, '0')}`;
    const exists = db.prepare(`SELECT 1 FROM service_requests WHERE request_code = ?`).get(code);
    if (!exists) return code;
  }
  throw new Error('Gagal membuat Request ID yang unik');
}

export function mapError(err) {
  if (err.message && err.message.includes('UNIQUE constraint failed')) {
    return { status: 409, message: 'Data sudah ada (nilai duplikat)' };
  }
  if (err.message && err.message.includes('FOREIGN KEY constraint failed')) {
    return { status: 422, message: 'Data terkait tidak ditemukan' };
  }
  return { status: 500, message: 'Terjadi kesalahan server' };
}