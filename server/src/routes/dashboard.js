import { Router } from 'express';
import { query } from '../db.js';
import { asyncHandler } from '../utils.js';

const router = Router();

router.get('/', asyncHandler(async (req, res) => {
  const own = req.user.role === 'supervisor';
  const params = own ? [req.user.id] : [];
  const expenseWhere = own ? 'WHERE created_by = $1' : '';
  const [suppliers, expenses, recent] = await Promise.all([
    query(`SELECT COALESCE(SUM(amount),0)::numeric AS total_supplier_payments,
      COUNT(*) FILTER (WHERE status='GST Pending')::int AS pending_gst_bills FROM supplier_payments`),
    query(`SELECT COALESCE(SUM(amount),0)::numeric AS site_expenses,
      COUNT(*) FILTER (WHERE status='Pending')::int AS pending_approvals FROM site_expenses ${expenseWhere}`, params),
    query(`SELECT id, site_name AS name, amount, status, created_at, 'expense' AS type FROM site_expenses ${expenseWhere}
      ORDER BY created_at DESC LIMIT 5`, params)
  ]);
  res.json({ ...suppliers.rows[0], ...expenses.rows[0], recent: recent.rows });
}));

export default router;

