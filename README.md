# संजीवनी धूप आणि अगरबत्ती · Sanjivani Agarbatti website

Full-stack website for Sanjivani Incense Sticks & Agarbatti, Malewadi-Akluj, built on the
**"Divya" dark premium design**: a live 3D incense scene in the hero, dark bands with gold
hairlines, a fragrance explorer that recolours the smoke, franchise plans and enquiry forms.

Content is Marathi-first, with an English toggle in the header (remembered per browser).

## Design and 3D (premium upgrade)

- **Palette "sandhya aarti"** (tokens in `frontend/tailwind.config.ts`; the old token names are
  kept so every page and the admin panel follow): royal plum night `wood` `#2B1745` / `#120A21`
  for dark bands, headings and buttons; saffron `#FF7A1A` and temple gold `#F2B33D` for glow and
  buttons; kumkum `maroon` `#C2185B` and lotus `#F59BC0` for highlights; warm cream `ivory`
  `#FFF8EF` for reading sections. Highlighted words use a saffron-gold-lotus gradient.
- **Motion** (Framer Motion): plum curtain page transition, word-by-word heading reveals, scroll
  progress bar, cursor ring (mouse only), fragrance ribbons that react to scroll speed, a pinned
  horizontal category slider whose cards lean in 3D with scroll speed, parallax photos, a story
  thread that fills as you read, 3D tilt with light glare on cards, rotating glow borders, and
  counters. Everything respects `prefers-reduced-motion`.
- **Product text**: every product has a `uses` field ("what it is for", shown on cards and the
  detail page) and the detail page shows plain "how to use" steps from `frontend/src/lib/usage.ts`.
  The About page gallery gives every photo a caption saying what it shows.
- **Typography**: *Poppins* everywhere (headings and body). Poppins includes Devanagari, so Marathi
  and English share one typeface. Self-hosted from `frontend/public/fonts` (no request to Google).
  Body line-height 1.75 and heading padding keep vowel signs from clipping.
- **Real 3D** with Three.js + `@react-three/fiber` + `@react-three/drei` + `maath`:
  - Hero: the Kasturi premium jar and Kewda-Bel dhoop box as 3D models inside a turning gold aarti
    halo (rings, beads and a saffron aura), a brass holder with lit agarbatti, shader smoke, embers,
    gold dust and contact shadows. Drag to rotate (mouse or touch); the camera follows the pointer
    and pulls back as you scroll. Choosing a fragrance lower on the page recolours the smoke.
  - Scroll showcase: a sticky section that turns five real packs on an arc inside a gold halo.
  - Closing section: three clay diyas with flickering shader flames and rising embers.
  - Product pages: a "3D मध्ये पाहा" toggle opens a drag-to-rotate viewer for the 19 products that
    have a model (5 premium jars, 6 dhoop boxes, 5 pouches).
  - The models are simple procedural shapes (jar, carton, pillow pouch) wrapped with **straight
    crops of the client's own product photos** (`frontend/public/textures/`). No packaging was
    redrawn or invented. Packets and puja items show photos only.
  - Performance: 3D code is lazy-loaded (not in the first-load bundle), canvases stop rendering
    when off screen, pixel ratio is capped and lowered on slow devices, and `prefers-reduced-motion`
    renders a single still frame. If WebGL is unavailable the hero keeps a photo poster.
- **Order list** (header bag icon): visitors add products with quantities, then send the list.
  Prices are not published yet, so the order is saved to MongoDB (`POST /api/enquiries/order`) and
  opened in WhatsApp for the shop to confirm price and delivery. The list persists in the browser.
- **Content rules kept**: no reviews or ratings are shown (none exist yet), no profit promises on
  franchise pages, and brochure lines that read as health claims (sleep, stress, insects,
  purifying) were reworded to describe the fragrance only.

```
sanjivani-agarbatti/
├── frontend/   Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer Motion + Three.js,
│               with the API built in (MongoDB via Mongoose, Cloudinary, Resend)
├── backend/    old Express API, no longer used (safe to delete)
└── docker-compose.yml   optional local MongoDB
```

## How it is built

Everything is one Next.js app in `frontend/`: the website, the admin panel and the API
(`frontend/src/app/api`, server code in `frontend/src/server`). It deploys to Vercel as a
single project. The old `backend/` (Express) folder is no longer used and can be deleted.

