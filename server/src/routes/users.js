import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../db.js';
import { authorize } from '../middleware/auth.js';
import { asyncHandler } from '../utils.js';
import { userSchema } from '../validators.js';

const router = Router();
router.use(authorize('admin'));

router.get('/', asyncHandler(async (req, res) => {
  const { rows } = await query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');
  res.json(rows);
}));

router.put('/:id', asyncHandler(async (req, res) => {
  const data = userSchema.parse(req.body);
  const password = data.password ? await bcrypt.hash(data.password, 12) : null;
  const { rows } = await query(
    `UPDATE users SET name=$1, email=LOWER($2), role=$3, password=COALESCE($4, password)
     WHERE id=$5 RETURNING id, name, email, role, created_at`,
    [data.name, data.email, data.role, password, req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ message: 'User not found' });
  res.json(rows[0]);
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  if (Number(req.params.id) === req.user.id) return res.status(400).json({ message: 'You cannot delete your own account' });
  const result = await query('DELETE FROM users WHERE id=$1', [req.params.id]);
  if (!result.rowCount) return res.status(404).json({ message: 'User not found' });
  res.status(204).end();
}));

export default router;

