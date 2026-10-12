/** Admin uploads live on the API server (/uploads/...); bundled images are served by Next. */
import { API_URL as API } from './api-url';

export function media(src: string): string {
  if (src && src.startsWith('/uploads/')) return `${API}${src}`;
  return src;
}