| Service | Used for | Free plan |
| --- | --- | --- |
| MongoDB Atlas | products, prices, website content, enquiries, admin accounts | M0 cluster |
| Cloudinary | product photos uploaded in the admin panel | yes |
| Resend | emails each franchise / dealer / contact / order enquiry to the company | 100 emails a day |

The site also runs **without** them: products then come from `frontend/src/data/products.json`,
and the enquiry forms offer to send the details on WhatsApp instead. `/api/health` shows which
services are set up.

## What you need

- **Node.js 18.18 or newer** (20 LTS recommended): https://nodejs.org
- A **MongoDB** database: a free MongoDB Atlas cluster (recommended, same as on Vercel), or
  MongoDB installed locally, or Docker (`docker compose up -d` in this folder,
  then `MONGODB_URI=mongodb://127.0.0.1:27017/sanjivani`).
- Optional: a Cloudinary account (photo uploads) and a Resend account (enquiry emails).

## Setup and run (first time)

Run these commands yourself in a terminal:

```bash
cd frontend
npm install
cp .env.example .env.local    # Windows: copy .env.example .env.local
# edit .env.local: MONGODB_URI, a long random JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD,
# CLOUDINARY_URL, RESEND_API_KEY and ENQUIRY_EMAIL_TO (each line is explained in the file)
npm run dev
```

Open http://localhost:3000 (website) and http://localhost:3000/admin (admin panel). Only one
terminal is needed now.

The first time the site reads an empty database it copies in the 41 products from
`src/data/products.json`. `npm run seed` does the same by hand (it only adds missing products;
`npm run seed -- --force` overwrites them with the file and erases admin edits to those products).

Coming from the old two-folder setup: copy `MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL` and
`ADMIN_PASSWORD` from `backend/.env` into `frontend/.env.local`, and remove the
`NEXT_PUBLIC_API_URL` line there. Photos uploaded earlier are in `backend/uploads`: copy that
folder to `frontend/public/uploads` so they keep showing.

### Production build

```bash
cd frontend && npm run build && npm start      # serves on port 3000
```

## Deploy on Vercel

1. Push the project to GitHub, then in Vercel choose **Add New > Project** and import it.
2. Set **Root Directory** to `frontend`. Vercel detects Next.js; keep the default build settings.
3. Under **Environment Variables**, add every line of `frontend/.env.example` with your real
   values, and set `NEXT_PUBLIC_SITE_URL` to the site address (for example
   `https://sanjivaniagarbatti.in`). Google links and the sitemap use it. Leave
   `NEXT_PUBLIC_API_URL` out.
4. **MongoDB Atlas > Network Access**: add `0.0.0.0/0` (Vercel servers have no fixed address).
   Use a database user with a strong password; it lives only in `MONGODB_URI`.
5. **Resend**: the test sender `onboarding@resend.dev` only delivers to the email you signed up
   with. To send to any address, verify your domain in Resend (Domains) and set
   `ENQUIRY_EMAIL_FROM`, e.g. `Sanjivani Website <enquiry@sanjivaniagarbatti.in>`.
6. Deploy, then open `https://<your-site>/api/health`: it should show
   `"db":"ok","auth":true,"uploads":true,"email":true`.
7. Add your domain under **Settings > Domains**.

After changing an environment variable on Vercel, redeploy for it to take effect.

## Admin panel (`/admin`)

Open `/admin` and sign in. The panel is in Marathi and English and works on phone and desktop.
Every save refreshes the website straight away.

| Section | What the admin can do |
| --- | --- |
| Dashboard | Product, price and enquiry counts, latest enquiries, quick links |
| Products & prices | Search and filter; set price and MRP right in the list; hide/show; delete permanently; add a new product; edit every field (names, description, uses, highlights, main photo and gallery uploads, pack size, price note, stock, category, fragrance, featured, order, URL) |
| Website content | Edit any text, phone number, photo and list on the site: contact details, announcement bar, SEO, home banner, featured block, category cards, our story, why us, franchise plans/steps/note, closing block, about page, footer. "Reset to original" per section |
| Orders & enquiries | Filter by type and status, change status, add notes, delete, download CSV for Excel |
| Account | Change the admin password (signs out other devices) |

