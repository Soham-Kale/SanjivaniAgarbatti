/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
