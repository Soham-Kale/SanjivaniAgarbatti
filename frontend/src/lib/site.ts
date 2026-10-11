import type { Category, I18n } from './types';

export const SITE = {
  name: { mr: 'संजीवनी धूप आणि अगरबत्ती', en: 'Sanjivani Incense Sticks & Agarbatti' },
  phones: [
    { display: '+91 73871 42494', tel: '+917387142494', person: { mr: 'श्री. सोमनाथ पी. घोडके', en: 'Mr. Somnath P. Ghodake' } },
    { display: '+91 80106 45165', tel: '+918010645165', person: { mr: 'श्री. ओंकार डी. थिटे', en: 'Mr. Onkar D. Thite' } },
  ],
  whatsapp: '917387142494',
  email: 'sanjivaniofficial@gmail.com',
  // The client documents carry three address versions; this one matches the latest
  // visiting card. Confirm with the client before launch.
  address: {
    mr: 'पटेल फर्निचरच्या मागे, माळेवाडी-अकलूज, ता. माळशिरस, जि. सोलापूर ४१३१०१',
    en: 'Behind Patel Furniture, Malewadi-Akluj, Tal. Malshiras, Dist. Solapur 413101',
  },
  mapUrl: 'https://maps.google.com/?q=Malewadi+Akluj+Solapur',
} as const;

export const waLink = (text?: string) =>
  `https://wa.me/${SITE.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

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
  { href: '/franchise', label: { mr: 'फ्रँचायझी', en: 'Franchise' } },
  { href: '/about', label: { mr: 'आमच्याविषयी', en: 'About' } },
  { href: '/#gallery', label: { mr: 'गॅलरी', en: 'Gallery' } },
  { href: '/contact', label: { mr: 'संपर्क', en: 'Contact' } },
];

export const PLANS = [
  {
    id: 'mini',
    name: { mr: 'मिनी फ्रँचायझी', en: 'Mini Franchise' },
    amount: '₹2,00,000',
    deposit: { mr: 'डिपॉझिट ₹20,000 (10%)', en: 'Deposit ₹20,000 (10%)' },
    points: [
      { mr: '₹1,80,000 किमतीचा माल', en: '₹1,80,000 worth of stock' },
      { mr: 'लहान दुकान व गावांसाठी', en: 'For small shops and villages' },
      { mr: 'ब्रँड बोर्ड व मार्गदर्शन', en: 'Brand board and guidance' },
    ],
    featured: false,
  },
  {
    id: 'franchise',
    name: { mr: 'संजीवनी फ्रँचायझी', en: 'Sanjivani Franchise' },
    amount: '₹5,00,000',
    deposit: { mr: 'डिपॉझिट ₹50,000', en: 'Deposit ₹50,000' },
    points: [
      { mr: 'पूर्ण उत्पादन रेंज', en: 'Full product range' },
      { mr: 'शहर व तालुका ठिकाणांसाठी', en: 'For towns and taluka places' },
      { mr: 'मार्केटिंग सहाय्य व प्रशिक्षण', en: 'Marketing support and training' },
    ],
    featured: true,
  },
  {
    id: 'warehouse',
    name: { mr: 'संजीवनी वेअरहाऊस', en: 'Sanjivani Warehouse' },
    amount: '₹15,00,000',
    deposit: { mr: 'डिपॉझिट ₹1,50,000', en: 'Deposit ₹1,50,000' },
    points: [
      { mr: 'जिल्हा स्तरावर वितरण', en: 'District-level distribution' },
      { mr: 'डीलर व दुकानांना पुरवठा', en: 'Supply to dealers and shops' },
      { mr: 'मोठा स्टॉक व सपोर्ट', en: 'Large stock and support' },
    ],
    featured: false,
  },
] as const;

export const STEPS: I18n[] = [
  { mr: 'संपर्क', en: 'Contact' },
  { mr: 'लोकेशन चर्चा', en: 'Location talk' },
  { mr: 'दुकान पाहणी', en: 'Shop visit' },
  { mr: 'मंजुरी', en: 'Approval' },
  { mr: 'करार', en: 'Agreement' },
  { mr: 'दुकान सेटअप', en: 'Shop setup' },
  { mr: 'सुरुवातीचा माल', en: 'Initial stock' },
  { mr: 'उद्घाटन', en: 'Launch' },
];

export const NO_PROFIT_NOTE: I18n = {
  mr: 'टीप: फ्रँचायझीमध्ये कोणत्याही नफ्याची किंवा उत्पन्नाची हमी दिली जात नाही. सर्व अटी व शर्ती फ्रँचायझी करारानुसार लागू.',
  en: 'Note: No profit or income is guaranteed under the franchise. All terms and conditions are as per the franchise agreement.',
};
