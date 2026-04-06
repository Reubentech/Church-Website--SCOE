# Sabbatarian Church of Elohim — Website & Admin Portal

A full-stack church management system with a public website and a complete admin dashboard. Originally built on the MERN stack, now running on **PostgreSQL (Neon) + Prisma**.

---

## Features

### Public Website
- **Home** — Hero section, Sabbath countdown, announcements, live stream section
- **Sermons** — Sermon library with free and premium (M-Pesa paywall) content
- **Events** — Upcoming and past church events
- **Gallery** — Photo gallery with lightbox viewer
- **Blog** — News, testimonies, devotionals and teachings with search and category filters
- **Bible Study** — Study materials and resources
- **Prayer Requests** — Submit and manage prayer requests
- **Bulletin** — Weekly bulletins
- **Contact** — Contact form with email delivery
- **Newsletter** — Email subscription

### Admin Dashboard
- Manage Events, Sermons, Gallery, Blog Posts, Bulletins
- Manage Prayer Requests, Bible Study content, Announcements, Newsletter
- Manage Users (roles: admin / member)
- Site Settings configuration
- Activity Logs
- Analytics dashboard
- M-Pesa payment tracking

### Integrations
- **M-Pesa (Safaricom STK Push)** — Premium sermon access payments
- **Nodemailer (Gmail SMTP)** — Contact form and newsletter emails
- **JWT Authentication** — Secure admin access

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS, Framer Motion |
| Routing | React Router DOM 7 |
| Charts | Recharts |
| Backend | Node.js, Express 5 |
| Database | **PostgreSQL — Neon** (migrated from MongoDB) |
| ORM | **Prisma** (replaced Mongoose) |
| Auth | JSON Web Tokens (JWT) |
| File Uploads | Multer |
| Email | Nodemailer |
| Payments | M-Pesa Daraja API |
| Security | express-rate-limit, bcryptjs |

---

## Project Structure

```
sabbatarian-church/
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Public and admin pages
│   │   ├── context/         # Auth context
│   │   ├── hooks/           # Custom hooks
│   │   └── utils/           # API client, utilities
│   └── vite.config.js
│
└── server/                  # Express backend
    ├── prisma/
    │   └── schema.prisma    # Prisma database schema (PostgreSQL)
    ├── src/
    │   ├── controllers/     # Business logic (18 controllers)
    │   ├── models/          # Legacy model references
    │   ├── routes/          # API route definitions
    │   ├── middleware/       # Auth, file upload middleware
    │   ├── lib/             # Prisma client instance
    │   └── utils/           # Email, M-Pesa, scheduler helpers
    ├── uploads/             # Uploaded files (local storage)
    ├── seedpostgres.js      # Seed admin users into PostgreSQL
    └── index.js             # Server entry point
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- A PostgreSQL database — [Neon](https://neon.tech) (free tier works)
- A Gmail account with an App Password for email
- Safaricom Daraja API credentials (for M-Pesa)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/sabbatarian-church.git
cd sabbatarian-church
```

### 2. Set up the server

```bash
cd server
cp .env.example .env   # then edit .env with your values
npm install
```

### 3. Set up the client

```bash
cd ../client
npm install
```

### 4. Push the database schema

```bash
cd server
npx prisma db push
```

### 5. Seed admin users

```bash
node seedpostgres.js
```

This creates three accounts in the database:

| Email | Password | Role |
|-------|----------|------|
| admin@church.org | Admin@1234 | admin |
| reuben@church.org | Reuben@1234 | admin |
| member@church.org | Member@1234 | user |

> Change these passwords immediately after first login.

### 6. Run in development

In two separate terminals:

```bash
# Terminal 1 — backend
cd server && npm run dev

# Terminal 2 — frontend
cd client && npm run dev
```

The client runs at `http://localhost:5173`, the API at `http://localhost:5000`.

---

## Environment Variables

Copy `server/.env.example` to `server/.env` and fill in your values:

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `DATABASE_URL` | **PostgreSQL connection string (Neon)** — e.g. `postgresql://user:pass@host/db?sslmode=require` |
| `JWT_SECRET` | Long random secret for signing JWTs |
| `JWT_EXPIRE` | Token expiry duration (e.g. `30d`) |
| `NODE_ENV` | `development` or `production` |
| `CLIENT_URL` | Frontend origin for CORS (e.g. `http://localhost:5173`) |
| `EMAIL_HOST` | SMTP host (e.g. `smtp.gmail.com`) |
| `EMAIL_PORT` | SMTP port (e.g. `587`) |
| `EMAIL_USER` | Gmail address for sending emails |
| `EMAIL_PASS` | Gmail App Password |
| `MPESA_CONSUMER_KEY` | Safaricom Daraja consumer key |
| `MPESA_CONSUMER_SECRET` | Safaricom Daraja consumer secret |
| `MPESA_SHORTCODE` | M-Pesa shortcode |
| `MPESA_PASSKEY` | M-Pesa passkey |
| `MPESA_CALLBACK_URL` | Public URL for M-Pesa payment callbacks |
| `MPESA_ENV` | `sandbox` or `production` |

For the frontend, create `client/.env` if you need to override defaults:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## API Overview

| Prefix | Resource |
|--------|----------|
| `/api/auth` | Login, register, get current user |
| `/api/blog` | Blog posts (slug-based, with search & categories) |
| `/api/sermons` | Sermon library |
| `/api/events` | Church events |
| `/api/gallery` | Photo gallery |
| `/api/bulletins` | Weekly bulletins |
| `/api/announcements` | Announcements |
| `/api/bible-studies` | Bible study materials |
| `/api/prayer-requests` | Prayer request submissions |
| `/api/contact` | Contact form |
| `/api/newsletter` | Newsletter subscriptions |
| `/api/mpesa` | M-Pesa STK push and payment status |
| `/api/users` | User management (admin only) |
| `/api/settings` | Site settings (admin only) |
| `/api/logs` | Activity logs (admin only) |
| `/api/analytics` | Analytics data (admin only) |
| `/api/health` | Health check |

---

## Security Notes

- Rate limiting is applied on all auth (`20 req / 15 min`) and M-Pesa (`200 req / min`) endpoints
- CORS is restricted to the `CLIENT_URL` origin — set this correctly in production
- Passwords are hashed with bcryptjs
- JWT tokens expire after 30 days by default
- **Never commit `.env` to version control** — use `.env.example` as a template

---

## Default Admin Login

After running `seedpostgres.js`, log in at `/login` with:

- **Email:** `admin@church.org`
- **Password:** `Admin@1234`

Change the password immediately after first login.

---

## Database Migration Notes

The app was originally built on **MongoDB + Mongoose**. It has been fully migrated to **PostgreSQL + Prisma**:

- All Mongoose models replaced by the Prisma schema at `server/prisma/schema.prisma`
- MongoDB `_id` (ObjectId) replaced with Prisma `id` (CUID) across all frontend and backend code
- `seedpostgres.js` replaces the old MongoDB `createuser.js` seeder
- RSVP system added with full admin management page

---

## License

ISC
