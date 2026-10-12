import mongoose from 'mongoose';
import { env } from './env';

/**
 * One MongoDB connection per server process. On Vercel every function instance reuses it across
 * requests, and in development it survives hot reloads (kept on globalThis).
 */
const g = globalThis as unknown as { _mongo?: Promise<typeof mongoose> };

export function connectDB() {
  if (!env.mongoUri) throw new Error('MONGODB_URI is not set');
  if (!g._mongo) {
    mongoose.set('strictQuery', true);
    g._mongo = mongoose
      .connect(env.mongoUri, { serverSelectionTimeoutMS: 8000, maxPoolSize: 5 })
      .catch((e) => {
        g._mongo = undefined; // try again on the next request
        throw e;
      });
  }
  return g._mongo;
}
