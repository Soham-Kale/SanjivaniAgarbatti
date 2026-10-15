import { FRANCHISE_FAQ } from './faq';
import type { Category, I18n } from './types';

/**
 * Everything on the website that the admin can edit from /admin/content. These are the
 * built-in defaults. Whatever the admin saves is stored in MongoDB and merged over these, so
 * the site always has complete text even when the API is offline.
 */

export type Phone = { display: string; tel: string; person: I18n; role: string; photo: string };
export type Plan = { id: 'mini' | 'franchise' | 'warehouse'; name: I18n; amount: string; deposit: I18n; points: I18n[]; featured: boolean };
export type Outlet = { name: I18n; address: I18n; photo: string; mapUrl: string };
export type GalleryPhoto = { src: string; title: I18n; text: I18n; href: string; wide: boolean };
export type WhyIcon = 'clock' | 'hand' | 'smoke' | 'flower' | 'cup' | 'store';

export type SiteContent = {
  site: {
    name: I18n;
    motto: string;
    phones: Phone[];
    whatsapp: string;
    email: string;
    address: I18n;
    mapUrl: string;
    hours: I18n;
  };
  announcement: { enabled: boolean; text: I18n; link: string };
  seo: { title: string; description: string };
  hero: { eyebrow: I18n; title: I18n; tagline: string; text: I18n; ctaPrimary: I18n; ctaSecondary: I18n; poster: string };
  featured: { eyebrow: I18n; title: I18n; text: I18n };
  categories: Record<Category, { label: I18n; blurb: I18n; image: string }>;
  story: {
    eyebrow: I18n;
    title: I18n;
    chapters: { k: I18n; h: I18n; p: I18n }[];
    photos: { src: string; cap: I18n }[];
  };
  why: { eyebrow: I18n; title: I18n; text: I18n; items: { icon: WhyIcon; b: I18n; s: I18n }[] };
  franchise: {
    eyebrow: I18n;
    title: I18n;
    text: I18n;
    plans: Plan[];
    steps: I18n[];
    note: I18n;
    blocks: { title: I18n; items: I18n[] }[];
    faq: { q: I18n; a: I18n }[];
    why: { eyebrow: I18n; title: I18n; image: string; alt: I18n };
    outlets: { eyebrow: I18n; title: I18n; text: I18n; items: Outlet[] };
  };
  showcase: { eyebrow: I18n; steps: { k: I18n; h: I18n; p: I18n }[] };
  gallery: { eyebrow: I18n; title: I18n; text: I18n; photos: GalleryPhoto[] };
  closing: { eyebrow: I18n; title: I18n; highlight: I18n; text: I18n };
  about: { eyebrow: I18n; title: I18n; quote: string; text: I18n; mission: { eyebrow: I18n; title: I18n; items: I18n[]; image: string } };
  footer: { blurb: I18n; note: I18n };
};

