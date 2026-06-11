import fs from 'fs/promises';
import path from 'path';
import { Router } from 'express';
import { query } from '../db.js';
import { authorize } from '../middleware/auth.js';
import { uploadFor } from '../middleware/upload.js';
import { asyncHandler, filePath, pagination } from '../utils.js';
import { supplierSchema } from '../validators.js';

const router = Router();
const upload = uploadFor('gst-bills');
router.use(authorize('admin', 'accounts'));

router.get('/', asyncHandler(async (req, res) => {
  const { page, limit, offset } = pagination(req.query);
  const search = `%${req.query.search || ''}%`;
  const status = req.query.status || '';
  const where = `WHERE ($1='' OR supplier_name ILIKE $2 OR invoice_no ILIKE $2 OR gstin ILIKE $2) AND ($3='' OR status=$3)`;
  const [records, count] = await Promise.all([
    query(`SELECT * FROM supplier_payments ${where} ORDER BY invoice_date DESC, id DESC LIMIT $4 OFFSET $5`, [req.query.search || '', search, status, limit, offset]),
    query(`SELECT COUNT(*)::int AS total FROM supplier_payments ${where}`, [req.query.search || '', search, status])
  ]);
  res.json({ data: records.rows, pagination: { page, limit, total: count.rows[0].total, pages: Math.ceil(count.rows[0].total / limit) } });
}));

router.post('/', upload.single('gst_bill'), asyncHandler(async (req, res) => {
  const d = supplierSchema.parse(req.body);
  const bill = filePath(req.file, 'gst-bills');
  const status = bill ? 'GST Uploaded' : 'GST Pending';
  const { rows } = await query(
    `INSERT INTO supplier_payments (supplier_name,mobile,invoice_no,gstin,amount,invoice_date,payment_date,gst_bill_pdf,utr_no,status,remarks,created_by)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
    [d.supplier_name,d.mobile,d.invoice_no,d.gstin,d.amount,d.invoice_date,d.payment_date,bill,d.utr_no,status,d.remarks,req.user.id]
  );
  res.status(201).json(rows[0]);
}));

router.put('/:id', upload.single('gst_bill'), asyncHandler(async (req, res) => {
  const d = supplierSchema.parse(req.body);
  const bill = filePath(req.file, 'gst-bills');
  const { rows } = await query(
    `UPDATE supplier_payments SET supplier_name=$1,mobile=$2,invoice_no=$3,gstin=$4,amount=$5,invoice_date=$6,payment_date=$7,
     gst_bill_pdf=COALESCE($8,gst_bill_pdf),utr_no=$9,status=CASE WHEN COALESCE($8,gst_bill_pdf) IS NULL THEN 'GST Pending' ELSE 'GST Uploaded' END,remarks=$10
     WHERE id=$11 RETURNING *`,
    [d.supplier_name,d.mobile,d.invoice_no,d.gstin,d.amount,d.invoice_date,d.payment_date,bill,d.utr_no,d.remarks,req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ message: 'Supplier payment not found' });
  res.json(rows[0]);
}));

router.delete('/:id', authorize('admin'), asyncHandler(async (req, res) => {
  const { rows } = await query('DELETE FROM supplier_payments WHERE id=$1 RETURNING gst_bill_pdf', [req.params.id]);
  if (!rows[0]) return res.status(404).json({ message: 'Supplier payment not found' });
  if (rows[0].gst_bill_pdf) await fs.unlink(path.resolve(`.${rows[0].gst_bill_pdf}`)).catch(() => {});
  res.status(204).end();
}));

export default router;

