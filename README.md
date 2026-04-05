# Sabbatarian Church of Elohim — Website & Admin Portal

A full-stack church management system with a public website and a complete admin dashboard, built on the MERN stack.

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
| Database | MongoDB (Mongoose 9) |
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
    ├── src/
    │   ├── controllers/     # Business logic (17 controllers)
    │   ├── models/          # Mongoose schemas (15 models)
    │   ├── routes/          # API route definitions
    │   ├── middleware/       # Auth, file upload middleware
    │   └── utils/           # JWT, email, M-Pesa helpers
    ├── uploads/             # Uploaded files (local storage)
    ├── seed.js              # Seed initial admin user
    └── index.js             # Server entry point
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
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
cp .env.example .env
# Edit .env with your values
npm install
```

### 3. Set up the client

```bash
cd ../client
npm install
```

### 4. Seed the admin user

```bash
cd server
node seed.js
```

This creates the admin account using `ADMIN_EMAIL` and `ADMIN_PASSWORD` from your `.env`.

### 5. Run in development

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
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random secret for signing JWTs |
| `JWT_EXPIRE` | Token expiry duration (e.g. `30d`) |
| `CLIENT_URL` | Frontend origin for CORS (e.g. `http://localhost:5173`) |
| `EMAIL_USER` | Gmail address for sending emails |
| `EMAIL_PASS` | Gmail App Password |
| `ADMIN_EMAIL` | Initial admin email (used by seed.js) |
| `ADMIN_PASSWORD` | Initial admin password (used by seed.js) |
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

After running `seed.js`, log in at `/login` with the credentials set in your `.env` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`). Change the password immediately after first login.

---

## License

ISC
