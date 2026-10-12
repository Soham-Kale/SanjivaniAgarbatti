import mongoose from 'mongoose';

/**
 * Editable site content (texts, contact details, franchise plans, images). Stored as one
 * document per key; the website merges it over its built-in defaults, so any field the admin
 * has not changed keeps the original text.
 */
const contentSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
    updatedBy: String,
  },
  { timestamps: true, minimize: false }
);

export const Content = mongoose.model('Content', contentSchema);
