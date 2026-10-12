/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  async headers() {
    return [
      // Fonts never change under the same name: cache them for a year.
      { source: '/fonts/:file*', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
      // Photos may be replaced under the same name, so browsers re-check them after a week.
      { source: '/textures/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' }] },
      { source: '/images/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' }] },
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ];
  },
  experimental: {
    // Keep the MongoDB driver out of the bundle; it is loaded from node_modules on the server.
    serverComponentsExternalPackages: ['mongoose'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    // Product photos uploaded in the admin panel are stored on Cloudinary.
    remotePatterns: [{ protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' }],
  },
};
export default nextConfig;
