import type { Product } from '../types';

export type AdminProduct = Product & { _id?: string; active: boolean; createdAt?: string; updatedAt?: string };

export type Enquiry = {
  _id: string;
  type: 'franchise' | 'dealer' | 'contact' | 'order';
  status: 'new' | 'contacted' | 'in-discussion' | 'closed';
  name: string;
  mobile: string;
  city?: string;
  message?: string;
  plan?: string;
  hasShop?: string;
  investment?: string;
  shopName?: string;
  businessType?: string;
  products?: string;
  items?: { slug: string; name: string; qty: number }[];
  notes?: string;
  createdAt: string;
};

export const ENQUIRY_LABEL: Record<Enquiry['type'], string> = {
  order: 'ऑर्डर · Order',
  franchise: 'फ्रँचायझी · Franchise',
  dealer: 'डीलर · Dealer',
  contact: 'संपर्क · Contact',
};
export const STATUS_LABEL: Record<Enquiry['status'], string> = {
  new: 'नवीन · New',
  contacted: 'संपर्क केला · Contacted',
  'in-discussion': 'चर्चा सुरू · In discussion',
  closed: 'पूर्ण · Closed',
};
