import type { Category, I18n } from './types';

// Contact details, page texts, franchise plans and category cards live in ./content.ts and
// can be edited from the admin panel (/admin/content).

export const CATEGORIES: { id: Category | 'all'; label: I18n }[] = [
  { id: 'all', label: { mr: 'सर्व', en: 'All' } },
  { id: 'daily', label: { mr: 'दैनंदिन अगरबत्ती', en: 'Daily Agarbatti' } },
  { id: 'premium', label: { mr: 'प्रीमियम अगरबत्ती', en: 'Premium Agarbatti' } },
  { id: 'dhoop', label: { mr: 'धूप कांडी', en: 'Dhoop Sticks' } },
  { id: 'cup', label: { mr: 'कप धूप', en: 'Cup Dhoop' } },
  { id: 'puja', label: { mr: 'पूजा साहित्य', en: 'Puja Sahitya' } },
];

export const NAV: { href: string; label: I18n }[] = [
  { href: '/products', label: { mr: 'उत्पादने', en: 'Products' } },
  { href: '/#fragrance', label: { mr: 'सुगंध', en: 'Fragrances' } },
  { href: '/about', label: { mr: 'आमची कथा', en: 'Our story' } },
  { href: '/franchise', label: { mr: 'फ्रँचायझी', en: 'Franchise' } },
  { href: '/contact', label: { mr: 'संपर्क', en: 'Contact' } },
];
