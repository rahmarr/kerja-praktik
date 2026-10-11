import { Router } from 'express';
import db from '../db.js';
import {
  asyncHandler,
  isValidEmail,
  isValidPhone,
  CUSTOMER_TYPES,
  generateRequestCode,
} from '../utils/helpers.js';

const router = Router();

// POST /api/service-requests - customer membuat request (CREATE)
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const body = req.body || {};
    const { customer_name, customer_type, organization_name, email, phone, service_id, description } = body;

    const errors = {};
    if (!customer_name || !customer_name.trim()) errors.customer_name = 'Nama wajib diisi';
    if (!CUSTOMER_TYPES.includes(customer_type)) errors.customer_type = 'Jenis customer tidak valid';
    if (!isValidEmail(email)) errors.email = 'Format email tidak valid';
    if (!phone || !isValidPhone(phone)) errors.phone = 'Format nomor telepon tidak valid';
    if (!service_id) errors.service_id = 'Layanan wajib dipilih';
    if (!description || !description.trim()) errors.description = 'Deskripsi kebutuhan wajib diisi';
    else if (description.trim().length > 2000) errors.description = 'Deskripsi maksimal 2000 karakter';

    if (Object.keys(errors).length) {
      return res.status(422).json({ success: false, message: 'Validasi gagal', errors });
    }

    const svc = db
      .prepare(
        `SELECT id FROM services
          WHERE id = ? AND is_active = 1 AND deleted_at IS NULL`
      )
      .get(service_id);
    if (!svc) {
      return res.status(422).json({
        success: false,
        message: 'Layanan tidak ditemukan atau tidak aktif',
        errors: { service_id: 'Layanan tidak valid' },
      });
    }

    const requestCode = generateRequestCode();

    db.exec('BEGIN');
    let created;
    try {
      const insertResult = db
        .prepare(
          `INSERT INTO service_requests
             (request_code, customer_name, customer_type, organization_name,
              email, phone, service_id, description, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Menunggu Ditinjau')`
        )
        .run(
          requestCode,
          customer_name.trim(),
          customer_type,
          organization_name?.trim() || null,
          email.trim().toLowerCase(),
          phone.trim(),
          service_id,
          description.trim()
        );
      const createdId = Number(insertResult.lastInsertRowid);

      db.prepare(
        `INSERT INTO request_history (request_id, old_status, new_status, admin_response)
         VALUES (?, NULL, ?, NULL)`
      ).run(createdId, 'Menunggu Ditinjau');

      created = db
        .prepare(`SELECT id, request_code, status, created_at FROM service_requests WHERE id = ?`)
        .get(createdId);
      db.exec('COMMIT');
    } catch (err) {
      db.exec('ROLLBACK');
      throw err;
    }

    return res.status(201).json({
      success: true,
      message: 'Permintaan berhasil dikirim',
      data: { request_code: created.request_code, status: created.status },
    });
  })
);

// GET /api/service-requests/:requestCode - cek status (public, tanpa login)
router.get(
  '/:requestCode',
  asyncHandler(async (req, res) => {
    const { requestCode } = req.params;
    const row = db
      .prepare(
        `SELECT r.request_code, r.status, r.admin_response, r.created_at,
                s.name AS service_name, s.slug AS service_slug
           FROM service_requests r
           JOIN services s ON s.id = r.service_id
          WHERE r.request_code = ? AND r.deleted_at IS NULL`
      )
      .get(requestCode);
    if (!row) {
      return res.status(404).json({ success: false, message: 'Request ID tidak ditemukan' });
    }
    return res.json({
      success: true,
      data: {
        request_code: row.request_code,
        service: { name: row.service_name, slug: row.service_slug },
        status: row.status,
        admin_response: row.admin_response,
        created_at: row.created_at,
      },
    });
  })
);

export default router;