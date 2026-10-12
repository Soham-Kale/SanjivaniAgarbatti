// Loads src/data/products.json into MongoDB. Safe to run again: only products that are not in
// the database yet are added, so prices and edits made in the admin panel are kept.
// Use `npm run seed -- --force` to overwrite existing products with the file.
import { readFile } from 'node:fs/promises';
import mongoose from 'mongoose';
import { connectDB } from './db.js';
import { Product } from './models/Product.js';

const products = JSON.parse(await readFile(new URL('./data/products.json', import.meta.url), 'utf8'));

await connectDB();
const force = process.argv.includes('--force');
const ops = products.map((p) => ({ updateOne: { filter: { slug: p.slug }, update: force ? { $set: p } : { $setOnInsert: p }, upsert: true } }));
const r = await Product.bulkWrite(ops);
console.log(`Seeded products: ${r.upsertedCount} new, ${r.modifiedCount} updated, ${products.length} total`);
await mongoose.disconnect();
