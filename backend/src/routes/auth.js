import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';
import { asyncHandler } from '../utils/helpers.js';

const router = Router();

// POST /api/admin/auth/login - login admin
router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(422).json({ success: false, message: 'Email dan password wajib diisi' });
    }
    const user = db
      .prepare(
        `SELECT id, name, email, password_hash, role
           FROM users
          WHERE email = ? AND deleted_at IS NULL`
      )
      .get(email.trim().toLowerCase());
    if (!user) {
      return res.status(401).json({ success: false, message: 'Email atau password salah' });
    }
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ success: false, message: 'Email atau password salah' });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );
    return res.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  })
);

export default router;