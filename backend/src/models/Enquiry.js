import mongoose from 'mongoose';

export const ENQUIRY_TYPES = ['franchise', 'dealer', 'contact'];
export const ENQUIRY_STATUS = ['new', 'contacted', 'in-discussion', 'closed'];

const enquirySchema = new mongoose.Schema(
  {
    type: { type: String, enum: ENQUIRY_TYPES, required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    mobile: { type: String, required: true, trim: true, match: /^[6-9]\d{9}$/ },
    city: { type: String, trim: true, maxlength: 120 },
    // franchise
    plan: { type: String, enum: ['mini', 'franchise', 'warehouse', ''], default: '' },
    hasShop: { type: String, trim: true, maxlength: 60 },
    investment: { type: String, trim: true, maxlength: 60 },
    // dealer
    shopName: { type: String, trim: true, maxlength: 160 },
    businessType: { type: String, trim: true, maxlength: 60 },
    products: { type: String, trim: true, maxlength: 300 },
    // common
    message: { type: String, trim: true, maxlength: 2000 },
    source: { type: String, default: 'website' },
    status: { type: String, enum: ENQUIRY_STATUS, default: 'new', index: true },
    notes: { type: String, trim: true, maxlength: 2000 },
  },
  { timestamps: true }
);

export const Enquiry = mongoose.model('Enquiry', enquirySchema);
