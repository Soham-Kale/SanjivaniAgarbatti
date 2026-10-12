import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, default: 'Admin' },
    passwordHash: { type: String, required: true },
    // Bumped on password change so older tokens stop working.
    tokenVersion: { type: Number, default: 0 },
    lastLoginAt: Date,
  },
  { timestamps: true }
);

adminSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(String(password || ''), this.passwordHash);
};

adminSchema.statics.hashPassword = (password) => bcrypt.hash(String(password), 12);

export const MIN_PASSWORD = 10;
export const Admin = mongoose.model('Admin', adminSchema);
