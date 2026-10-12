import { getContent, getProducts } from '@/lib/api';
import { CATEGORIES } from '@/lib/site';
import { SITE_URL, roleTitle } from '@/lib/seo';

export const revalidate = 3600;

/**
 * /llms.txt: a plain summary of the business for AI assistants (the llmstxt.org convention),
 * built from the same content and product list as the website.
 */
export async function GET() {
  const [{ site }, products] = await Promise.all([getContent(), getProducts()]);
  const label = (id: string) => CATEGORIES.find((c) => c.id === id)?.label.en || id;
  const byCat = new Map<string, typeof products>();
  for (const p of products) byCat.set(p.category, [...(byCat.get(p.category) || []), p]);

  const text = `# ${site.name.en} (${site.name.mr})

> Sanjivani Agarbatti (संजीवनी अगरबत्ती, "sanjivaniagarbatti") is an incense and puja products business in Malewadi-Akluj, Solapur district, Maharashtra, India. It makes agarbatti (incense sticks), dhoop sticks, cup dhoop and puja sahitya, and sells wholesale, retail and through franchise across Maharashtra.

## Key facts

- Name: ${site.name.en} · ${site.name.mr} · also known as Sanjivani Agarbatti, Sanjivani Dhoop
- Founders: ${site.phones.map((p) => `${p.person.en.replace(/^Mr\.?\s*/i, '')} (${roleTitle(p.role)})`).join(' and ')}
- Address: ${site.address.en}, Maharashtra, India
- Phone / WhatsApp: ${site.phones.map((p) => p.display).join(', ')}
- Email: ${site.email}
- Website: ${SITE_URL}
- Motto: ${site.motto}
- Languages: Marathi (main) and English
- Sales: wholesale, retail, dealers and franchise (Mini, Sanjivani Franchise and Warehouse plans) across Maharashtra. Franchise terms make no profit guarantee.

## Pages

- [Home](${SITE_URL}/): products, fragrances, our story and franchise overview
- [Products](${SITE_URL}/products): the complete product range
- [Franchise](${SITE_URL}/franchise): plans, deposits, process and FAQ
- [About and founders](${SITE_URL}/about): founders, mission and objectives
- [Contact](${SITE_URL}/contact): phone, WhatsApp, address and dealer enquiry

## Products
${[...byCat.entries()]
  .map(([cat, list]) => `\n### ${label(cat)}\n\n${list.map((p) => `- [${p.name.en} (${p.name.mr})](${SITE_URL}/products/${p.slug})${p.price != null ? `: ₹${p.price}` : ''}`).join('\n')}`)
  .join('\n')}
`;
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
