import mongoose from 'mongoose';

const i18n = { mr: { type: String, required: true }, en: { type: String, default: '' } };

const productSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    category: {
      type: String,
      required: true,
      enum: ['daily', 'premium', 'dhoop', 'cup', 'puja', 'masala'],
      index: true,
    },
    subtype: { type: String, default: '' }, // pouch | packet | jar | box | pack
    name: i18n,
    tagline: { mr: String, en: String },
    description: { mr: String, en: String },
    fragrance: { type: String, default: null, index: true },
    benefits: [String],
    image: { type: String, required: true },
    gallery: [String],
    priceNote: { mr: String, en: String },
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    sort: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Product = mongoose.model('Product', productSchema);
