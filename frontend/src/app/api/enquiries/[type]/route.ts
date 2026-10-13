import { connectDB } from '@/server/db';
import { emailConfigured, sendEnquiryEmail } from '@/server/email';
import { dbConfigured } from '@/server/env';
import { body, clientIp, fail, json, rateLimiter, route } from '@/server/http';
import { ENQUIRY_TYPES, Enquiry, type EnquiryKind } from '@/server/models';
import { parseEnquiry } from '@/server/validate';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Max 8 enquiries per visitor per 15 minutes, to keep spam out of the inbox.
const allow = rateLimiter(8, 15 * 60 * 1000);

/**
 * POST /api/enquiries/franchise | dealer | contact | order
 * Saves the enquiry (shown in the admin panel) and emails it to the company.
 */
export const POST = route(
  async (req: Request, ctx: { params: Promise<{ type: string }> }) => {
    const type = (await ctx.params).type as EnquiryKind;
    if (!ENQUIRY_TYPES.includes(type)) return fail(404, 'Not found');
    if (!dbConfigured() && !emailConfigured()) return fail(503, 'Enquiries are not set up on the server');
    if (!allow(clientIp(req))) return fail(429, 'Too many requests. Please call or WhatsApp us.');
    const b = await body(req);
    // Honeypot: bots fill the hidden "website" field, people don't.
    if (b.website) return json({ ok: true }, 201);
    const { data, errors } = parseEnquiry(type, b);
    if (Object.keys(errors).length) return fail(400, 'Validation failed', errors);

    let id: string | undefined;
    if (dbConfigured()) {
      await connectDB();
      id = String((await Enquiry.create(data))._id);
    }
    const emailed = await sendEnquiryEmail(type, data);
    // Without a database the email is the only copy, so it has to arrive.
    if (!id && !emailed) return fail(503, 'Could not send the enquiry');
    return json({ ok: true, id }, 201);
  },
  { needsDb: false },
);
