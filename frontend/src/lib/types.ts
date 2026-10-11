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
  fragrance: string | null;
  benefits: string[];
  image: string;
  gallery: string[];
  priceNote: I18n | null;
  featured: boolean;
  sort: number;
  active?: boolean;
}

export type EnquiryType = 'franchise' | 'dealer' | 'contact';
