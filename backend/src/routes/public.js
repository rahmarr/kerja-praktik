import { Router } from 'express';
import db from '../db.js';
import { asyncHandler, isValidEmail } from '../utils/helpers.js';

const servicesRouter = Router();
const contentsRouter = Router();
const newsletterRouter = Router();

// GET /api/services - daftar layanan aktif (public)
servicesRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const rows = db
      .prepare(
        `SELECT id, name, slug, description, is_active
           FROM services
          WHERE is_active = 1 AND deleted_at IS NULL
          ORDER BY id`
      )
      .all();
    return res.json({ success: true, data: rows });
  })
);

// GET /api/contents - list konten yang publish (public)
contentsRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const { category } = req.query;
    let where = 'is_published = 1 AND deleted_at IS NULL';
    const params = [];
    if (category) {
      params.push(category);
      where += ` AND category = ?`;
    }
    const rows = db
      .prepare(
        `SELECT id, title, slug, category, body, image_url, created_at
           FROM contents
          WHERE ${where}
          ORDER BY created_at DESC`
      )
      .all(...params);
    return res.json({ success: true, data: rows });
  })
);

// GET /api/contents/:slug - detail konten yang publish (public)
contentsRouter.get(
  '/:slug',
  asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const row = db
      .prepare(
        `SELECT id, title, slug, category, body, image_url, created_at
           FROM contents
          WHERE slug = ? AND is_published = 1 AND deleted_at IS NULL`
      )
      .get(slug);
    if (!row) {
      return res.status(404).json({ success: false, message: 'Konten tidak ditemukan' });
    }
    return res.json({ success: true, data: row });
  })
);

// POST /api/newsletter/subscribe - subscribe email (public)
newsletterRouter.post(
  '/subscribe',
  asyncHandler(async (req, res) => {
    const { email } = req.body || {};
    if (!isValidEmail(email)) {
      return res.status(422).json({
        success: false,
        message: 'Validasi gagal',
        errors: { email: 'Format email tidak valid' },
      });
    }
    const norm = email.trim().toLowerCase();
    const sub = db
      .prepare(`SELECT id, status FROM newsletter_subscribers WHERE email = ?`)
      .get(norm);
    if (sub) {
      if (sub.status === 'subscribed') {
        return res.json({ success: true, message: 'Email sudah terdaftar untuk newsletter' });
      }
      db.prepare(
        `UPDATE newsletter_subscribers
            SET status = 'subscribed', updated_at = datetime('now')
          WHERE id = ?`
      ).run(sub.id);
      return res.json({ success: true, message: 'Berhasil berlangganan kembali' });
    }
    db.prepare(
      `INSERT INTO newsletter_subscribers (email, status) VALUES (?, 'subscribed')`
    ).run(norm);
    return res.status(201).json({ success: true, message: 'Berhasil berlangganan newsletter' });
  })
);

export { servicesRouter, contentsRouter, newsletterRouter };