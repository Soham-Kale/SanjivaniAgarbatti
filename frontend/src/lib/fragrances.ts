import type { I18n } from './types';

export interface Fragrance {
  id: string;
  name: I18n;
  image: string;
  tint: number; // smoke colour in the 3D hero
  benefits: string[];
}

// Brochure benefit write-ups (Marathi) for each dhoop fragrance.
export const FRAGRANCES: Fragrance[] = [
  { id: 'chandan', name: { mr: 'चंदन', en: 'Sandalwood' }, image: '/images/products/dhoop-jar-chandan.jpg', tint: 0xffb46b,
    benefits: ['सौम्य व थंडावा देणारा, दीर्घकाळ टिकणारा सुगंध', 'ध्यान व योगासाठी मन शांत व एकाग्र करतो', 'घरातील दुर्गंधी दूर करून वातावरण स्वच्छ ठेवतो'] },
  { id: 'gulab', name: { mr: 'गुलाब', en: 'Rose' }, image: '/images/products/dhoop-jar-gulab.jpg', tint: 0xff7a8a,
    benefits: ['प्रसन्न व गोड सुगंध, सकारात्मक ऊर्जा', 'ध्यानासाठी उपयुक्त, मूड सुधारतो', 'देवपूजेत भक्तिभाव वाढवतो'] },
  { id: 'kasturi', name: { mr: 'कस्तुरी', en: 'Kasturi' }, image: '/images/products/premium-jar-kasturi.jpg', tint: 0xd99a5b,
    benefits: ['गाढ, उबदार आणि आकर्षक सुगंध', 'पूजा, ध्यानासाठी विशेष', 'तणाव कमी करून मन शांत करतो'] },
  { id: 'mogra', name: { mr: 'मोगरा', en: 'Mogra · Jasmine' }, image: '/images/products/dhoop-jar-mogra.jpg', tint: 0xfff1c9,
    benefits: ['गोड व मोहक, ताजातवाना सुगंध', 'मन शांत व प्रसन्न ठेवतो', 'रात्री वापरल्यास चांगली झोप'] },
  { id: 'jaswand', name: { mr: 'जास्वंद', en: 'Hibiscus' }, image: '/images/products/dhoop-box-jaswand.jpg', tint: 0xff5a4a,
    benefits: ['हलका व नैसर्गिक सुगंध', 'देवी पूजेसाठी शुभ मानला जातो', 'वातावरण ताजेतवाने ठेवतो'] },
  { id: 'chafa', name: { mr: 'चाफा', en: 'Champa' }, image: '/images/products/dhoop-box-chafa.jpg', tint: 0xffd27a,
    benefits: ['गोड व मऊ सुगंध', 'देवपूजा व धार्मिक विधींसाठी', 'सकारात्मक व आनंदी वातावरण'] },
  { id: 'kewda-bel', name: { mr: 'केवडा व बेल', en: 'Kewda & Bel' }, image: '/images/products/dhoop-box-kewda-bel.jpg', tint: 0xb8f0a0,
    benefits: ['ताजातवाना, थोडा तीव्र सुगंध', 'बेल भगवान शिवाला प्रिय', 'मनात शांतता व स्थैर्य'] },
  { id: 'rui', name: { mr: 'रुई', en: 'Rui · Aak' }, image: '/images/products/dhoop-box-rui.jpg', tint: 0xffa36b,
    benefits: ['रुई वनस्पतीपासून तयार', 'शिवपूजेसाठी विशेष वापर', 'कीटक दूर ठेवण्यास मदत'] },
];

export const FRAGRANCE_NAMES: Record<string, I18n> = {
  kewda: { mr: 'केवडा', en: 'Kewda' },
  chandan: { mr: 'चंदन', en: 'Sandalwood' },
  mogra: { mr: 'मोगरा', en: 'Mogra' },
  gulab: { mr: 'गुलाब', en: 'Rose' },
  kasturi: { mr: 'कस्तुरी', en: 'Kasturi' },
  champa: { mr: 'चंपा', en: 'Champa' },
  denim: { mr: 'डेनिम', en: 'Denim' },
  jaswand: { mr: 'जास्वंद', en: 'Hibiscus' },
  'kewda-bel': { mr: 'केवडा व बेल', en: 'Kewda & Bel' },
  chafa: { mr: 'चाफा', en: 'Chafa' },
  rui: { mr: 'रुई', en: 'Rui' },
};
