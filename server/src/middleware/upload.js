import fs from 'fs';
import path from 'path';
import multer from 'multer';

const allowed = new Set(['application/pdf', 'image/jpeg', 'image/png']);
const extension = { 'application/pdf': '.pdf', 'image/jpeg': '.jpg', 'image/png': '.png' };

export const uploadFor = (folder) => {
  const destination = path.resolve('uploads', folder);
  fs.mkdirSync(destination, { recursive: true });
  return multer({
    storage: multer.diskStorage({
      destination,
      filename: (req, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension[file.mimetype]}`)
    }),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => allowed.has(file.mimetype) ? cb(null, true) : cb(new Error('Only PDF, JPG, and PNG files are allowed'))
  });
};

