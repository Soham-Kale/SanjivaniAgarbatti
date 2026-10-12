import { cloudinaryConfigured } from '@/server/cloudinary';
import { emailConfigured } from '@/server/email';
import { dbConfigured, env } from '@/server/env';
import { connectDB } from '@/server/db';
import { json } from '@/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** GET /api/health: which services are set up. Shows no secrets. */
export async function GET() {
  let db: 'not-configured' | 'ok' | 'error' = 'not-configured';
  if (dbConfigured()) db = await connectDB().then(() => 'ok' as const, () => 'error' as const);
  return json({ ok: db === 'ok', db, auth: Boolean(env.jwtSecret), uploads: cloudinaryConfigured(), email: emailConfigured() });
}
