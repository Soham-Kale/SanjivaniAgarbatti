import mongoose from 'mongoose';
import { env } from './env';

/**
 * One MongoDB connection per server process. On Vercel every function instance reuses it across
 * requests, and in development it survives hot reloads (kept on globalThis).
 */
const g = globalThis as unknown as { _mongo?: Promise<typeof mongoose>; _mongoUri?: string };

/** Atlas copies the connection string without a database name; then MongoDB would use "test". */
function hasDbName(uri: string) {
  return /^mongodb(\+srv)?:\/\/[^/]+\/[^/?]+/.test(uri);
}

export function connectDB() {
  if (!env.mongoUri) throw new Error('MONGODB_URI is not set');
  // In development the connection outlives code reloads, so reconnect if .env.local now points elsewhere.
  if (g._mongo && g._mongoUri !== env.mongoUri) {
    const old = g._mongo;
    g._mongo = old.then((m) => m.disconnect()).catch(() => undefined).then(() => open());
    g._mongoUri = env.mongoUri;
  }
  if (!g._mongo) {
    g._mongoUri = env.mongoUri;
    g._mongo = open();
  }
  return g._mongo;
}

function open() {
  mongoose.set('strictQuery', true);
  return mongoose
    .connect(env.mongoUri, { serverSelectionTimeoutMS: 8000, maxPoolSize: 5, ...(hasDbName(env.mongoUri) ? {} : { dbName: 'sanjivani' }) })
    .catch((e) => {
      g._mongo = undefined; // try again on the next request
      throw e;
    });
}

/** Where the site is storing data, for the admin dashboard (no user name or password). */
export function dbLocation() {
  const c = mongoose.connection;
  return { host: c.host || '', name: c.name || '' };
}
