// Loads src/data/products.json into MongoDB. Safe to run again: products are upserted by slug.
import { readFile } from 'node:fs/promises';
import mongoose from 'mongoose';
import { connectDB } from './db.js';
import { Product } from './models/Product.js';

const products = JSON.parse(await readFile(new URL('./data/products.json', import.meta.url), 'utf8'));

await connectDB();
const ops = products.map((p) => ({ updateOne: { filter: { slug: p.slug }, update: { $set: p }, upsert: true } }));
const r = await Product.bulkWrite(ops);
console.log(`Seeded products: ${r.upsertedCount} new, ${r.modifiedCount} updated, ${products.length} total`);
await mongoose.disconnect();
