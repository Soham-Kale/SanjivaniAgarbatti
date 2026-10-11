const clean = (v, max = 300) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export function normaliseMobile(v) {
  const digits = String(v || '').replace(/\D/g, '');
  return digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits;
}

const PLANS = ['mini', 'franchise', 'warehouse'];

/** Returns { data, errors } for a public enquiry body. Only whitelisted fields are kept. */
export function parseEnquiry(type, body = {}) {
  const errors = {};
  const data = {
    type,
    name: clean(body.name, 120),
    mobile: normaliseMobile(body.mobile),
    city: clean(body.city, 120),
    message: clean(body.message, 2000),
  };
  if (data.name.length < 2) errors.name = 'नाव आवश्यक आहे';
  if (!/^[6-9]\d{9}$/.test(data.mobile)) errors.mobile = 'वैध १० अंकी मोबाईल नंबर टाका';

  if (type === 'franchise') {
    data.plan = PLANS.includes(body.plan) ? body.plan : '';
    data.hasShop = clean(body.hasShop, 60);
    data.investment = clean(body.investment, 60);
    if (!data.plan) errors.plan = 'प्लॅन निवडा';
    if (!data.city) errors.city = 'गाव / जिल्हा आवश्यक आहे';
  }
  if (type === 'dealer') {
    data.shopName = clean(body.shopName, 160);
    data.businessType = clean(body.businessType, 60);
    data.products = clean(body.products, 300);
    if (!data.city) errors.city = 'गाव / जिल्हा आवश्यक आहे';
  }
  if (type === 'order') {
    const items = Array.isArray(body.items) ? body.items.slice(0, 50) : [];
    data.items = items
      .map((it) => ({
        slug: clean(it?.slug, 80),
        name: clean(it?.name, 160),
        qty: Math.min(Math.max(Math.floor(Number(it?.qty) || 0), 0), 999),
      }))
      .filter((it) => it.slug && it.qty > 0);
    if (!data.items.length) errors.items = 'ऑर्डर यादी रिकामी आहे';
  }
  return { data, errors };
}
