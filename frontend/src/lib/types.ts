export type Lang = 'mr' | 'en';
export type I18n = { mr: string; en: string };

export type Category = 'daily' | 'premium' | 'dhoop' | 'cup' | 'puja';

export interface Product {
  slug: string;
  category: Category;
  subtype: string;
  name: I18n;
  tagline: I18n;
  description: I18n;
  /** What the product is used for, shown on cards and the detail page. */
  uses?: I18n | null;
  fragrance: string | null;
  benefits: string[];
  image: string;
  gallery: string[];
  priceNote: I18n | null;
  /** Selling price and MRP in rupees, set from the admin panel. null = price on enquiry. */
  price?: number | null;
  mrp?: number | null;
  packSize?: I18n | null;
  inStock?: boolean;
  featured: boolean;
  sort: number;
  active?: boolean;
}

export type EnquiryType = 'franchise' | 'dealer' | 'contact' | 'order';

export interface CartItem {
  slug: string;
  name: I18n;
  image: string;
  qty: number;
  price?: number | null;
}
