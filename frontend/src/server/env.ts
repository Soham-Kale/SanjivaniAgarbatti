/**
 * Server-only settings, read from environment variables (.env.local while developing, the
 * project's Environment Variables on Vercel). Nothing here is sent to the browser.
 */
function cloudinary() {
  // Either CLOUDINARY_URL=cloudinary://<key>:<secret>@<cloud> or the three separate variables.
  const url = process.env.CLOUDINARY_URL || '';
  const m = url.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
  return {
    cloudName: m?.[3] || process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: m?.[1] || process.env.CLOUDINARY_API_KEY || '',
    apiSecret: m?.[2] || process.env.CLOUDINARY_API_SECRET || '',
    folder: process.env.CLOUDINARY_FOLDER || 'sanjivani',
  };
}

export const env = {
  mongoUri: process.env.MONGODB_URI || '',
  jwtSecret: process.env.JWT_SECRET || '',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '12h',
  // Optional first admin, created at the first sign-in if no admin account exists yet.
  adminEmail: (process.env.ADMIN_EMAIL || '').trim().toLowerCase(),
  adminPassword: process.env.ADMIN_PASSWORD || '',
  // Optional shared key for scripts (header x-admin-key).
  adminKey: process.env.ADMIN_KEY || '',
  cloudinary: cloudinary(),
  resend: {
    apiKey: process.env.RESEND_API_KEY || '',
    to: (process.env.ENQUIRY_EMAIL_TO || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    from: process.env.ENQUIRY_EMAIL_FROM || 'Sanjivani Website <onboarding@resend.dev>',
  },
};

export const dbConfigured = () => Boolean(env.mongoUri);
