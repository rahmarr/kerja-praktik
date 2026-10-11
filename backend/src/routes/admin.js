import { Router } from 'express';
import db from '../db.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';
import {
  asyncHandler,
  STATUSES,
  SUBSCRIBER_STATUSES,
  CONTENT_CATEGORIES,
  slugify,
} from '../utils/helpers.js';

const router = Router();

router.use(authenticate, authorizeAdmin);

// ============================= STATS =============================
// GET /api/admin/stats - KPI dashboard
router.get(
  '/stats',
  asyncHandler(async (_req, res) => {
    const row = db
      .prepare(
        `SELECT
           COUNT(*) AS total,
           COALESCE(SUM(CASE WHEN status = 'Menunggu Ditinjau' THEN 1 ELSE 0 END), 0) AS menunggu,
           COALESCE(SUM(CASE WHEN status = 'Sedang Diproses' THEN 1 ELSE 0 END), 0) AS diproses,
           COALESCE(SUM(CASE WHEN status = 'Menunggu Informasi' THEN 1 ELSE 0 END), 0) AS menunggu_informasi,
           COALESCE(SUM(CASE WHEN status = 'Selesai' THEN 1 ELSE 0 END), 0) AS selesai,
           COUNT(DISTINCT service_id) AS layanan_terpakai
         FROM service_requests
         WHERE deleted_at IS NULL`
      )
      .get();
    return res.json({ success: true, data: row });
  })
);

// ========================= SERVICE REQUESTS =========================
// GET /api/admin/service-requests - daftar request (+filter status, q, pagination)
router.get(
  '/service-requests',
  asyncHandler(async (req, res) => {
    const { status, q } = req.query;
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const pageSize = Math.min(Math.max(parseInt(req.query.pageSize, 10) || 10, 1), 100);

    const conditions = ['r.deleted_at IS NULL'];
    const params = [];
    if (status) {
      params.push(status);
      conditions.push(`r.status = ?`);
    }
    if (q) {
      const qLike = `%${q}%`;
      conditions.push(
        `(r.request_code LIKE ?
          OR r.customer_name LIKE ?
          OR r.email LIKE ?
          OR r.organization_name LIKE ?)`
      );
      params.push(qLike, qLike, qLike, qLike);
    }
    const where = conditions.join(' AND ');

    const { total } = db
      .prepare(`SELECT COUNT(*) AS total FROM service_requests r WHERE ${where}`)
      .get(...params);

    params.push(pageSize, (page - 1) * pageSize);
    const rows = db
      .prepare(
        `SELECT r.id, r.request_code, r.customer_name, r.customer_type, r.organization_name,
                r.email, r.phone, r.description, r.status, r.admin_response,
                r.created_at, r.updated_at,
                s.name AS service_name, s.slug AS service_slug
           FROM service_requests r
           JOIN services s ON s.id = r.service_id
          WHERE ${where}
          ORDER BY r.created_at DESC
          LIMIT ? OFFSET ?`
      )
      .all(...params);
    return res.json({
      success: true,
      data: rows,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    });
  })
);

// GET /api/admin/service-requests/:id - detail request
router.get(
  '/service-requests/:id',
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const row = db
      .prepare(
        `SELECT r.id, r.request_code, r.customer_name, r.customer_type, r.organization_name,
                r.email, r.phone, r.description, r.status, r.admin_response,
                r.created_at, r.updated_at,
                s.name AS service_name, s.slug AS service_slug
           FROM service_requests r
           JOIN services s ON s.id = r.service_id
          WHERE r.id = ? AND r.deleted_at IS NULL`
      )
      .get(id);
    if (!row) {
      return res.status(404).json({ success: false, message: 'Request tidak ditemukan' });
    }
    return res.json({ success: true, data: row });
  })
);

