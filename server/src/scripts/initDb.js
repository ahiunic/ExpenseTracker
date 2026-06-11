import fs from 'fs/promises';
import bcrypt from 'bcryptjs';
import { config } from '../config.js';
import { pool, query } from '../db.js';

const schema = await fs.readFile(new URL('../schema.sql', import.meta.url), 'utf8');
await query(schema);
const password = await bcrypt.hash(config.adminPassword, 12);
await query(
  `INSERT INTO users (name,email,password,role) VALUES ($1,LOWER($2),$3,'admin')
   ON CONFLICT (email) DO NOTHING`,
  [config.adminName, config.adminEmail, password]
);
console.log(`Database initialized. Admin: ${config.adminEmail}`);
await pool.end();

