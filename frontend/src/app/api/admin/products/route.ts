import { requireAdmin } from '@/server/auth';
import { ensureSeeded } from '@/server/data';
import { body, fail, json, plain, refreshPages, route } from '@/server/http';
import { Product } from '@/server/models';
import { parseProduct } from '@/server/validate';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const GET = route(async (req: Request) => {
  const me = await requireAdmin(req);
  if (me instanceof Response) return me;
  await ensureSeeded();
  return json({ items: plain(await Product.find().sort({ sort: 1 }).lean()) });
});

export const POST = route(async (req: Request) => {
  const me = await requireAdmin(req);
  if (me instanceof Response) return me;
  const b = await body(req);
  const { data, errors } = parseProduct(b);
  if (Object.keys(errors).length) return fail(400, 'Validation failed', errors);
  if (await Product.exists({ slug: data.slug })) return fail(409, 'Validation failed', { slug: 'This slug is already used' });
  if (b.sort === undefined) data.sort = ((await Product.findOne().sort({ sort: -1 }).lean())?.sort || 0) + 1;
  const item = await Product.create(data);
  refreshPages();
  return json({ item }, 201);
});
