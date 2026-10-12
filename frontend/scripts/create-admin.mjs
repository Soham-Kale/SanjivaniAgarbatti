// Creates an admin, or resets the password of an existing one (signing out its other sessions).
// Usage: npm run create-admin -- you@example.com "a-long-password"
import './env.mjs';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const MIN_PASSWORD = 10;
const [rawEmail, password] = process.argv.slice(2);
if (!rawEmail || !password) {
  console.error('Usage: npm run create-admin -- <email> <password>');
  process.exit(1);
}
if (password.length < MIN_PASSWORD) {
  console.error(`Password must be at least ${MIN_PASSWORD} characters.`);
  process.exit(1);
}

const email = rawEmail.trim().toLowerCase();
await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
const admins = mongoose.connection.collection('admins');
const passwordHash = await bcrypt.hash(password, 12);
const now = new Date();
const existing = await admins.findOne({ email });
if (existing) {
  await admins.updateOne({ _id: existing._id }, { $set: { passwordHash, updatedAt: now }, $inc: { tokenVersion: 1 } });
  console.log(`Password updated for ${email}`);
} else {
  await admins.insertOne({ email, name: 'Admin', passwordHash, tokenVersion: 0, createdAt: now, updatedAt: now });
  console.log(`Admin created: ${email}`);
}
await mongoose.disconnect();
