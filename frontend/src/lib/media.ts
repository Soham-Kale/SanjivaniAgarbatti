/**
 * Image paths are used as stored: bundled images (/images/...), older admin uploads copied to
 * public/uploads (/uploads/...), and Cloudinary photos (https://res.cloudinary.com/...).
 */
export function media(src: string): string {
  return src;
}
