# संजीवनी धूप आणि अगरबत्ती · Sanjivani Agarbatti website

Full-stack website for Sanjivani Incense Sticks & Agarbatti, Malewadi-Akluj, built on the
**"Divya" dark premium design**: a live 3D incense scene in the hero, dark bands with gold
hairlines, a fragrance explorer that recolours the smoke, franchise plans and enquiry forms.

Content is Marathi-first, with an English toggle in the header (remembered per browser).

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
# edit .env: set MONGODB_URI and a long random ADMIN_KEY
npm run seed                  # loads the 38 products into MongoDB
npm run dev                   # starts the API with auto-reload
```

Check it: open http://localhost:5000/api/health and http://localhost:5000/api/products

### 2. Frontend (website on http://localhost:3000)

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

## Pages

| URL | What it shows |
| --- | --- |
| `/` | 3D hero, stats, featured products with category tabs, fragrance explorer, why us, franchise plans + 8-step process + enquiry form, founders, gallery |
| `/products` | All 38 products, category tabs and fragrance filter (`/products?c=dhoop` opens a tab) |
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

Enquiries are validated (10-digit Indian mobile), rate-limited (8 per IP per 15 min) and have a
honeypot field against bots.

**Admin endpoints** need the header `x-admin-key: <ADMIN_KEY from .env>`:

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/api/admin/enquiries` | `?type=franchise&status=new&page=1&limit=50` |
| PATCH | `/api/admin/enquiries/:id` | `{ "status": "contacted", "notes": "..." }` |
| GET | `/api/admin/enquiries.csv` | Excel-friendly CSV export (Marathi safe) |
| GET/POST | `/api/admin/products` | list all / create |
| PUT/DELETE | `/api/admin/products/:slug` | update / hide (soft delete) |

Example:

```bash
curl -H "x-admin-key: YOUR_KEY" http://localhost:5000/api/admin/enquiries?type=franchise
```

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

- Phone numbers, WhatsApp, email, address, plans, steps: `frontend/src/lib/site.ts`
- Fragrance explorer text and smoke colours: `frontend/src/lib/fragrances.ts`
- Colours and fonts (Divya palette): `frontend/tailwind.config.ts`
- 3D incense scene: `frontend/src/components/IncenseScene.tsx`

## Before going live (open items from the client requirements)

- Confirm the address: three versions appear in the client files; the site uses
  "Behind Patel Furniture, Malewadi-Akluj" from the visiting card.
- MRP and pack sizes per product (only the ₹5–₹15 packet range is known).
- Photos for Z-Black, Lavender, Masala agarbatti and Jaswand pouch (not shown yet).
- Whether franchise amounts are shown publicly. The franchise copy makes **no profit or income
  promises** and shows the no-guarantee note from the agreement; keep it that way.
- Enquiry notifications: add email (SMTP / Resend) or WhatsApp Cloud API at the `TODO` in
  `backend/src/routes/enquiries.js`.
- Replace the shared `ADMIN_KEY` with real logins before more people use the admin API.
- Set `NEXT_PUBLIC_SITE_URL` to the real domain for correct sitemap and share links.
