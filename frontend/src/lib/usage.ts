import type { I18n, Product } from './types';

/**
 * Plain "how to use" steps per kind of product. These are general, everyday instructions for
 * lighting agarbatti, dhoop, camphor and wicks, not product claims.
 */
const AGARBATTI: I18n[] = [
  { mr: 'अगरबत्तीचे टोक ज्योतीवर धरून पेटवा.', en: 'Hold the tip in a flame to light it.' },
  { mr: 'ज्योत आल्यावर काही सेकंदांनी हलक्या हाताने विझवा; टोक लाल राहून सुगंधी धूर येईल.', en: 'After a few seconds, gently wave out the flame. The tip keeps glowing and gives fragrant smoke.' },
  { mr: 'अगरबत्ती स्टँडमध्ये उभी ठेवा, राख खाली ताटात पडेल अशी.', en: 'Stand it in a holder so the ash falls onto a plate.' },
];
const DHOOP: I18n[] = [
  { mr: 'धूप कांडीचे टोक पेटवा आणि ज्योत आल्यावर विझवा.', en: 'Light the tip of the dhoop stick and wave out the flame.' },
  { mr: 'धूप स्टँडवर किंवा धातू/मातीच्या ताटात आडवी किंवा उभी ठेवा.', en: 'Rest it on a dhoop stand or a metal or clay plate.' },
  { mr: 'कांडी पूर्ण जळेपर्यंत सुगंधी धूर देत राहते.', en: 'It keeps giving fragrant smoke until it burns down.' },
];
const CUP: I18n[] = [
  { mr: 'कपाचे वरचे टोक पेटवा.', en: 'Light the top of the cup.' },
  { mr: 'ज्योत विझवून धूर येऊ द्या.', en: 'Wave out the flame and let it smoke.' },
  { mr: 'धुपाटणे, धातूचे किंवा मातीचे ताट अशा उष्णता सहन करणाऱ्या जागी ठेवा.', en: 'Place it on something heat-safe, such as a dhoop holder or a metal or clay plate.' },
];
const KAPUR: I18n[] = [
  { mr: 'कापराची वडी आरतीच्या ताटात किंवा कापूरदाणीत ठेवा.', en: 'Place a camphor tablet on the aarti plate or in a camphor holder.' },
  { mr: 'काडेपेटी किंवा दिव्याने पेटवा; कापूर स्वतःच पूर्ण जळतो.', en: 'Light it with a match or a diya. Camphor burns away completely on its own.' },
];
const WICK: I18n[] = [
  { mr: 'दिव्यात / समईत तेल किंवा तूप घाला.', en: 'Pour oil or ghee into the diya or samai.' },
  { mr: 'वात तेलात थोडी भिजवा आणि टोक वर ठेवा.', en: 'Soak the wick a little and keep its tip above the oil.' },
  { mr: 'टोक पेटवा; गरजेनुसार वात थोडी पुढे सरकवा.', en: 'Light the tip, and push the wick up a little when needed.' },
];

export const SAFETY: I18n = {
  mr: 'लहान मुले, पडदे व ज्वलनशील वस्तूंपासून दूर ठेवा आणि जळत असताना लक्ष ठेवा.',
  en: 'Keep away from children, curtains and anything flammable, and never leave it burning unattended.',
};

export function howToUse(p: Product): I18n[] | null {
  if (p.category === 'daily' || p.category === 'premium') return AGARBATTI;
  if (p.category === 'dhoop') return DHOOP;
  if (p.category === 'cup') return CUP;
  if (p.slug === 'kapur') return KAPUR;
  if (p.slug === 'phulvat' || p.slug === 'samai-vat') return WICK;
  return null;
}
