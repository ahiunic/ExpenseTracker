import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { query } from '../db.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { asyncHandler } from '../utils.js';
import { loginSchema, userSchema } from '../validators.js';

const router = Router();

router.post('/login', asyncHandler(async (req, res) => {
  const data = loginSchema.parse(req.body);
  const { rows } = await query('SELECT id, name, email, password, role FROM users WHERE LOWER(email) = LOWER($1)', [data.email]);
  const user = rows[0];
  if (!user || !(await bcrypt.compare(data.password, user.password))) return res.status(401).json({ message: 'Invalid email or password' });
  const payload = { id: user.id, name: user.name, email: user.email, role: user.role };
  res.json({ token: jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn }), user: payload });
}));

router.post('/register', authenticate, authorize('admin'), asyncHandler(async (req, res) => {
  const data = userSchema.extend({ password: userSchema.shape.password.unwrap() }).parse(req.body);
  const password = await bcrypt.hash(data.password, 12);
  const { rows } = await query(
    'INSERT INTO users (name, email, password, role) VALUES ($1, LOWER($2), $3, $4) RETURNING id, name, email, role, created_at',
    [data.name, data.email, password, data.role]
  );
  res.status(201).json(rows[0]);
}));

export default router;