**First admin.** Set `JWT_SECRET`, `ADMIN_EMAIL` and `ADMIN_PASSWORD` (10+ characters): the
account is created at the first sign-in, if no admin exists. Then change the password in
Account and remove `ADMIN_PASSWORD`. Or create/reset an admin any time:

```bash
cd frontend
npm run create-admin -- owner@example.com "a-long-password"
```

Passwords are stored hashed (bcrypt); sign-in is limited to 10 tries per 15 minutes and gives a
12-hour token kept only in that browser tab. Photos go straight from the browser to Cloudinary
(JPG/PNG/WebP/AVIF, max 5 MB, folder `CLOUDINARY_FOLDER`).

Prices: a product with no price shows "price on enquiry"; with a price, cards and the product page
show it (MRP struck through, % off) and the cart shows totals in the WhatsApp order. Content you
have not edited keeps the built-in text, so the site still works if the database is offline.

## Pages

| URL | What it shows |
| --- | --- |
| `/` | 3D hero, stats, featured products with category tabs, fragrance explorer, why us, franchise plans + 8-step process + enquiry form, founders, gallery |
| `/products` | All products, category tabs and fragrance filter (`/products?c=dhoop` opens a tab) |
| `/products/[slug]` | Product photo(s), description, brochure benefits, WhatsApp order, related products |
| `/franchise` | 3 plans, process, support, ideal locations, who can apply, FAQ, enquiry form (`?plan=mini` preselects) |
| `/about` | Founders, mission and objectives, why us, gallery |
| `/contact` | Phones, address, WhatsApp, dealer / wholesale enquiry form |

Floating WhatsApp and call buttons are on every page. `sitemap.xml` and `robots.txt` are generated.

## API (`frontend/src/app/api`)

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/api/health` | which services are set up (database, sign-in, uploads, email) |
| GET | `/api/products` | `?category=daily\|premium\|dhoop\|cup\|puja\|masala`, `?fragrance=chandan`, `?featured=true` |
| GET | `/api/products/:slug` | one product |
| GET | `/api/content` | the edited website content |
| POST | `/api/enquiries/franchise` | `name, mobile, city, plan (mini\|franchise\|warehouse), hasShop, investment, message` |
| POST | `/api/enquiries/dealer` | `name, mobile, city, shopName, businessType, products, message` |
| POST | `/api/enquiries/contact` | `name, mobile, city?, message` |
| POST | `/api/enquiries/order` | `name, mobile, city?, message, items: [{ slug, name, qty }]` |

Enquiries are validated (10-digit Indian mobile), rate-limited (8 per visitor per 15 min, counted
per server instance) and have a honeypot field against bots. Each one is saved for the admin panel
and emailed to `ENQUIRY_EMAIL_TO`; if the email fails it is logged and the enquiry is still saved.

**Sign-in** (`/api/auth`): `POST /login {email, password}` returns a token; `GET /me`;
`POST /password {currentPassword, newPassword}`.

**Admin endpoints** need `Authorization: Bearer <token>` (or the optional `x-admin-key` header):

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/api/admin/stats` | dashboard counts |
| GET | `/api/admin/enquiries` | `?type=franchise&status=new&page=1&limit=50` |
| PATCH/DELETE | `/api/admin/enquiries/:id` | `{ "status": "contacted", "notes": "..." }` / delete |
| GET | `/api/admin/enquiries.csv` | Excel-friendly CSV export (Marathi safe) |
| GET/POST | `/api/admin/products` | list all / create |
| GET/PUT | `/api/admin/products/:slug` | one product / update (any field, incl. `price`, `mrp`, `packSize`, `inStock`) |
| DELETE | `/api/admin/products/:slug` | hide; `?permanent=true` deletes |
| GET/PUT | `/api/admin/content` | website content `{ data }` |
| POST | `/api/admin/uploads/sign` | signed fields for a direct upload to Cloudinary |
| POST | `/api/revalidate` | refresh cached pages |

## Search engines and AI assistants (SEO)

What the site already does (no setup needed):

- Every page has its own Marathi + English title, description, canonical link and share preview
  (`frontend/src/lib/seo.ts`, share image `public/images/og.jpg`).
