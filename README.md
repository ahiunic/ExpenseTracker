# Construction Expense & GST Tracker

Production-ready expense operations system for Choudhary Construction. It provides role-based supplier payment tracking, GST bill verification, site expense approvals, document uploads, reports, and prefilled WhatsApp reminders.

## Features

- JWT authentication with bcrypt password hashing
- Admin, Accounts, and Supervisor permissions
- Supplier payment and GST bill workflow
- Site expense approval and rejection workflow
- PDF/JPG/PNG uploads with 10 MB limits and MIME validation
- Dashboard totals, search, status filters, and pagination
- Responsive React and TailwindCSS interface
- PostgreSQL persistence, Docker, Nginx, and PM2 deployment assets

## Role Access

| Capability | Admin | Accounts | Supervisor |
|---|---:|---:|---:|
| Dashboard | Yes | Yes | Own expenses |
| Manage users | Yes | No | No |
| Create/edit supplier payments | Yes | Yes | No |
| Delete supplier payments | Yes | No | No |
| Create/edit site expenses | Yes | No | Own only |
| Approve/reject expenses | Yes | Yes | No |
| Delete site expenses | Yes | No | No |

## Local Setup

Prerequisites: Node.js 22+, npm, and PostgreSQL 16+.

1. Create a PostgreSQL database:

   ```sql
   CREATE DATABASE construction_tracker;
   ```

2. Copy `.env.example` to `.env`, then use a local `DATABASE_URL`, for example:

   ```env
   NODE_ENV=development
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/construction_tracker
   CLIENT_URL=http://localhost:5173
   JWT_SECRET=a-long-random-development-secret
   ```

3. Install dependencies and initialize the database:

   ```bash
   npm install
   npm run install:all
   npm run db:init --prefix server
   npm run dev
   ```

4. Open `http://localhost:5173` and sign in using `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `.env`.

## API

All routes except login and health require `Authorization: Bearer <token>`.

| Method | Route | Access |
|---|---|---|
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/register` | Admin |
| GET | `/api/dashboard` | Authenticated |
| GET/POST/PUT/DELETE | `/api/suppliers` | Role controlled |
| GET/POST/PUT/DELETE | `/api/expenses` | Role controlled |
| PATCH | `/api/expenses/:id/status` | Admin, Accounts |
| GET/PUT/DELETE | `/api/users` | Admin |

Supplier and expense create/update routes accept `multipart/form-data`. Uploads are stored under `server/uploads` locally and `/app/uploads` in Docker.

## AWS EC2 Deployment With Docker

1. Launch an Ubuntu 24.04 EC2 instance, attach an Elastic IP, and allow inbound ports `22`, `80`, and `443` in its security group.

2. Install Docker:

   ```bash
   sudo apt update
   sudo apt install -y docker.io docker-compose-v2 git
   sudo usermod -aG docker $USER
   newgrp docker
   ```

3. Clone the repository, configure secrets, build, and initialize:

   ```bash
   git clone <your-repository-url> construction-tracker
   cd construction-tracker
   cp .env.example .env
   nano .env
   docker compose build
   docker compose up -d db
   docker compose run --rm app node src/scripts/initDb.js
   docker compose up -d
   ```

4. Point the domain's A record to the Elastic IP. For HTTPS, install Certbot on the host and replace or extend `nginx/default.conf` with the generated certificate configuration.

5. Operate and update:

   ```bash
   docker compose logs -f app
   docker compose pull
   docker compose build --no-cache app
   docker compose up -d
   ```

Back up both the PostgreSQL database and Docker `uploads_data` volume. Local upload storage is suitable initially; migrate the upload adapter to S3 before running multiple app hosts.

## Non-Docker PM2 Deployment

Build the client, copy `client/dist` to `server/public`, install production server dependencies, configure `.env`, initialize the database, then run:

```bash
npm install -g pm2
pm2 start ecosystem.config.cjs --env production
pm2 save
pm2 startup
```

Use the supplied Nginx proxy configuration and change `proxy_pass` from `http://app:5000` to `http://127.0.0.1:5000`.

