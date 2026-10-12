import { readContent } from '@/server/data';
import { json, route } from '@/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/content -> { data }: the admin-edited site content (may be empty)
export const GET = route(async () => json(await readContent()));
