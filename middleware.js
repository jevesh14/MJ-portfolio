import { next } from '@vercel/functions';
import { accessResponse, privateHeaders } from './src/access.mjs';

// The initial homepage is gated; linked pages, documents and media remain open.
export const config = { matcher: '/:path*' };

export default async function middleware(request) {
  return await accessResponse(request) || next({ headers: privateHeaders });
}
