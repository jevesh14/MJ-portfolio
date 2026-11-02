import { next } from '@vercel/functions';
import { accessResponse, privateHeaders } from './src/access.mjs';

// Covers pages and direct PDF, image and video requests.
export const config = { matcher: '/:path*' };

export default async function middleware(request) {
  return await accessResponse(request) || next({ headers: privateHeaders });
}
