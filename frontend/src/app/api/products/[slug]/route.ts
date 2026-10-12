import { findProduct } from '@/server/data';
import { cached, fail, route } from '@/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/products/:slug
export const GET = route(async (_req: Request, { params }: { params: { slug: string } }) => {
  const item = await findProduct(params.slug);
  return item ? cached({ item }) : fail(404, 'Product not found');
});
