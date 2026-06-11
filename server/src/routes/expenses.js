import fs from 'fs/promises';
import path from 'path';
import { Router } from 'express';
import { query } from '../db.js';
import { authorize } from '../middleware/auth.js';
import { uploadFor } from '../middleware/upload.js';
import { asyncHandler, filePath, pagination } from '../utils.js';
import { expenseSchema } from '../validators.js';

const router = Router();
const upload = uploadFor('site-expenses');

router.get('/', asyncHandler(async (req, res) => {
  const { page, limit, offset } = pagination(req.query);
  const own = req.user.role === 'supervisor';
  const search = `%${req.query.search || ''}%`;
  const status = req.query.status || '';
  const where = `WHERE ($1='' OR site_name ILIKE $2 OR supervisor_name ILIKE $2 OR expense_type ILIKE $2)
    AND ($3='' OR status=$3) AND ($4::boolean=false OR created_by=$5)`;
  const params = [req.query.search || '', search, status, own, req.user.id];
  const [records, count] = await Promise.all([
    query(`SELECT * FROM site_expenses ${where} ORDER BY expense_date DESC, id DESC LIMIT $6 OFFSET $7`, [...params, limit, offset]),
    query(`SELECT COUNT(*)::int AS total FROM site_expenses ${where}`, params)
  ]);
  res.json({ data: records.rows, pagination: { page, limit, total: count.rows[0].total, pages: Math.ceil(count.rows[0].total / limit) } });
}));

router.post('/', authorize('admin', 'supervisor'), upload.single('bill'), asyncHandler(async (req, res) => {
  const d = expenseSchema.parse(req.body);
  const bill = filePath(req.file, 'site-expenses');
  const { rows } = await query(
    `INSERT INTO site_expenses (site_name,supervisor_name,mobile,expense_type,amount,expense_date,bill_pdf,status,remarks,created_by)
     VALUES ($1,$2,$3,$4,$5,$6,$7,'Pending',$8,$9) RETURNING *`,
    [d.site_name,d.supervisor_name,d.mobile,d.expense_type,d.amount,d.expense_date,bill,d.remarks,req.user.id]
  );
  res.status(201).json(rows[0]);
}));

router.put('/:id', authorize('admin', 'supervisor'), upload.single('bill'), asyncHandler(async (req, res) => {
  const existing = await query('SELECT * FROM site_expenses WHERE id=$1', [req.params.id]);
  if (!existing.rows[0]) return res.status(404).json({ message: 'Expense not found' });
  if (req.user.role === 'supervisor' && existing.rows[0].created_by !== req.user.id) return res.status(403).json({ message: 'You can only edit your own expenses' });
  const d = expenseSchema.parse(req.body);
  const bill = filePath(req.file, 'site-expenses');
  const { rows } = await query(
    `UPDATE site_expenses SET site_name=$1,supervisor_name=$2,mobile=$3,expense_type=$4,amount=$5,expense_date=$6,
     bill_pdf=COALESCE($7,bill_pdf),remarks=$8 WHERE id=$9 RETURNING *`,
    [d.site_name,d.supervisor_name,d.mobile,d.expense_type,d.amount,d.expense_date,bill,d.remarks,req.params.id]
  );
  res.json(rows[0]);
}));

router.patch('/:id/status', authorize('admin', 'accounts'), asyncHandler(async (req, res) => {
  if (!['Approved', 'Rejected', 'Pending'].includes(req.body.status)) return res.status(400).json({ message: 'Invalid status' });
  const { rows } = await query('UPDATE site_expenses SET status=$1 WHERE id=$2 RETURNING *', [req.body.status, req.params.id]);
  if (!rows[0]) return res.status(404).json({ message: 'Expense not found' });
  res.json(rows[0]);
}));

router.delete('/:id', authorize('admin'), asyncHandler(async (req, res) => {
  const { rows } = await query('DELETE FROM site_expenses WHERE id=$1 RETURNING bill_pdf', [req.params.id]);
  if (!rows[0]) return res.status(404).json({ message: 'Expense not found' });
  if (rows[0].bill_pdf) await fs.unlink(path.resolve(`.${rows[0].bill_pdf}`)).catch(() => {});
  res.status(204).end();
}));

export default router;
