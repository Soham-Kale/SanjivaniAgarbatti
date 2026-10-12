import { config } from './config.js';
import { connectDB } from './db.js';
import { createApp } from './app.js';
import { ensureFirstAdmin } from './utils/auth.js';

try {
  await connectDB();
  await ensureFirstAdmin();
} catch (err) {
  console.error('Could not connect to MongoDB. Is it running, and is MONGODB_URI in .env correct?');
  console.error(err.message);
  process.exit(1);
}

if (!config.jwtSecret) console.warn('JWT_SECRET is not set: admin sign-in is disabled until you add it to .env');

createApp().listen(config.port, () => {
  console.log(`Sanjivani API running on http://localhost:${config.port}`);
});