// PATCH /api/admin/service-requests/:id - update status/respons + catat riwayat
router.patch(
  '/service-requests/:id',
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { status, admin_response } = req.body || {};
    const hasStatus = status !== undefined && status !== null;
    const hasResponse = admin_response !== undefined && admin_response !== null;

    if (!hasStatus && !hasResponse) {
      return res.status(422).json({ success: false, message: 'Status atau respons harus diisi' });
    }
    if (hasStatus && !STATUSES.includes(status)) {
      return res.status(422).json({
        success: false,
        message: 'Validasi gagal',
        errors: { status: 'Status tidak dikenal' },
      });
    }

    const current = db
      .prepare(
        `SELECT id, status, admin_response
           FROM service_requests
          WHERE id = ? AND deleted_at IS NULL`
      )
      .get(id);
    if (!current) {
      return res.status(404).json({ success: false, message: 'Request tidak ditemukan' });
    }

    const newStatus = hasStatus ? status : current.status;
    const newResponse = hasResponse ? admin_response.trim() || null : current.admin_response;

    db.exec('BEGIN');
    try {
      db.prepare(
        `UPDATE service_requests
            SET status = ?, admin_response = ?, updated_at = datetime('now')
          WHERE id = ?`
      ).run(newStatus, newResponse, id);
      if (newStatus !== current.status || newResponse !== current.admin_response) {
        db.prepare(
          `INSERT INTO request_history
             (request_id, old_status, new_status, admin_response, changed_by)
           VALUES (?, ?, ?, ?, ?)`
        ).run(id, current.status, newStatus, newResponse, req.user.id);
      }
      db.exec('COMMIT');
    } catch (err) {
      db.exec('ROLLBACK');
      throw err;
    }
    return res.json({
      success: true,
      message: 'Request berhasil diperbarui',
      data: { id, status: newStatus, admin_response: newResponse },
    });
  })
);

// GET /api/admin/service-requests/:id/history - riwayat request
router.get(
  '/service-requests/:id/history',
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const rows = db
      .prepare(
        `SELECT h.id, h.old_status, h.new_status, h.admin_response, h.changed_by, h.created_at,
                u.name AS changed_by_name
           FROM request_history h
           LEFT JOIN users u ON u.id = h.changed_by
          WHERE h.request_id = ?
          ORDER BY h.created_at ASC, h.id ASC`
      )
      .all(id);
    return res.json({ success: true, data: rows });
  })
);

// ========================= SERVICES (MASTER) =========================
// GET /api/admin/services - semua layanan termasuk soft-deleted
router.get(
  '/services',
  asyncHandler(async (_req, res) => {
    const rows = db
      .prepare(
        `SELECT id, name, slug, description, is_active, created_by, updated_by,
                created_at, updated_at, deleted_at
           FROM services
          ORDER BY deleted_at IS NOT NULL, id ASC`
      )
      .all();
    return res.json({ success: true, data: rows });
  })
);

// POST /api/admin/services - tambah layanan
router.post(
  '/services',
  asyncHandler(async (req, res) => {
    const { name, description, is_active } = req.body || {};
    if (!name || !name.trim()) {
      return res.status(422).json({ success: false, message: 'Nama layanan wajib diisi' });
    }
    const slug = slugify(req.body.slug || name);
    if (!slug) {
      return res.status(422).json({ success: false, message: 'Slug tidak valid' });
    }
    const exists = db.prepare(`SELECT 1 FROM services WHERE slug = ?`).get(slug);
    if (exists) {
      return res.status(422).json({ success: false, message: 'Slug sudah digunakan' });
    }
    const result = db
      .prepare(
        `INSERT INTO services (name, slug, description, is_active, created_by, updated_by)
         VALUES (?, ?, ?, ?, ?, ?)`
      )
      .run(name.trim(), slug, description?.trim() || null, is_active === undefined ? 1 : is_active ? 1 : 0, req.user.id, req.user.id);
    const row = db
      .prepare(
        `SELECT id, name, slug, description, is_active, created_at, updated_at
           FROM services WHERE id = ?`
      )
      .get(Number(result.lastInsertRowid));
    return res.status(201).json({ success: true, message: 'Layanan berhasil ditambahkan', data: row });
  })
);

// PATCH /api/admin/services/:id - update layanan
router.patch(
  '/services/:id',
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { name, slug, description, is_active } = req.body || {};
    const current = db
      .prepare(`SELECT id, name, slug, description, is_active FROM services WHERE id = ?`)
      .get(id);
    if (!current) return res.status(404).json({ success: false, message: 'Layanan tidak ditemukan' });

    let newSlug = slug ? slugify(slug) : current.slug;
    if (!newSlug) return res.status(422).json({ success: false, message: 'Slug tidak valid' });
    if (newSlug !== current.slug) {
      const exists = db.prepare(`SELECT 1 FROM services WHERE slug = ? AND id <> ?`).get(newSlug, id);
      if (exists) return res.status(422).json({ success: false, message: 'Slug sudah digunakan' });
    }

    db.prepare(
      `UPDATE services
          SET name = ?, slug = ?, description = ?, is_active = ?,
              updated_by = ?, updated_at = datetime('now')
        WHERE id = ?`
    ).run(
      (name && name.trim()) || current.name,
      newSlug,
      description !== undefined ? description?.trim() || null : current.description,
      is_active === undefined ? current.is_active : is_active ? 1 : 0,
      req.user.id,
      id
    );
    const row = db
      .prepare(
        `SELECT id, name, slug, description, is_active, created_at, updated_at
           FROM services WHERE id = ?`
      )
      .get(id);
    return res.json({ success: true, message: 'Layanan berhasil diperbarui', data: row });
  })
);

