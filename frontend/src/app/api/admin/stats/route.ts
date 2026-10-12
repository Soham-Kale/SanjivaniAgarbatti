import { requireAdmin } from '@/server/auth';
import { ensureSeeded } from '@/server/data';
import { json, plain, route } from '@/server/http';
import { Enquiry, Product } from '@/server/models';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const GET = route(async (req: Request) => {
  const me = await requireAdmin(req);
  if (me instanceof Response) return me;
  await ensureSeeded();
  const [products, hidden, priced, newEnquiries, byType, recent] = await Promise.all([
    Product.countDocuments({ active: true }),
    Product.countDocuments({ active: false }),
    Product.countDocuments({ active: true, price: { $ne: null } }),
    Enquiry.countDocuments({ status: 'new' }),
    Enquiry.aggregate<{ _id: string; count: number }>([{ $group: { _id: '$type', count: { $sum: 1 } } }]),
    Enquiry.find().sort({ createdAt: -1 }).limit(6).lean(),
  ]);
  return json({ products, hidden, priced, newEnquiries, byType: Object.fromEntries(byType.map((b) => [b._id, b.count])), recent: plain(recent) });
});
