import { listProducts } from '@/server/data';
import { json, route } from '@/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/products?category=dhoop&fragrance=chandan&featured=true
export const GET = route(async (req: Request) => {
  const p = new URL(req.url).searchParams;
  const items = await listProducts({ category: p.get('category') || '', fragrance: p.get('fragrance') || '', featured: p.get('featured') === 'true' });
  return json({ items, count: items.length });
});
