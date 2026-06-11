import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: [path.resolve('.env'), path.resolve('../.env')] });

export const config = {
  port: Number(process.env.PORT || 5000),
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/construction_tracker',
  jwtSecret: process.env.JWT_SECRET || 'change-this-secret-before-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '12h',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  adminName: process.env.ADMIN_NAME || 'System Admin',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@choudharyconstruction.com',
  adminPassword: process.env.ADMIN_PASSWORD || 'ChangeMe123!'
};
