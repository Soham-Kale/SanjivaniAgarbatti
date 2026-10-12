import type { I18n } from './types';

/** Franchise questions, shown on /franchise and published there as FAQPage structured data. */
export const FRANCHISE_FAQ: { q: I18n; a: I18n }[] = [
  {
    q: { mr: 'फ्रँचायझी कुठे उपलब्ध आहे?', en: 'Where is the franchise available?' },
    a: { mr: 'संपूर्ण महाराष्ट्रात. लोकेशन चर्चा व दुकान पाहणीनंतर मंजुरी दिली जाते.', en: 'Across Maharashtra. Approval is given after a location discussion and shop visit.' },
  },
  {
    q: { mr: 'डिपॉझिट किती आहे?', en: 'How much is the deposit?' },
    a: { mr: 'मिनी ₹20,000, संजीवनी फ्रँचायझी ₹50,000 आणि वेअरहाऊस ₹1,50,000. सविस्तर अटी करारात दिलेल्या आहेत.', en: 'Mini ₹20,000, Sanjivani Franchise ₹50,000 and Warehouse ₹1,50,000. Full terms are in the agreement.' },
  },
  {
    q: { mr: 'नफ्याची हमी आहे का?', en: 'Is profit guaranteed?' },
    a: { mr: 'नाही. विक्री व उत्पन्न हे ठिकाण, मेहनत व बाजारपेठेवर अवलंबून असते. करारात कोणत्याही नफ्याची हमी दिली जात नाही.', en: 'No. Sales and income depend on location, effort and the market. The agreement does not guarantee any profit.' },
  },
  {
    q: { mr: 'माल कसा मागवायचा?', en: 'How do I order stock?' },
    a: { mr: 'ऑर्डर दिल्यानंतर पुष्टी व डिस्पॅच अशी सोपी प्रक्रिया आहे. ऑर्डर फोन किंवा WhatsApp वर देता येते.', en: 'A simple order, confirmation and dispatch process. Orders can be placed by phone or WhatsApp.' },
  },
];