export const DEFAULT_CONTENT: SiteContent = {
  site: {
    name: { mr: 'संजीवनी धूप आणि अगरबत्ती', en: 'Sanjivani Incense Sticks & Agarbatti' },
    motto: 'Quality Products • Trusted Service • Complete Puja Solution',
    phones: [
      {
        display: '+91 73871 42494',
        tel: '+917387142494',
        person: { mr: 'श्री. सोमनाथ पी. घोडके', en: 'Mr. Somnath P. Ghodake' },
        role: 'FOUNDER & CEO',
        photo: '/images/brand/founder-somnath.jpg',
      },
      {
        display: '+91 80106 45165',
        tel: '+918010645165',
        person: { mr: 'श्री. ओंकार डी. थिटे', en: 'Mr. Onkar D. Thite' },
        role: 'FOUNDER & M.D.',
        photo: '/images/brand/founder-onkar.jpg',
      },
    ],
    whatsapp: '917387142494',
    email: 'sanjivaniofficial@gmail.com',
    // The client documents carry three address versions; this one matches the latest
    // visiting card. Confirm with the client before launch.
    address: {
      mr: 'अकलूज - मालेवाडी रोड, मालेवाडी, विद्या नगर, अकलूज, महाराष्ट्र 413118',
      en: 'Akluj - Malewadi Rd, Malewadi, Vidya Nagar, Akluj, Maharashtra 413118',
    },
    mapUrl: 'https://maps.google.com/?q=Malewadi+Akluj+Solapur',
    hours: { mr: '', en: '' },
  },
  announcement: { enabled: false, text: { mr: '', en: '' }, link: '' },
  seo: {
    title: 'संजीवनी धूप आणि अगरबत्ती | Sanjivani Agarbatti, Akluj',
    description:
      'प्रार्थनेचा पवित्र सुगंध. प्रीमियम अगरबत्ती, धूप कांडी, कप धूप व पूजा साहित्य, माळेवाडी-अकलूज. घाऊक, किरकोळ व फ्रँचायझी संपूर्ण महाराष्ट्रात.',
  },
  hero: {
    eyebrow: { mr: 'संजीवनी धूप आणि अगरबत्ती · अकलूज', en: 'Sanjivani Dhoop & Agarbatti · Akluj' },
    title: { mr: 'प्रार्थनेचा|पवित्र|सुगंध', en: 'The sacred|fragrance|of prayer' },
    tagline: 'Bringing Divine Fragrance to Every Home',
    text: {
      mr: 'प्रीमियम अगरबत्ती, धूप कांडी, कप धूप आणि संपूर्ण पूजा साहित्य. माळेवाडी-अकलूज येथे स्वतः तयार केलेले, घाऊक व किरकोळ दोन्ही.',
      en: 'Premium agarbatti, dhoop sticks, cup dhoop and complete puja sahitya. Made by us in Malewadi-Akluj, for wholesale and retail.',
    },
    ctaPrimary: { mr: 'उत्पादने पाहा', en: 'Explore Products' },
    ctaSecondary: { mr: 'आमची कथा', en: 'Discover Our Story' },
    poster: '/images/products/premium-jar-kasturi.jpg',
  },
  featured: {
    eyebrow: { mr: 'निवडक उत्पादने', en: 'Featured' },
    title: { mr: 'प्रत्येक पूजेसाठी, एकाच ठिकाणी', en: 'For every puja, in one place' },
    text: { mr: 'रंग हाताला लागत नाही, कमी धूर आणि दीर्घकाळ टिकणारा सौम्य सुगंध.', en: 'Colour does not stick to hands, low smoke and a mild, long-lasting fragrance.' },
  },
  categories: {
    daily: {
      label: { mr: 'दैनंदिन अगरबत्ती', en: 'Daily Agarbatti' },
      blurb: { mr: 'रोजच्या पूजेसाठी पाऊच व ₹५ पासूनची पॅकेट्स', en: 'Pouches and packets from ₹5 for daily puja' },
      image: '/images/products/pouch-kewda.jpg',
    },
    premium: {
      label: { mr: 'प्रीमियम अगरबत्ती', en: 'Premium Agarbatti' },
      blurb: { mr: 'गोल्ड-कॅप जारमधील निवडक सुगंध', en: 'Select fragrances in gold-cap jars' },
      image: '/images/products/premium-jar-kasturi.jpg',
    },
    dhoop: {
      label: { mr: 'धूप कांडी', en: 'Dhoop Sticks' },
      blurb: { mr: 'बॉक्स व जारमधील प्रीमियम धूप स्टिक', en: 'Premium dhoop sticks in boxes and jars' },
      image: '/images/products/dhoop-box-kewda-bel.jpg',
    },
    cup: {
      label: { mr: 'कप धूप', en: 'Cup Dhoop' },
      blurb: { mr: 'कोळशासह बहुरंगी कप, २+ तास', en: 'Multicolour cups with charcoal, 2+ hours' },
      image: '/images/gallery/cup-dhoop-open.jpg',
    },
    puja: {
      label: { mr: 'पूजा साहित्य', en: 'Puja Sahitya' },
      blurb: { mr: 'कापूर, वाती, गुलाल, भंडारा, रांगोळी', en: 'Camphor, wicks, gulal, bhandara, rangoli' },
      image: '/images/products/phulvat.jpg',
    },
  },
  story: {
    eyebrow: { mr: 'आमची कथा', en: 'Our story' },
    title: { mr: 'एकच दुकान, पूजा साहित्याची संपूर्ण दुनिया', en: 'One shop, a whole world of puja sahitya' },
    chapters: [
      {
        k: { mr: '०१ · आमचे दुकान', en: '01 · Our shop' },
        h: { mr: 'माळेवाडी-अकलूज येथून', en: 'From Malewadi-Akluj' },
        p: {
          mr: 'आमची अगरबत्ती, धूप आणि पूजा साहित्य आम्ही स्वतः तयार करतो आणि माळेवाडी-अकलूज येथील दुकानातून घाऊक व किरकोळ विक्री करतो.',
          en: 'We make our own agarbatti, dhoop and puja sahitya, and sell wholesale and retail from our shop in Malewadi-Akluj.',
        },
      },
      {
        k: { mr: '०२ · आमचे ध्येय', en: '02 · Our mission' },
        h: { mr: 'आपल्या प्रत्येक पूजेसाठी… संजीवनी सोबत!', en: 'For every puja of yours… with Sanjivani!' },
        p: {
          mr: 'पूजेपासून सण-समारंभापर्यंत लागणारे सर्व पूजा साहित्य एकाच ठिकाणी, गुणवत्तेची खात्री आणि रास्त किमतीत.',
          en: 'Everything needed from daily puja to festivals, in one place, with assured quality and fair prices.',
        },
      },
      {
        k: { mr: '०३ · आमचा उद्देश', en: '03 · Our purpose' },
        h: { mr: 'गावागावात स्वयंरोजगार', en: 'Self-employment in every village' },
        p: {
          mr: 'ग्रामीण व शहरी भागातील युवक-युवतींना आणि महिलांना स्वयंरोजगार व व्यवसायाची संधी देणे हा आमचा उद्देश आहे.',
          en: 'Our aim is to create self-employment and business opportunities for young people and women in rural and urban areas.',
        },
      },
    ],
    photos: [
      { src: '/images/gallery/shop-front.jpg', cap: { mr: 'स्वतः उत्पादन · घाऊक व किरकोळ', en: 'Own production · wholesale & retail' } },
      { src: '/images/products/premium-jar-chandan.jpg', cap: { mr: 'चंदन प्रीमियम अगरबत्ती, गोल्ड-कॅप जार', en: 'Chandan premium agarbatti, gold-cap jar' } },
      { src: '/images/products/dhoop-box-mogra.jpg', cap: { mr: 'मोगरा प्रीमियम धूप स्टिक बॉक्स', en: 'Mogra premium dhoop stick box' } },
    ],
  },
  why: {
    eyebrow: { mr: 'आम्हीच का?', en: 'Why Sanjivani' },
    title: { mr: 'गुणवत्ता जी प्रत्येक पेटीत दिसते', en: 'Quality you can see in every box' },
    text: { mr: 'उत्तम दर्जाचा कच्चा माल, चांगली burning quality आणि आकर्षक packaging.', en: 'Quality raw material, good burning quality and attractive packaging.' },
    items: [
      { icon: 'clock', b: { mr: 'किमान ४० मिनिटे', en: 'At least 40 minutes' }, s: { mr: 'एक अगरबत्ती किमान ४० मिनिटे जळते.', en: 'Each agarbatti burns for at least 40 minutes.' } },
      { icon: 'hand', b: { mr: 'रंग हाताला लागत नाही', en: 'No colour on your hands' }, s: { mr: 'हाताळताना रंग लागत नाही.', en: 'The colour does not rub off when handled.' } },
      { icon: 'smoke', b: { mr: 'कमी धूर', en: 'Low smoke' }, s: { mr: 'सौम्य, कमी धूर देणारी अगरबत्ती.', en: 'Gentle sticks that give little smoke.' } },
      { icon: 'flower', b: { mr: 'सौम्य, दीर्घकाळ सुगंध', en: 'Mild, lasting fragrance' }, s: { mr: 'घर, दुकान, ऑफिस आणि मंदिरात प्रसन्न वातावरण.', en: 'A pleasant mood at home, shop, office and temple.' } },
      { icon: 'cup', b: { mr: 'कप धूप २+ तास', en: 'Cup dhoop, 2+ hours' }, s: { mr: 'कोळशासह येणारा बहुरंगी कप धूप.', en: 'Multicolour cup dhoop that comes with charcoal.' } },
      { icon: 'store', b: { mr: 'घाऊक व किरकोळ', en: 'Wholesale & retail' }, s: { mr: '₹५ पासून पॅक; दुकानदार व डीलरसाठी होलसेल दर.', en: 'Packs from ₹5; wholesale rates for shops and dealers.' } },
    ],
  },
  franchise: {
    eyebrow: { mr: 'फ्रँचायझी · संपूर्ण महाराष्ट्र', en: 'Franchise · All Maharashtra' },
    title: { mr: 'तुमची गुंतवणूक, आमचा ब्रँड, दोघांची प्रगती', en: 'Your investment, our brand, growth for both' },
    text: {
      mr: 'तुमच्या गावात संजीवनीचे दुकान सुरू करा. ब्रँड, माल पुरवठा, प्रशिक्षण आणि मार्केटिंग सहाय्य आमच्याकडून.',
      en: 'Open a Sanjivani shop in your town. Brand, stock supply, training and marketing support from us.',
    },
    plans: [
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
    ],
    steps: [
      { mr: 'संपर्क', en: 'Contact' },
      { mr: 'लोकेशन चर्चा', en: 'Location talk' },
      { mr: 'दुकान पाहणी', en: 'Shop visit' },
      { mr: 'मंजुरी', en: 'Approval' },
      { mr: 'करार', en: 'Agreement' },
      { mr: 'दुकान सेटअप', en: 'Shop setup' },
      { mr: 'सुरुवातीचा माल', en: 'Initial stock' },
      { mr: 'उद्घाटन', en: 'Launch' },
    ],
    note: {
      mr: 'टीप: फ्रँचायझीमध्ये कोणत्याही नफ्याची किंवा उत्पन्नाची हमी दिली जात नाही. सर्व अटी व शर्ती फ्रँचायझी करारानुसार लागू.',
      en: 'Note: No profit or income is guaranteed under the franchise. All terms and conditions are as per the franchise agreement.',
    },
    blocks: [
      {
        title: { mr: 'आमच्याकडून सहाय्य', en: 'Support from us' },
        items: [
          { mr: 'संजीवनी ब्रँड नाव व बोर्ड', en: 'Sanjivani brand name and board' },
          { mr: 'नियमित माल पुरवठा', en: 'Regular stock supply' },
          { mr: 'दुकान सेटअप मार्गदर्शन', en: 'Shop setup guidance' },
          { mr: 'उत्पादन व विक्री प्रशिक्षण', en: 'Product and sales training' },
          { mr: 'पोस्टर, बॅनर व सोशल मीडिया मार्केटिंग सहाय्य', en: 'Posters, banners and social media support' },
        ],
      },
      {
        title: { mr: 'योग्य ठिकाणे', en: 'Ideal locations' },
        items: [
          { mr: 'मंदिर परिसर', en: 'Near temples' },
          { mr: 'बाजारपेठ व मुख्य रस्ता', en: 'Market areas and main roads' },
          { mr: 'तालुका व जिल्हा ठिकाणे', en: 'Taluka and district towns' },
          { mr: 'मोठी गावे', en: 'Large villages' },
        ],
      },
      {
        title: { mr: 'कोण अर्ज करू शकतो?', en: 'Who can apply?' },
        items: [
          { mr: 'नवीन व्यवसाय सुरू करू इच्छिणारे युवक-युवती', en: 'Young people starting a business' },
          { mr: 'महिला उद्योजिका व बचत गट', en: 'Women entrepreneurs and self-help groups' },
          { mr: 'सध्याचे किराणा / पूजा साहित्य दुकानदार', en: 'Existing kirana / puja shop owners' },
          { mr: 'वितरक व होलसेलर', en: 'Distributors and wholesalers' },
        ],
      },
    ],
    faq: FRANCHISE_FAQ,
    why: {
      eyebrow: { mr: 'आमचीच का?', en: 'Why Sanjivani?' },
      title: { mr: 'संजीवनीसोबत फ्रँचायझी का?', en: 'Why partner with Sanjivani?' },
      image: '/images/franchise-why-us.jpg',
      alt: {
        mr: 'आमचीच का: उत्तम दर्जाचा कच्चा माल, प्रभावी सुगंध, चांगली जळण्याची गुणवत्ता, आकर्षक किंमत, होलसेल व रिटेल दोन्हीसाठी योग्य, सातत्यपूर्ण गुणवत्ता, आकर्षक पॅकेजिंग, फ्रँचायझी व डीलर पार्टनरसाठी व्यवसायाची संधी आणि विश्वासार्ह भागीदारी.',
        en: 'Why us: quality raw material, lasting fragrance, good burning quality, attractive pricing, suited to wholesale and retail, consistent quality, attractive packaging, a business opportunity for franchise and dealer partners, and a reliable partnership.',
      },
    },
    outlets: {
      eyebrow: { mr: 'आमची आउटलेट्स', en: 'Our outlets' },
      title: { mr: 'संजीवनी आता तुमच्या जवळ', en: 'Sanjivani, now near you' },
      text: {
        mr: 'संजीवनीची सुरू झालेली दुकाने. भेट द्या, सुगंध अनुभवा आणि खरेदी करा.',
        en: 'Sanjivani shops that are already open. Visit, try the fragrances and shop.',
      },
      items: [
        {
          name: { mr: 'संजीवनी आउटलेट, टाकळी सिकंदर', en: 'Sanjivani Outlet, Takali Sikandar' },
          address: { mr: 'टाकळी सिकंदर, महाराष्ट्र', en: 'Takali Sikandar, Maharashtra' },
          photo: '/images/outlets/takali-sikandar.jpg',
          mapUrl: 'https://maps.google.com/?q=Takali+Sikandar+Maharashtra',
        },
      ],
    },
  },
  showcase: {
    eyebrow: { mr: '3D मध्ये जवळून पाहा', en: 'Up close, in 3D' },
    steps: [
      {
        k: { mr: 'प्रीमियम अगरबत्ती', en: 'Premium agarbatti' },
        h: { mr: 'मोगरा, गोल्ड-कॅप जारमध्ये', en: 'Mogra, in a gold-cap jar' },
        p: { mr: 'गोड व मोहक मोगऱ्याचा सुगंध. सुंदर जार, भेट देण्यासाठीही उत्तम.', en: 'Sweet, graceful jasmine. A handsome jar that also makes a good gift.' },
      },
      {
        k: { mr: 'प्रीमियम धूप स्टिक', en: 'Premium dhoop sticks' },
        h: { mr: 'चंदन धूप, बॉक्स पॅक', en: 'Chandan dhoop, boxed' },
        p: { mr: 'सौम्य व थंडावा देणारा चंदनाचा सुगंध, रोजच्या पूजेसाठी.', en: 'A soft, cooling sandalwood fragrance for daily puja.' },
      },
      {
        k: { mr: 'प्रीमियम अगरबत्ती', en: 'Premium agarbatti' },
        h: { mr: 'चंदन प्रीमियम जार', en: 'Sandalwood premium jar' },
        p: { mr: 'सौम्य चंदन सुगंधाची प्रीमियम अगरबत्ती, खास पूजा व सणांसाठी.', en: 'Premium agarbatti with a mild sandalwood fragrance, for special pujas and festivals.' },
      },
      {
        k: { mr: 'प्रीमियम धूप स्टिक', en: 'Premium dhoop sticks' },
        h: { mr: 'जास्वंद धूप स्टिक', en: 'Hibiscus dhoop sticks' },
        p: { mr: 'हलका व नैसर्गिक जास्वंदाचा सुगंध, देवी पूजेसाठी आवडता.', en: 'A light, natural hibiscus fragrance, a favourite for Devi puja.' },
      },
      {
        k: { mr: 'दैनंदिन अगरबत्ती', en: 'Daily agarbatti' },
        h: { mr: 'गुलाब, रोजच्या पूजेसाठी', en: 'Rose, for every day' },
        p: { mr: 'प्रसन्न व गोड गुलाबाचा सुगंध, सोयीच्या पाऊचमध्ये.', en: 'A cheerful, sweet rose fragrance in a handy pouch.' },
      },
    ],
  },
  gallery: {
    eyebrow: { mr: 'गॅलरी', en: 'Gallery' },
    title: { mr: 'आमची उत्पादने, जवळून', en: 'Our products, up close' },
    text: { mr: 'प्रत्येक फोटोखाली ते उत्पादन काय आहे आणि कशासाठी वापरतात ते दिले आहे.', en: 'Each photo says what the product is and what it is used for.' },
    photos: [
      {
        src: '/images/gallery/shop-front.jpg',
        title: { mr: 'संजीवनी दुकान, माळेवाडी-अकलूज', en: 'Sanjivani shop, Malewadi-Akluj' },
        text: { mr: 'आमचे दुकान, जिथे स्वतः तयार केलेली अगरबत्ती, धूप व पूजा साहित्य घाऊक व किरकोळ मिळते.', en: 'Our shop, selling our own agarbatti, dhoop and puja items wholesale and retail.' },
        wide: true,
        href: '',
      },
      {
        src: '/images/gallery/cup-dhoop-open.jpg',
        title: { mr: 'प्रीमियम कप धूप', en: 'Premium cup dhoop' },
        text: { mr: 'बहुरंगी कप धूपचा बॉक्स. थेट पेटवून पूजा, आरती व होमासाठी; एक कप २ तासांपेक्षा जास्त जळतो.', en: 'A box of multicolour dhoop cups. Light one directly for puja, aarti or havan; each burns for over 2 hours.' },
        href: '/products/cup-dhoop',
        wide: false,
      },
      {
        src: '/images/gallery/cup-dhoop-charcoal.jpg',
        title: { mr: 'कप धूप व कोळसा', en: 'Cup dhoop with charcoal' },
        text: { mr: 'कप धूपसोबत कोळशाचा रोल मिळतो.', en: 'Each cup dhoop pack comes with a charcoal roll.' },
        href: '/products/cup-dhoop',
        wide: false,
      },
      {
        src: '/images/gallery/cup-dhoop-closeup.jpg',
        title: { mr: 'कप धूप, जवळून', en: 'Cup dhoop, close up' },
        text: { mr: 'हर्बल/मसाला मिश्रण भरलेले लहान कप. धूर जास्त असल्याने मंदिर, दुकान व मोठ्या जागेसाठी उपयुक्त.', en: 'Small cups filled with a herbal/masala mix. More smoke, so they suit temples, shops and larger rooms.' },
        href: '/products/cup-dhoop',
        wide: false,
      },
      {
        src: '/images/gallery/premium-jar-mogra-2.jpg',
        title: { mr: 'मोगरा प्रीमियम जार', en: 'Mogra premium jar' },
        text: { mr: 'गोल्ड-कॅप जारमधील मोगरा अगरबत्ती. खास पूजा, सण व भेट देण्यासाठी.', en: 'Mogra agarbatti in a gold-cap jar, for special pujas, festivals and gifting.' },
        href: '/products/premium-mogra',
        wide: false,
      },
      {
        src: '/images/products/premium-jar-chandan.jpg',
        title: { mr: 'चंदन प्रीमियम जार', en: 'Chandan premium jar' },
        text: { mr: 'सौम्य चंदन सुगंधाची प्रीमियम अगरबत्ती, ध्यान व पूजेच्या वेळी लावण्यासाठी.', en: 'Premium agarbatti with a mild sandalwood fragrance, for puja and quiet moments.' },
        href: '/products/premium-chandan',
        wide: false,
      },
      {
        src: '/images/gallery/dhoop-jar-kewda-bel-pair.jpg',
        title: { mr: 'केवडा व बेल धूप जार', en: 'Kewda & Bel dhoop jars' },
        text: { mr: 'शिवपूजेसाठी विशेष केवडा व बेल सुगंधाची धूप कांडी.', en: 'Kewda and bel dhoop sticks, a favourite for Shiva puja.' },
        href: '/products/dhoop-jar-kewda-bel',
        wide: false,
      },
      {
        src: '/images/gallery/dhoop-jar-rui-pair.jpg',
        title: { mr: 'रुई धूप जार', en: 'Rui dhoop jars' },
        text: { mr: 'रुई वनस्पतीपासून तयार पारंपरिक सुगंधाची धूप कांडी, शिवपूजेसाठी.', en: 'Dhoop sticks made from the rui (aak) plant, with a traditional fragrance for Shiva puja.' },
        href: '/products/dhoop-jar-rui',
        wide: false,
      },
      {
        src: '/images/gallery/dhoop-jar-chandan-2.jpg',
        title: { mr: 'चंदन धूप जार', en: 'Chandan dhoop jar' },
        text: { mr: 'देवतेच्या चित्रासह जारमधील चंदन धूप कांडी, रोजची पूजा व आरतीसाठी.', en: 'Chandan dhoop sticks in a jar with a deity picture, for daily puja and aarti.' },
        href: '/products/dhoop-jar-chandan',
        wide: false,
      },
      {
        src: '/images/products/dhoop-box-mogra.jpg',
        title: { mr: 'मोगरा धूप स्टिक बॉक्स', en: 'Mogra dhoop stick box' },
        text: { mr: 'श्री स्वामी समर्थांच्या चित्रासह मोगरा प्रीमियम धूप स्टिक बॉक्स.', en: 'Mogra premium dhoop sticks in a box with a Shri Swami Samarth picture.' },
        href: '/products/dhoop-box-mogra',
        wide: false,
      },
      {
        src: '/images/gallery/dhoop-box-kewda-bel-2.jpg',
        title: { mr: 'केवडा व बेल धूप बॉक्स', en: 'Kewda & Bel dhoop box' },
        text: { mr: 'शिव-पार्वतीच्या चित्रासह केवडा व बेल धूप स्टिक बॉक्स.', en: 'Kewda and bel dhoop sticks in a box with a Shiva-Parvati picture.' },
        href: '/products/dhoop-box-kewda-bel',
        wide: false,
      },
      {
        src: '/images/products/pouch-jaswand.jpg',
        title: { mr: 'जास्वंद अगरबत्ती पाऊच', en: 'Jaswand agarbatti pouch' },
        text: { mr: 'हलक्या, नैसर्गिक जास्वंद सुगंधाची रोजच्या पूजेसाठी अगरबत्ती.', en: 'Daily-puja agarbatti with a light hibiscus fragrance.' },
        href: '/products/pouch-jaswand',
        wide: false,
      },
      {
        src: '/images/gallery/packet-denim-single.jpg',
        title: { mr: 'डेनिम अगरबत्ती पॅकेट', en: 'Denim agarbatti packet' },
        text: { mr: 'घर, ऑफिस व दुकानासाठी आधुनिक सुगंध, ₹५ पासूनच्या पॅकमध्ये.', en: 'A modern fragrance for home, office and shop, in packs from ₹5.' },
        href: '/products/packet-denim',
        wide: false,
      },
      {
        src: '/images/gallery/phulvat-2.jpg',
        title: { mr: 'फुलवात', en: 'Phulvat' },
        text: { mr: 'दिवा व निरांजनात तेल/तूप घालून लावण्यासाठी कापसाची फुलवात.', en: 'Cotton flower wicks for a diya or niranjan with oil or ghee.' },
        href: '/products/phulvat',
        wide: false,
      },
    ],
  },
  closing: {
    eyebrow: { mr: 'संजीवनी', en: 'Sanjivani' },
    title: { mr: 'आपल्या प्रत्येक पूजेसाठी…', en: 'For every puja of yours…' },
    highlight: { mr: 'संजीवनी सोबत!', en: 'with Sanjivani!' },
    text: { mr: 'तुमची ऑर्डर यादी बनवा आणि WhatsApp वर पाठवा. आम्ही किंमत व डिलिव्हरी कळवू.', en: 'Build your order list and send it on WhatsApp. We will confirm price and delivery.' },
  },
  about: {
    eyebrow: { mr: 'आमच्याविषयी', en: 'About us' },
    title: { mr: 'एकच दुकान, पूजा साहित्याची संपूर्ण दुनिया', en: 'One shop, a whole world of puja sahitya' },
    quote: '“आपल्या प्रत्येक पूजेसाठी… संजीवनी सोबत!”',
    text: {
      mr: 'पूजेपासून सण-समारंभापर्यंत लागणारे सर्व प्रकारचे पूजा साहित्य एकाच ठिकाणी, गुणवत्तेची खात्री आणि रास्त किमतीत. ग्रामीण व शहरी भागातील युवक-युवतींना आणि महिलांना स्वयंरोजगार व व्यवसायाची संधी देणे हा आमचा उद्देश आहे.',
      en: 'Everything needed from daily puja to festivals, in one place, with assured quality and fair prices. Our aim is to create self-employment and business opportunities for young people and women in rural and urban areas.',
    },
    mission: {
      eyebrow: { mr: 'ध्येय व उद्देश', en: 'Mission & objectives' },
      title: { mr: 'सुगंधाची सुंदर अनुभूती, प्रत्येक घरात', en: 'A beautiful experience of fragrance, in every home' },
      items: [
        { mr: 'ग्रामीण व शहरी युवक-युवतींना स्वयंरोजगाराची संधी', en: 'Self-employment for young people in villages and towns' },
        { mr: 'महिलांना व्यवसायात सहभागी होण्याची संधी', en: 'Business opportunities for women' },
        { mr: 'फ्रँचायझीधारकांना प्रशिक्षण व मार्गदर्शन', en: 'Training and guidance for franchisees' },
        { mr: 'प्रत्येक घरापर्यंत दर्जेदार पूजा साहित्य', en: 'Quality puja sahitya for every home' },
      ],
      image: '/images/brand/visiting-card.jpg',
    },
  },
  footer: {
    blurb: { mr: 'प्रार्थनेचा पवित्र सुगंध. माळेवाडी-अकलूज येथे तयार केलेली अगरबत्ती, धूप व पूजा साहित्य.', en: 'The sacred fragrance of prayer. Agarbatti, dhoop and puja sahitya made in Malewadi-Akluj.' },
    note: { mr: 'फ्रँचायझीमध्ये नफ्याची हमी नाही; अटी करारानुसार.', en: 'No profit is guaranteed under the franchise; terms as per agreement.' },
  },
};

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);

/** Deep-merges saved overrides over the defaults. Arrays are replaced as a whole. */
export function mergeContent<T>(base: T, over: unknown): T {
  if (!isObj(base) || !isObj(over)) {
    if (over === undefined || over === null) return base;
    if (Array.isArray(base)) return (Array.isArray(over) ? over : base) as T;
    return (typeof over === typeof base ? over : base) as T;
  }
  const out: Record<string, unknown> = { ...base };
  for (const k of Object.keys(base)) out[k] = mergeContent((base as Record<string, unknown>)[k], over[k]);
  return out as T;
}
