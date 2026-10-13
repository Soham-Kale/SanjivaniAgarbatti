// Loads src/data/products.json into MongoDB. Safe to run again: only products that are not in
// the database yet are added, so prices and edits made in the admin panel are kept.
// Use `npm run seed -- --force` to overwrite existing products with the file.
// (The site also does this by itself the first time the admin panel opens on an empty database.)
import { mongoOptions } from './env.mjs';
import { readFile } from 'node:fs/promises';
import mongoose from 'mongoose';

const products = JSON.parse(await readFile(new URL('../src/data/products.json', import.meta.url), 'utf8'));
const force = process.argv.includes('--force');

await mongoose.connect(process.env.MONGODB_URI, mongoOptions);
const now = new Date();
const ops = products.map((p) => ({
  updateOne: {
    filter: { slug: p.slug },
    update: force
      ? { $set: { ...p, updatedAt: now }, $setOnInsert: { createdAt: now } }
      : { $setOnInsert: { ...p, createdAt: now, updatedAt: now } },
    upsert: true,
  },
}));
const r = await mongoose.connection.collection('products').bulkWrite(ops);
console.log(`Seeded products: ${r.upsertedCount} new, ${r.modifiedCount} updated, ${products.length} total`);
await mongoose.disconnect();
