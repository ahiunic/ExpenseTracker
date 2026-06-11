-- Construction Expense & GST Tracker
-- Import this file into the "construction_tracker" database using pgAdmin Query Tool.

BEGIN;

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'accounts', 'supervisor')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS supplier_payments (
  id SERIAL PRIMARY KEY,
  supplier_name VARCHAR(180) NOT NULL,
  mobile VARCHAR(20) NOT NULL,
  invoice_no VARCHAR(100) NOT NULL,
  gstin VARCHAR(20),
  amount NUMERIC(14,2) NOT NULL CHECK (amount >= 0),
  invoice_date DATE NOT NULL,
  payment_date DATE,
  gst_bill_pdf VARCHAR(500),
  utr_no VARCHAR(100),
  status VARCHAR(30) NOT NULL DEFAULT 'GST Pending',
  remarks TEXT,
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS site_expenses (
  id SERIAL PRIMARY KEY,
  site_name VARCHAR(180) NOT NULL,
  supervisor_name VARCHAR(120) NOT NULL,
  mobile VARCHAR(20) NOT NULL,
  expense_type VARCHAR(100) NOT NULL,
  amount NUMERIC(14,2) NOT NULL CHECK (amount >= 0),
  expense_date DATE NOT NULL,
  bill_pdf VARCHAR(500),
  status VARCHAR(30) NOT NULL DEFAULT 'Pending',
  remarks TEXT,
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_supplier_status ON supplier_payments(status);
CREATE INDEX IF NOT EXISTS idx_supplier_invoice_date ON supplier_payments(invoice_date);
CREATE INDEX IF NOT EXISTS idx_expense_status ON site_expenses(status);
CREATE INDEX IF NOT EXISTS idx_expense_created_by ON site_expenses(created_by);
CREATE INDEX IF NOT EXISTS idx_expense_date ON site_expenses(expense_date);

INSERT INTO users (name, email, password, role)
VALUES (
  'Choudhary Admin',
  'admin@choudharyconstruction.com',
  '$2b$12$KmPIM7RphKUoMmRIk70o7uKYYdQv7JE.IZhqiDL2rSGMNUjBtlAfq',
  'admin'
)
ON CONFLICT (email) DO NOTHING;

COMMIT;

