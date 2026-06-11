import multer from 'multer';
import { ZodError } from 'zod';

export function notFound(req, res) {
  res.status(404).json({ message: 'Route not found' });
}

export function errorHandler(err, req, res, next) {
  console.error(err);
  if (err instanceof ZodError) {
    return res.status(400).json({ message: 'Invalid input', errors: err.flatten().fieldErrors });
  }
  if (err instanceof multer.MulterError) return res.status(400).json({ message: err.message });
  if (err.code === '23505') return res.status(409).json({ message: 'A record with this value already exists' });
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
}