- Structured data (JSON-LD) Google and AI assistants read: the business (LocalBusiness with
  address, phones, email), **the founders** Somnath P. Ghodake and Onkar D. Thite (Person, linked
  as founders), the website, every product (with price and stock only when set in the admin panel;
  no ratings or reviews are invented), breadcrumbs, the product list and the franchise FAQ.
- `/sitemap.xml` (all pages and products, refreshed hourly), `/robots.txt` (search engines and AI
  crawlers such as GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot and Google-Extended may read
  every public page; `/admin` and `/api` are blocked) and `/llms.txt` (a plain summary of the
  business, founders and products for AI assistants).
- Missing pages return a real 404, the admin panel is `noindex`, one `h1` per page, alt text on
  every image.
- Speed (Lighthouse, local production build): home 84 mobile / 98 desktop, other pages 81–100.
  The 3D scenes load after the page is ready, and are skipped on phones with data saver, very
  little memory, or no graphics acceleration (they keep the photo).

No website can guarantee the first result on Google or in ChatGPT. Ranking depends on Google and
on how many other sites mention Sanjivani. After the site is live on its domain:

1. Set `NEXT_PUBLIC_SITE_URL` on Vercel to the real domain and redeploy.
2. **Google Search Console** (search.google.com/search-console): add the domain, verify it (DNS
   record, or put the code in `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`), submit `sitemap.xml`, and
   use "URL inspection > Request indexing" for the home, about and products pages.
3. **Google Business Profile** (business.google.com): "Sanjivani Agarbatti", category *Incense
   supplier* / *Manufacturer*, the same address and phone as the website, photos of the shop and
   products, and the website link. This is what shows Sanjivani on Google Maps and in "agarbatti
   near me" searches.
4. **Bing Webmaster Tools** (bing.com/webmasters): import from Search Console and submit the
   sitemap. ChatGPT search and Copilot use Bing's index.
5. Mentions on other sites: IndiaMART, JustDial, TradeIndia, a Facebook and an Instagram page
   (with the website link in the bio), local news or directories. Keep the name, address and phone
   exactly the same everywhere. Add the social links to the site afterwards so Google can connect
   them.
6. Real customer reviews on the Google Business Profile (ask happy customers and dealers).
7. Check results with Google's Rich Results Test and PageSpeed Insights.

## Images

All product photos are in `frontend/public/images/` (resized to max 1200 px, named by product):

- `products/` one photo per product (pouches, packets, premium jars, dhoop boxes and jars, cup dhoop, puja sahitya)
- `gallery/` extra angles, the shop front, cup dhoop open box
- `brand/` logo, founders, visiting card

To change a product photo, upload a new one in the admin panel, or replace the file with the same
name. `frontend/src/data/products.json` is the starting catalogue and the offline fallback.

## Where to edit things

- Day to day: use the admin panel (`/admin`).
- Built-in default texts (used until edited in the panel): `frontend/src/lib/content.ts`
- Fragrance explorer text and smoke colours: `frontend/src/lib/fragrances.ts`
- Colours and fonts: `frontend/tailwind.config.ts` (font files: `frontend/src/app/globals.css`)
- SEO texts and structured data: `frontend/src/lib/seo.ts`
- 3D incense scene: `frontend/src/components/IncenseScene.tsx`
- Server code (database, sign-in, validation, email, uploads): `frontend/src/server/`

## Before going live (open items from the client requirements)

- Confirm the address: three versions appear in the client files; the site uses
  "Behind Patel Furniture, Malewadi-Akluj" from the visiting card.
- Prices, MRP and pack sizes per product: enter them in the admin panel.
- Photos for Z-Black, Lavender, Masala agarbatti and Jaswand pouch (not shown yet).
- Whether franchise amounts are shown publicly. The franchise copy makes **no profit or income
  promises** and shows the no-guarantee note from the agreement; keep it that way.
- Enquiry emails: set up Resend and verify the company domain (see Deploy on Vercel).
- Use a long random `JWT_SECRET` and turn on Atlas backups (or export the data regularly).
- Set `NEXT_PUBLIC_SITE_URL` to the real domain for correct sitemap and share links.