// DELETE /api/admin/services/:id - soft delete layanan
router.delete(
  '/services/:id',
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const result = db
      .prepare(
        `UPDATE services
            SET deleted_at = datetime('now'), updated_by = ?, updated_at = datetime('now')
          WHERE id = ? AND deleted_at IS NULL`
      )
      .run(req.user.id, id);
    if (!result.changes) return res.status(404).json({ success: false, message: 'Layanan tidak ditemukan' });
    return res.json({ success: true, message: 'Layanan di-soft delete' });
  })
);

// POST /api/admin/services/:id/restore - restore layanan
router.post(
  '/services/:id/restore',
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const result = db
      .prepare(
        `UPDATE services
            SET deleted_at = NULL, updated_by = ?, updated_at = datetime('now')
          WHERE id = ?`
      )
      .run(req.user.id, id);
    if (!result.changes) return res.status(404).json({ success: false, message: 'Layanan tidak ditemukan' });
    return res.json({ success: true, message: 'Layanan berhasil direstore' });
  })
);

// ========================= NEWSLETTER SUBSCRIBERS =========================
// GET /api/admin/newsletter-subscribers - daftar subscriber
router.get(
  '/newsletter-subscribers',
  asyncHandler(async (req, res) => {
    const { status } = req.query;
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const pageSize = Math.min(Math.max(parseInt(req.query.pageSize, 10) || 10, 1), 100);

    const params = [];
    let where = '';
    if (status) {
      params.push(status);
      where = 'WHERE status = ?';
    }
    const { total } = db
      .prepare(`SELECT COUNT(*) AS total FROM newsletter_subscribers ${where}`)
      .get(...params);

    params.push(pageSize, (page - 1) * pageSize);
    const rows = db
      .prepare(
        `SELECT id, email, status, subscribed_at, updated_at
           FROM newsletter_subscribers ${where}
          ORDER BY subscribed_at DESC
          LIMIT ? OFFSET ?`
      )
      .all(...params);
    return res.json({
      success: true,
      data: rows,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    });
  })
);

// PATCH /api/admin/newsletter-subscribers/:id - ubah status
router.patch(
  '/newsletter-subscribers/:id',
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { status } = req.body || {};
    if (!SUBSCRIBER_STATUSES.includes(status)) {
      return res.status(422).json({ success: false, message: 'Status subscriber tidak valid' });
    }
    const result = db
      .prepare(
        `UPDATE newsletter_subscribers
            SET status = ?, updated_at = datetime('now')
          WHERE id = ?`
      )
      .run(status, id);
    if (!result.changes) return res.status(404).json({ success: false, message: 'Subscriber tidak ditemukan' });
    const row = db
      .prepare(
        `SELECT id, email, status, subscribed_at, updated_at
           FROM newsletter_subscribers WHERE id = ?`
      )
      .get(id);
    return res.json({ success: true, message: 'Status subscriber diperbarui', data: row });
  })
);

// DELETE /api/admin/newsletter-subscribers/:id - hapus subscriber
router.delete(
  '/newsletter-subscribers/:id',
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const result = db
      .prepare(`DELETE FROM newsletter_subscribers WHERE id = ?`)
      .run(id);
    if (!result.changes) return res.status(404).json({ success: false, message: 'Subscriber tidak ditemukan' });
    return res.json({ success: true, message: 'Subscriber dihapus' });
  })
);

// ========================= CONTENTS =========================
// GET /api/admin/contents - semua konten (termasuk draft & soft-deleted)
router.get(
  '/contents',
  asyncHandler(async (req, res) => {
    const { category } = req.query;
    const params = [];
    let where = '1 = 1';
    if (category) {
      params.push(category);
      where = `category = ?`;
    }
    const rows = db
      .prepare(
        `SELECT c.id, c.title, c.slug, c.category, c.body, c.image_url, c.is_published,
                c.created_at, c.updated_at, c.deleted_at,
                u.name AS author_name
           FROM contents c
           LEFT JOIN users u ON u.id = c.created_by
          WHERE ${where}
          ORDER BY c.updated_at DESC`
      )
      .all(...params);
    return res.json({ success: true, data: rows });
  })
);

