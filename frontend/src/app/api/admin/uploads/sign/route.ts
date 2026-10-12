import { requireAdmin } from '@/server/auth';
import { cloudinaryConfigured, signUpload } from '@/server/cloudinary';
import { fail, json, route } from '@/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/uploads/sign -> the signed fields the admin panel needs to upload a photo
 * straight to Cloudinary.
 */
export const POST = route(async (req: Request) => {
  const me = await requireAdmin(req);
  if (me instanceof Response) return me;
  if (!cloudinaryConfigured()) return fail(503, 'Photo uploads are not set up: add CLOUDINARY_URL to the server settings');
  return json(signUpload());
});
