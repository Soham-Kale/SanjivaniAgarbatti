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
- **Marathi typography**: *Tiro Devanagari Marathi* for headings (drawn for Marathi, correct ळ/ऱ्
  and conjuncts) and *Noto Sans Devanagari* for body text, self-hosted by `next/font` at build time.
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
├── frontend/   Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer Motion + Three.js
├── backend/    Node.js + Express + MongoDB (Mongoose): products and enquiries API
└── docker-compose.yml   optional local MongoDB
```

## What you need

- **Node.js 18.18 or newer** (20 LTS recommended): https://nodejs.org
- **MongoDB**, one of:
  - MongoDB Community Server installed locally, or
  - Docker: `docker compose up -d` in this folder, or
  - a free MongoDB Atlas cluster (copy its connection string into `backend/.env`).

The frontend also runs **without** the backend: products then come from
`frontend/src/data/products.json`, and the enquiry forms offer to send the details on WhatsApp
instead.

## Setup and run (first time)

Nothing has been installed yet. Run these commands yourself in a terminal.

### 1. Backend (API on http://localhost:5000)

```bash
cd backend
npm install
cp .env.example .env          # Windows: copy .env.example .env
# edit .env: set MONGODB_URI, a long random JWT_SECRET, ADMIN_EMAIL and ADMIN_PASSWORD
npm run seed                  # loads the products into MongoDB (keeps admin edits)
npm run dev                   # starts the API with auto-reload
```

Check it: open http://localhost:5000/api/health and http://localhost:5000/api/products

If you already ran `npm install` in `backend` before the admin panel was added, run it again: it
adds `bcryptjs`, `jsonwebtoken` and `multer`.

### 2. Frontend (website on http://localhost:3000)

If you already ran `npm install` before the 3D upgrade, run it again: it adds
`@react-three/fiber`, `@react-three/drei` and `maath`.

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env.local    # Windows: copy .env.example .env.local
npm run dev
```

Open http://localhost:3000

### Production build

```bash
cd frontend && npm run build && npm start      # serves on port 3000
cd backend  && npm start                       # serves on port 5000
```

## Admin panel (`/admin`)

Open http://localhost:3000/admin and sign in. The panel is in Marathi and English and works on
phone and desktop. Every save refreshes the website straight away.

| Section | What the admin can do |
| --- | --- |
| Dashboard | Product, price and enquiry counts, latest enquiries, quick links |
| Products & prices | Search and filter; set price and MRP right in the list; hide/show; delete permanently; add a new product; edit every field (names, description, uses, highlights, main photo and gallery uploads, pack size, price note, stock, category, fragrance, featured, order, URL) |
| Website content | Edit any text, phone number, photo and list on the site: contact details, announcement bar, SEO, home banner, featured block, category cards, our story, why us, franchise plans/steps/note, closing block, about page, footer. "Reset to original" per section |
| Orders & enquiries | Filter by type and status, change status, add notes, delete, download CSV for Excel |
| Account | Change the admin password (signs out other devices) |

**First admin.** Set `JWT_SECRET`, `ADMIN_EMAIL` and `ADMIN_PASSWORD` (10+ characters) in
`backend/.env` and start the API: the account is created once, if no admin exists. Then remove
`ADMIN_PASSWORD` from `.env`. Or create/reset an admin any time:

```bash
cd backend
npm run create-admin -- owner@example.com "a-long-password"
```

Passwords are stored hashed (bcrypt); sign-in is limited to 10 tries per 15 minutes and gives a
12-hour token kept only in that browser tab. Uploaded photos go to `backend/uploads` (served at
`/uploads`; JPG/PNG/WebP/AVIF, max 5 MB) — back this folder up along with MongoDB.

Prices: a product with no price shows "price on enquiry"; with a price, cards and the product page
show it (MRP struck through, % off) and the cart shows totals in the WhatsApp order. Content you
have not edited keeps the built-in text, so the site still works if the API is offline.

`npm run seed` only adds missing products; `npm run seed -- --force` overwrites products with the
JSON file (this erases admin edits to those products).

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

## API (backend)

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/api/health` | server + DB status |
| GET | `/api/products` | `?category=daily\|premium\|dhoop\|cup\|puja`, `?fragrance=chandan`, `?featured=true` |
| GET | `/api/products/:slug` | one product |
| POST | `/api/enquiries/franchise` | `name, mobile, city, plan (mini\|franchise\|warehouse), hasShop, investment, message` |
| POST | `/api/enquiries/dealer` | `name, mobile, city, shopName, businessType, products, message` |
| POST | `/api/enquiries/contact` | `name, mobile, city?, message` |
| POST | `/api/enquiries/order` | `name, mobile, city?, message, items: [{ slug, name, qty }]` |

Enquiries are validated (10-digit Indian mobile), rate-limited (8 per IP per 15 min) and have a
honeypot field against bots.

**Sign-in** (`/api/auth`): `POST /login {email, password}` returns a token; `GET /me`;
`POST /password {currentPassword, newPassword}`. `GET /api/content` returns the edited website content (public).

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
| POST | `/api/admin/uploads` | multipart field `files` (up to 10 images) → `{ urls }` |

## Images

All product photos are in `frontend/public/images/` (resized to max 1200 px, named by product):

- `products/` one photo per product (pouches, packets, premium jars, dhoop boxes and jars, cup dhoop, puja sahitya)
- `gallery/` extra angles, the shop front, cup dhoop open box
- `brand/` logo, founders, visiting card

To change a product photo, replace the file with the same name, or edit `image` in
`backend/src/data/products.json` and run `npm run seed` again. Keep
`frontend/src/data/products.json` in sync (it is the offline fallback); copying the backend file
over it is enough.

## Where to edit things

- Day to day: use the admin panel (`/admin`).
- Built-in default texts (used until edited in the panel): `frontend/src/lib/content.ts`
- Fragrance explorer text and smoke colours: `frontend/src/lib/fragrances.ts`
- Colours and fonts (Divya palette): `frontend/tailwind.config.ts`
- 3D incense scene: `frontend/src/components/IncenseScene.tsx`

## Before going live (open items from the client requirements)

- Confirm the address: three versions appear in the client files; the site uses
  "Behind Patel Furniture, Malewadi-Akluj" from the visiting card.
- Prices, MRP and pack sizes per product: enter them in the admin panel.
- Photos for Z-Black, Lavender, Masala agarbatti and Jaswand pouch (not shown yet).
- Whether franchise amounts are shown publicly. The franchise copy makes **no profit or income
  promises** and shows the no-guarantee note from the agreement; keep it that way.
- Enquiry notifications: add email (SMTP / Resend) or WhatsApp Cloud API at the `TODO` in
  `backend/src/routes/enquiries.js`.
- Use a long random `JWT_SECRET`, serve the site and API over HTTPS, and back up MongoDB and `backend/uploads`.
- Set `NEXT_PUBLIC_SITE_URL` to the real domain for correct sitemap and share links.
