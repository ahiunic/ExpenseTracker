import { z } from 'zod';

const optionalText = z.string().trim().optional().nullable().transform(v => v || null);
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const loginSchema = z.object({ email: z.string().email(), password: z.string().min(6) });
export const userSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().email(),
  password: z.string().min(8).optional(),
  role: z.enum(['admin', 'accounts', 'supervisor'])
});
export const supplierSchema = z.object({
  supplier_name: z.string().trim().min(2).max(180),
  mobile: z.string().trim().regex(/^\+?[0-9]{10,15}$/),
  invoice_no: z.string().trim().min(1).max(100),
  gstin: optionalText,
  amount: z.coerce.number().nonnegative(),
  invoice_date: date,
  payment_date: z.union([date, z.literal(''), z.null()]).optional().transform(v => v || null),
  utr_no: optionalText,
  remarks: optionalText
});
export const expenseSchema = z.object({
  site_name: z.string().trim().min(2).max(180),
  supervisor_name: z.string().trim().min(2).max(120),
  mobile: z.string().trim().regex(/^\+?[0-9]{10,15}$/),
  expense_type: z.string().trim().min(2).max(100),
  amount: z.coerce.number().nonnegative(),
  expense_date: date,
  remarks: optionalText
});

