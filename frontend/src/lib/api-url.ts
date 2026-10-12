/**
 * Base URL of the Express API, from NEXT_PUBLIC_API_URL in frontend/.env.local.
 * Accepts "http://localhost:5000", "http://localhost:5000/" or "http://localhost:5000/api"
 * (the /api part is added by each request). While developing (`npm run dev`) it falls back to
 * http://localhost:5000, the backend's default port, so the admin panel works without the file.
 * A production build without it runs in offline mode with the bundled product list.
 */
export const API_URL = (process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : ''))
  .trim()
  .replace(/\/+$/, '')
  .replace(/\/api$/, '');
