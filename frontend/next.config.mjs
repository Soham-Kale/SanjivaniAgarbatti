/** @type {import('next').NextConfig} */

// Product photos uploaded in the admin panel are served by the API (/uploads/...).
// Same rule as src/lib/api-url.ts: localhost:5000 while developing if the variable is not set.
const apiUrl = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : '');
const api = apiUrl ? new URL(apiUrl.trim()) : null;

const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: api
      ? [{ protocol: api.protocol.replace(':', ''), hostname: api.hostname, port: api.port, pathname: '/uploads/**' }]
      : [],
  },
};
export default nextConfig;
