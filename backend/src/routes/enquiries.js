import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { Enquiry } from '../models/Enquiry.js';
import { parseEnquiry } from '../utils/validate.js';

const router = Router();

// Max 8 enquiries per IP per 15 minutes, to keep spam out of the inbox.
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 8, standardHeaders: 'draft-7', legacyHeaders: false });

function handler(type) {
  return async (req, res, next) => {
    try {
      // Honeypot: bots fill the hidden "website" field, people don't.
      if (req.body?.website) return res.status(201).json({ ok: true });
      const { data, errors } = parseEnquiry(type, req.body);
      if (Object.keys(errors).length) return res.status(400).json({ error: 'Validation failed', fields: errors });
      const doc = await Enquiry.create(data);
      // TODO: notify the owner (email via SMTP/Resend, or WhatsApp Cloud API) here.
      res.status(201).json({ ok: true, id: doc._id });
    } catch (e) {
      next(e);
    }
  };
}

router.post('/franchise', limiter, handler('franchise'));
router.post('/dealer', limiter, handler('dealer'));
router.post('/contact', limiter, handler('contact'));

export default router;
