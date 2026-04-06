# Sabbatarian Church of Elohim — Frontend

React 18 + Vite frontend for the Sabbatarian Church of Elohim church management system.

## Stack

- **React 18** with React Router DOM 7
- **Vite** build tool
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Recharts** for admin analytics
- **Lucide React** for icons
- **Axios** for API calls

## Running locally

```bash
npm install
npm run dev
```

Runs on `http://localhost:5173`. The Vite dev server proxies `/api` requests to `http://localhost:5000`.

## Building for production

```bash
npm run build
```

Output goes to `dist/`. Serve this with any static file host or the Express server.
