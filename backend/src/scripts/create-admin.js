// Creates an admin, or resets the password of an existing one.
// Usage: npm run create-admin -- you@example.com "a-long-password"
import mongoose from 'mongoose';
import { connectDB } from '../db.js';
import { Admin, MIN_PASSWORD } from '../models/Admin.js';

const [email, password] = process.argv.slice(2);
if (!email || !password) {
  console.error('Usage: npm run create-admin -- <email> <password>');
  process.exit(1);
}
if (password.length < MIN_PASSWORD) {
  console.error(`Password must be at least ${MIN_PASSWORD} characters.`);
  process.exit(1);
}

await connectDB();
const passwordHash = await Admin.hashPassword(password);
const existing = await Admin.findOne({ email: email.toLowerCase() });
if (existing) {
  existing.passwordHash = passwordHash;
  existing.tokenVersion += 1;
  await existing.save();
  console.log(`Password updated for ${existing.email}`);
} else {
  await Admin.create({ email, passwordHash });
  console.log(`Admin created: ${email.toLowerCase()}`);
}
await mongoose.disconnect();
