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
    uses: { mr: String, en: String }, // what the product is used for
    fragrance: { type: String, default: null, index: true },
    benefits: [String],
    image: { type: String, required: true },
    gallery: [String],
    priceNote: { mr: String, en: String },
    // Selling price and MRP in rupees. Leave empty to show "price on enquiry".
    price: { type: Number, min: 0, default: null },
    mrp: { type: Number, min: 0, default: null },
    packSize: { mr: String, en: String }, // e.g. "100 ग्रॅम" / "100 g"
    inStock: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    sort: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Product = mongoose.model('Product', productSchema);
