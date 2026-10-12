import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

// Search engines and AI assistants (ChatGPT, Claude, Perplexity, Gemini, Copilot) may read every
// public page. Only the admin panel and the API are kept out.
const AI_BOTS = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Google-Extended', 'Applebot-Extended', 'Bingbot'];

export default function robots(): MetadataRoute.Robots {
  const disallow = ['/admin', '/api/'];
  return {
    rules: [{ userAgent: '*', allow: '/', disallow }, ...AI_BOTS.map((userAgent) => ({ userAgent, allow: '/', disallow }))],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