// POST /api/admin/contents - tambah konten
router.post(
  '/contents',
  asyncHandler(async (req, res) => {
    const { title, category, body, image_url, is_published } = req.body || {};
    const errors = {};
    if (!title || !title.trim()) errors.title = 'Judul wajib diisi';
    if (!CONTENT_CATEGORIES.includes(category)) errors.category = 'Kategori tidak valid';
    if (!body || !body.trim()) errors.body = 'Isi konten wajib diisi';
    if (Object.keys(errors).length) {
      return res.status(422).json({ success: false, message: 'Validasi gagal', errors });
    }
    let slug = slugify(req.body.slug || title);
    if (!slug) return res.status(422).json({ success: false, message: 'Slug tidak valid' });
    const exists = db.prepare(`SELECT 1 FROM contents WHERE slug = ?`).get(slug);
    if (exists) {
      slug = `${slug}-${Date.now().toString().slice(-5)}`;
    }
    const result = db
      .prepare(
        `INSERT INTO contents
           (title, slug, category, body, image_url, is_published, created_by, updated_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(title.trim(), slug, category, body.trim(), image_url?.trim() || null, is_published ? 1 : 0, req.user.id, req.user.id);
    const row = db
      .prepare(
        `SELECT id, title, slug, category, body, image_url, is_published, created_at, updated_at
           FROM contents WHERE id = ?`
      )
      .get(Number(result.lastInsertRowid));
    return res.status(201).json({ success: true, message: 'Konten berhasil dibuat', data: row });
  })
);

// PATCH /api/admin/contents/:id - update konten
router.patch(
  '/contents/:id',
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { title, slug, category, body, image_url, is_published } = req.body || {};

    const current = db.prepare(`SELECT * FROM contents WHERE id = ?`).get(id);
    if (!current) return res.status(404).json({ success: false, message: 'Konten tidak ditemukan' });

    let newSlug = slug ? slugify(slug) : current.slug;
    if (!newSlug) return res.status(422).json({ success: false, message: 'Slug tidak valid' });
    if (newSlug !== current.slug) {
      const exists = db.prepare(`SELECT 1 FROM contents WHERE slug = ? AND id <> ?`).get(newSlug, id);
      if (exists) {
        newSlug = `${newSlug}-${id}`;
      }
    }

    db.prepare(
      `UPDATE contents
          SET title = ?, slug = ?, category = ?, body = ?, image_url = ?,
              is_published = ?, updated_by = ?, updated_at = datetime('now')
        WHERE id = ?`
    ).run(
      (title && title.trim()) || current.title,
      newSlug,
      category || current.category,
      (body && body.trim()) || current.body,
      image_url !== undefined ? image_url?.trim() || null : current.image_url,
      is_published === undefined ? current.is_published : is_published ? 1 : 0,
      req.user.id,
      id
    );
    const row = db
      .prepare(
        `SELECT id, title, slug, category, body, image_url, is_published, created_at, updated_at
           FROM contents WHERE id = ?`
      )
      .get(id);
    return res.json({ success: true, message: 'Konten berhasil diperbarui', data: row });
  })
);

// DELETE /api/admin/contents/:id - soft delete konten
router.delete(
  '/contents/:id',
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const result = db
      .prepare(
        `UPDATE contents
            SET deleted_at = datetime('now'), updated_by = ?, updated_at = datetime('now')
          WHERE id = ? AND deleted_at IS NULL`
      )
      .run(req.user.id, id);
    if (!result.changes) return res.status(404).json({ success: false, message: 'Konten tidak ditemukan' });
    return res.json({ success: true, message: 'Konten di-soft delete' });
  })
);

// POST /api/admin/contents/:id/restore - restore konten
router.post(
  '/contents/:id/restore',
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const result = db
      .prepare(
        `UPDATE contents
            SET deleted_at = NULL, updated_by = ?, updated_at = datetime('now')
          WHERE id = ?`
      )
      .run(req.user.id, id);
    if (!result.changes) return res.status(404).json({ success: false, message: 'Konten tidak ditemukan' });
    return res.json({ success: true, message: 'Konten berhasil direstore' });
  })
);

export default router;