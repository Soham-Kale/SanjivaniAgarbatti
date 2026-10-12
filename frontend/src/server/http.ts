import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { dbConfigured } from './env';
import { connectDB } from './db';

export const json = (data: unknown, status = 200) => NextResponse.json(data, { status });
/** Public data the CDN may serve for a minute (and a few minutes stale while it refreshes). */
export const cached = (data: unknown) => {
  const res = json(data);
  res.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
  return res;
};
export const fail = (status: number, error: string, fields?: Record<string, string>) => json(fields ? { error, fields } : { error }, status);

/** Mongoose documents to plain JSON (ObjectIds and dates become strings). */
export const plain = <T>(v: unknown): T => JSON.parse(JSON.stringify(v));

export async function body(req: Request): Promise<Record<string, unknown>> {
  try {
    const b = await req.json();
    return b && typeof b === 'object' && !Array.isArray(b) ? b : {};
  } catch {
    return {};
  }
}

/**
 * Wraps a route handler: connects to MongoDB first and turns unexpected errors into a 500
 * (logged on the server, never shown to visitors).
 */
export function route<A extends unknown[]>(fn: (...args: A) => Promise<Response>, { needsDb = true } = {}) {
  return async (...args: A): Promise<Response> => {
    try {
      if (needsDb) {
        if (!dbConfigured()) return fail(503, 'MONGODB_URI is not set on the server');
        await connectDB();
      }
      return await fn(...args);
    } catch (e) {
      console.error(e);
      const err = e as { name?: string; code?: number };
      if (err.name === 'ValidationError' || err.name === 'CastError') return fail(400, 'Invalid data');
      if (err.code === 11000) return fail(409, 'Already exists');
      return fail(500, 'Server error');
    }
  };
}

export function clientIp(req: Request) {
  return (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || req.headers.get('x-real-ip') || 'local';
}

/**
 * Small fixed-window rate limiter kept in memory. On Vercel each server instance keeps its own
 * count, which is enough to slow down form spam and password guessing.
 */
export function rateLimiter(limit: number, windowMs: number) {
  const hits = new Map<string, { n: number; reset: number }>();
  return (key: string) => {
    const now = Date.now();
    const h = hits.get(key);
    if (!h || h.reset < now) {
      hits.set(key, { n: 1, reset: now + windowMs });
      if (hits.size > 5000) for (const [k, v] of hits) if (v.reset < now) hits.delete(k);
      return true;
    }
    h.n += 1;
    return h.n <= limit;
  };
}

/** Marks every cached page stale so the next visit shows the admin's changes. */
export function refreshPages() {
  revalidateTag('products');
  revalidateTag('content');
  revalidatePath('/', 'layout');
}
