import path from 'path';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config.js';
import { authenticate } from './middleware/auth.js';
import { errorHandler, notFound } from './middleware/errors.js';
import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';
import expenseRoutes from './routes/expenses.js';
import supplierRoutes from './routes/suppliers.js';
import userRoutes from './routes/users.js';

const app = express();
app.set('trust proxy', 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: config.clientUrl.split(',').map(v => v.trim()) }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.resolve('uploads')));
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 }), authRoutes);
app.use('/api/dashboard', authenticate, dashboardRoutes);
app.use('/api/suppliers', authenticate, supplierRoutes);
app.use('/api/expenses', authenticate, expenseRoutes);
app.use('/api/users', authenticate, userRoutes);
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve('public')));
  app.get(/^(?!\/api|\/uploads).*/, (req, res) => res.sendFile(path.resolve('public', 'index.html')));
}
app.use(notFound);
app.use(errorHandler);

app.listen(config.port, () => console.log(`API listening on port ${config.port}`));
