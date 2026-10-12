import bcrypt from 'bcryptjs';
import mongoose, { Schema, type HydratedDocument, type InferSchemaType, type Model } from 'mongoose';

/* Models are registered once; `mongoose.models.X ||` keeps hot reload from redefining them. */

const i18n = { mr: { type: String, required: true }, en: { type: String, default: '' } };

const productSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    category: { type: String, required: true, enum: ['daily', 'premium', 'dhoop', 'cup', 'puja', 'masala'], index: true },
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
    packSize: { mr: String, en: String },
    inStock: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    sort: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const ENQUIRY_TYPES = ['franchise', 'dealer', 'contact', 'order'] as const;
export const ENQUIRY_STATUS = ['new', 'contacted', 'in-discussion', 'closed'] as const;
export type EnquiryKind = (typeof ENQUIRY_TYPES)[number];

const enquirySchema = new Schema(
  {
    type: { type: String, enum: ENQUIRY_TYPES, required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    mobile: { type: String, required: true, trim: true, match: /^[6-9]\d{9}$/ },
    city: { type: String, trim: true, maxlength: 120 },
    plan: { type: String, enum: ['mini', 'franchise', 'warehouse', ''], default: '' },
    hasShop: { type: String, trim: true, maxlength: 60 },
    investment: { type: String, trim: true, maxlength: 60 },
    shopName: { type: String, trim: true, maxlength: 160 },
    businessType: { type: String, trim: true, maxlength: 60 },
    products: { type: String, trim: true, maxlength: 300 },
    // order list from the website; prices are confirmed by phone / WhatsApp
    items: {
      type: [{ _id: false, slug: { type: String, required: true, maxlength: 80 }, name: { type: String, maxlength: 160 }, qty: { type: Number, required: true, min: 1, max: 999 } }],
      default: undefined,
    },
    message: { type: String, trim: true, maxlength: 2000 },
    source: { type: String, default: 'website' },
    status: { type: String, enum: ENQUIRY_STATUS, default: 'new', index: true },
    notes: { type: String, trim: true, maxlength: 2000 },
  },
  { timestamps: true },
);

const adminSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, default: 'Admin' },
    passwordHash: { type: String, required: true },
    // bumped on password change so older sign-ins stop working
    tokenVersion: { type: Number, default: 0 },
    lastLoginAt: Date,
  },
  { timestamps: true },
);

/**
 * Editable site content (texts, contact details, franchise plans, images), one document per key.
 * The website merges it over its built-in defaults.
 */
const contentSchema = new Schema(
  { key: { type: String, required: true, unique: true }, data: { type: Schema.Types.Mixed, default: {} }, updatedBy: String },
  { timestamps: true, minimize: false },
);

export const MIN_PASSWORD = 10;
export const hashPassword = (password: string) => bcrypt.hash(String(password), 12);
export const checkPassword = (password: unknown, hash: string) => bcrypt.compare(String(password || ''), hash);

type Doc<S extends Schema> = InferSchemaType<S>;
const model = <S extends Schema>(name: string, schema: S) => (mongoose.models[name] as Model<Doc<S>>) || mongoose.model(name, schema);

export const Product = model('Product', productSchema);
export const Enquiry = model('Enquiry', enquirySchema);
export const Admin = model('Admin', adminSchema);
export const Content = model('Content', contentSchema);
export type AdminDoc = HydratedDocument<Doc<typeof adminSchema>>;
