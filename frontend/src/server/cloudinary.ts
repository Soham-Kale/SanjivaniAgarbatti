import crypto from 'node:crypto';
import { env } from './env';

export const cloudinaryConfigured = () => Boolean(env.cloudinary.cloudName && env.cloudinary.apiKey && env.cloudinary.apiSecret);

export const ALLOWED_FORMATS = 'jpg,png,webp,avif';

/**
 * Signs a direct browser-to-Cloudinary upload. The photo never passes through our server
 * (Vercel limits request bodies to 4.5 MB); Cloudinary checks the signature, folder and formats.
 */
export function signUpload() {
  const { cloudName, apiKey, apiSecret, folder } = env.cloudinary;
  const timestamp = Math.floor(Date.now() / 1000);
  // Parameters in alphabetical order, joined with &, followed by the API secret.
  const toSign = `allowed_formats=${ALLOWED_FORMATS}&folder=${folder}&timestamp=${timestamp}`;
  const signature = crypto.createHash('sha1').update(toSign + apiSecret).digest('hex');
  return { cloudName, apiKey, timestamp, folder, allowedFormats: ALLOWED_FORMATS, signature };
}
