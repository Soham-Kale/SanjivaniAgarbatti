import { config } from './config.js';
import { connectDB } from './db.js';
import { createApp } from './app.js';

try {
  await connectDB();
} catch (err) {
  console.error('Could not connect to MongoDB. Is it running, and is MONGODB_URI in .env correct?');
  console.error(err.message);
  process.exit(1);
}

createApp().listen(config.port, () => {
  console.log(`Sanjivani API running on http://localhost:${config.port}`);
});
