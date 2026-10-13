import { requireAdmin } from '@/server/auth';
import { body, fail, json, plain, refreshPages, route } from '@/server/http';
import { Product } from '@/server/models';
import { parseProduct } from '@/server/validate';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ slug: string }> };

export const GET = route(async (req: Request, ctx: Ctx) => {
  const params = await ctx.params;
  const me = await requireAdmin(req);
  if (me instanceof Response) return me;
  const item = await Product.findOne({ slug: params.slug }).lean();
  return item ? json({ item: plain(item) }) : fail(404, 'Product not found');
});

export const PUT = route(async (req: Request, ctx: Ctx) => {
  const params = await ctx.params;
  const me = await requireAdmin(req);
  if (me instanceof Response) return me;
  const { data, errors } = parseProduct(await body(req), { partial: true });
  if (Object.keys(errors).length) return fail(400, 'Validation failed', errors);
  if (data.slug && data.slug !== params.slug && (await Product.exists({ slug: data.slug }))) {
    return fail(409, 'Validation failed', { slug: 'This slug is already used' });
  }
  const item = await Product.findOneAndUpdate({ slug: params.slug }, data, { new: true, runValidators: true });
  if (!item) return fail(404, 'Product not found');
  refreshPages();
  return json({ item });
});

// DELETE /api/admin/products/:slug                 -> hides it from the website (can be restored)
// DELETE /api/admin/products/:slug?permanent=true  -> removes it from the database
export const DELETE = route(async (req: Request, ctx: Ctx) => {
  const params = await ctx.params;
  const me = await requireAdmin(req);
  if (me instanceof Response) return me;
  const permanent = new URL(req.url).searchParams.get('permanent') === 'true';
  const item = permanent
    ? await Product.findOneAndDelete({ slug: params.slug })
    : await Product.findOneAndUpdate({ slug: params.slug }, { active: false }, { new: true });
  if (!item) return fail(404, 'Product not found');
  refreshPages();
  return json({ ok: true, permanent });
});
