import { accessConfig } from '../access-config.mjs';
import { welcomeFontCSS } from './access-font.mjs';

const encoder = new TextEncoder();
export const privateHeaders = {
  'Cache-Control': 'private, no-store, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'Vercel-CDN-Cache-Control': 'no-store',
  'X-Robots-Tag': 'noindex, nofollow, noarchive',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'same-origin',
};

function escapeHTML(value) {
  return value.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

async function digest(value) {
  const bytes = await crypto.subtle.digest('SHA-256', encoder.encode(value));
  return Array.from(new Uint8Array(bytes), b => b.toString(16).padStart(2, '0')).join('');
}

function equal(a, b) {
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let i = 0; i < a.length; i++) difference |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return difference === 0;
}

async function passwordCredential(password) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: encoder.encode(accessConfig.salt), iterations: accessConfig.iterations, hash: 'SHA-256' }, key, 256);
  return btoa(String.fromCharCode(...new Uint8Array(bits))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function cookieName(url) {
  return url.protocol === 'https:' ? '__Host-portfolio_access' : 'portfolio_access';
}

function cookieValue(request, name) {
  for (const part of (request.headers.get('cookie') || '').split(';')) {
    const separator = part.indexOf('=');
    if (separator !== -1 && part.slice(0, separator).trim() === name) return part.slice(separator + 1).trim();
  }
  return '';
}

function safeReturn(value, origin) {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//') || /[\\\r\n]/.test(value)) return '/';
  const target = new URL(value, origin);
  if (target.origin !== origin || target.pathname.startsWith('/_portfolio/')) return '/';
  return target.pathname + target.search;
}

function cookie(url, credential, clear = false) {
  return `${cookieName(url)}=${credential}; Path=/; HttpOnly; SameSite=Lax${url.protocol === 'https:' ? '; Secure' : ''}${clear ? '; Max-Age=0' : ''}`;
}

function screen(returnTo, error = '') {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow"><meta name="theme-color" content="#011f5b">
<title>Welcome · Mrityunjay Gupta</title><link rel="icon" type="image/svg+xml" href="/favicon-mg.svg"><link rel="preload" href="/fonts/934aa932b4bc.woff2" as="font" type="font/ttf" crossorigin><link rel="stylesheet" href="/fonts/fonts.css">
<style>
${welcomeFontCSS}
:root{color-scheme:light;font-family:'EB Garamond',Georgia,serif;color:#011f5b;background:#fffefa}
*{box-sizing:border-box}body{margin:0;min-height:100svh;display:grid;grid-template-rows:auto 1fr auto}
header{padding:28px clamp(24px,6vw,88px);border-top:3px solid #990000;font-size:22px}
main{width:min(100% - 48px,460px);margin:auto;padding:48px 0 64px}
.lock{display:inline-flex;width:42px;height:42px;align-items:center;justify-content:center;margin-bottom:22px;border:1px solid #011f5b26;border-radius:50%}
h1{font-family:'Portfolio Welcome',Georgia,serif;font-synthesis:none;font-size:clamp(42px,7vw,56px);font-weight:600;line-height:1.04;letter-spacing:-.025em;margin:0 0 28px}
p{font-size:21px;line-height:1.45;margin:0 0 26px}.intro{color:#52617a}
label{display:block;font-size:19px;margin-bottom:8px}input,button{font:inherit;width:100%;min-height:54px;border-radius:3px}
input{font-size:23px;letter-spacing:.04em;background:#fff;border:1px solid #011f5b40;color:#011f5b;padding:11px 14px}
input:focus-visible{outline:2px solid #011f5b;outline-offset:3px}button{cursor:pointer;font-size:21px;background:#011f5b;color:#fffefa;border:1px solid #011f5b;padding:12px 20px;margin-top:2px}
button:hover{background:#082c6d}button:focus-visible{outline:2px solid #990000;outline-offset:4px}
.error{font-size:18px;line-height:1.3;min-height:24px;color:#990000;margin:9px 0 6px}
.note{font-size:18px;line-height:1.45;margin:24px 0 0;color:#68758a;border-top:1px solid #011f5b1a;padding-top:19px}
footer{padding:20px 24px;text-align:center;color:#68758a;font-size:15px}
@media(max-width:480px){header{padding-top:22px;font-size:20px}main{padding:32px 0 48px}}
</style></head><body><header>Mrityunjay Gupta</header><main>
<h1>Welcome!</h1>
<form action="/_portfolio/unlock" method="post"><input type="hidden" name="returnTo" value="${escapeHTML(returnTo)}">
<label for="password">Password</label><input id="password" name="password" type="password" autocomplete="current-password" required maxlength="256" aria-describedby="password-error password-note"${error ? ' aria-invalid="true"' : ''} autofocus>
<p class="error" id="password-error" role="alert">${escapeHTML(error)}</p><button type="submit">Explore my portfolio <span aria-hidden="true">↗</span></button>
</form><p class="note" id="password-note">The password is provided alongside the website link in the Additional Information section.</p>
</main><footer>Mrityunjay Gupta · Portfolio</footer></body></html>`;
}

function gate(request, returnTo, error = '', status = 401) {
  return new Response(request.method === 'HEAD' ? null : screen(returnTo, error), {
    status,
    headers: { ...privateHeaders, 'Content-Type': 'text/html; charset=utf-8', 'Content-Security-Policy': "default-src 'none'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; form-action 'self'; base-uri 'none'; frame-ancestors 'none'" },
  });
}

async function limitedBody(request) {
  const reader = request.body?.getReader();
  if (!reader) return '';
  const chunks = [];
  let length = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > 4096) { await reader.cancel(); return null; }
    chunks.push(value);
  }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return new TextDecoder().decode(bytes);
}

// Returns null only when the underlying portfolio file may be served.
// Vercel and the local preview use this same server-side access check.
export async function accessResponse(request) {
  const url = new URL(request.url);
  if (url.pathname === '/robots.txt') return new Response('User-agent: *\nDisallow: /\n', { headers: { ...privateHeaders, 'Content-Type': 'text/plain' } });
  if (/^\/fonts\/(?:fonts\.css|[a-f0-9]{12}\.woff2)$/.test(url.pathname) && ['GET', 'HEAD'].includes(request.method)) return null;
  if (url.pathname === '/_portfolio/lock') return new Response(null, { status: 303, headers: { ...privateHeaders, Location: '/', 'Set-Cookie': cookie(url, '', true) } });

  if (url.pathname === '/_portfolio/unlock' && request.method === 'POST') {
    const origin = request.headers.get('origin');
    if (origin && origin !== url.origin) return gate(request, '/', 'Please enter the password from this website.', 403);
    if (!request.headers.get('content-type')?.startsWith('application/x-www-form-urlencoded')) return gate(request, '/', 'Please use the password form.', 400);
    const body = await limitedBody(request);
    if (body === null) return gate(request, '/', 'Please enter a valid password.', 413);
    const form = new URLSearchParams(body);
    const returnTo = safeReturn(form.get('returnTo'), url.origin);
    const password = form.get('password') || '';
    if (!password || password.length > 256) return gate(request, returnTo, 'Please enter the password.');
    const credential = await passwordCredential(password);
    if (!equal(await digest(credential), accessConfig.verifier)) return gate(request, returnTo, 'That password is incorrect. Please try again.');
    return new Response(null, { status: 303, headers: { ...privateHeaders, Location: returnTo, 'Set-Cookie': cookie(url, credential) } });
  }

  // Only the initial homepage prompts for a password. Linked pages and files stay open.
  if (!['/', '/index.html', '/_portfolio/unlock'].includes(url.pathname)) return null;

  const credential = cookieValue(request, cookieName(url));
  if (/^[A-Za-z0-9_-]{43}$/.test(credential) && equal(await digest(credential), accessConfig.verifier)) return null;
  return gate(request, safeReturn(url.pathname + url.search, url.origin));
}
