/**
 * The API now lives inside this Next.js app (src/app/api), so requests go to the same site and
 * this stays empty. NEXT_PUBLIC_API_URL is only needed if the API is ever hosted somewhere else.
 * Accepts "https://example.com", with or without a trailing "/" or "/api".
 */
export const API_URL = (process.env.NEXT_PUBLIC_API_URL || '').trim().replace(/\/+$/, '').replace(/\/api$/, '');
