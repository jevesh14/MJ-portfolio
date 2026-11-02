import test from 'node:test';
import assert from 'node:assert/strict';
import middleware from '../middleware.js';
import { accessConfig } from '../access-config.mjs';
import { accessResponse } from '../src/access.mjs';

const origin = 'https://portfolio.example';
function request(path = '/', options = {}) { return new Request(origin + path, options); }
function login(password, returnTo = '/', extra = {}) {
  return accessResponse(request('/_portfolio/unlock', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded', origin, ...extra }, body: new URLSearchParams({ password, returnTo }) }));
}

test('Only the initial homepage asks for a password', async () => {
  for (const path of ['/', '/index.html', '/_portfolio/unlock']) {
    const response = await middleware(request(path));
    assert.equal(response.status, 401, path);
    assert.equal(response.headers.get('x-middleware-next'), null);
    assert.match(response.headers.get('cache-control'), /no-store/);
    const html = await response.text();
    assert.match(html, /Welcome!/);
    assert.match(html, /learn more about me and my work/);
    assert.match(html, /Additional Information section/);
    assert.match(html, /type="password"/);
  }
});

test('Linked pages, PDFs, images, video ranges and styles open without authentication', async () => {
  for (const path of ['/my-projects.html', '/research.html', '/documents/ambugo-paper.pdf', '/images/portrait.webp', '/videos/ambugo.mp4', '/app.js', '/style.css', '/fonts/fonts.css']) {
    const response = await middleware(request(path));
    assert.equal(response.headers.get('x-middleware-next'), '1', path);
  }
  assert.equal(await accessResponse(request('/documents/ambugo-paper.pdf', { method: 'HEAD' })), null);
  assert.equal(await accessResponse(request('/videos/ambugo.mp4', { headers: { Range: 'bytes=0-100' } })), null);
  const head = await middleware(request('/', { method: 'HEAD' }));
  assert.equal(head.status, 401);
  assert.equal(await head.text(), '');
});

test('Wrong passwords, malformed cookies and the public verifier cannot unlock the site', async () => {
  const response = await login('incorrect-test-password');
  assert.equal(response.status, 401);
  assert.equal(response.headers.get('set-cookie'), null);
  assert.match(await response.text(), /incorrect/);
  for (const value of ['true', 'unlocked', accessConfig.verifier, 'A'.repeat(43), '%00']) {
    assert.equal((await accessResponse(request('/', { headers: { Cookie: '__Host-portfolio_access=' + value } }))).status, 401);
  }
});

test('Oversized bodies, cross-site submission and unsupported form types are rejected', async () => {
  assert.equal((await login('x', '/', { origin: 'https://other.example' })).status, 403);
  assert.equal((await login('x'.repeat(5000))).status, 413);
  assert.equal((await accessResponse(request('/_portfolio/unlock', { method: 'POST', body: 'password=x' }))).status, 400);
});

test('Return addresses are safely escaped in the password form', async () => {
  const response = await accessResponse(request('/?q=%22%3E%3Cscript%3E'));
  const html = await response.text();
  assert.doesNotMatch(html, /<script>/);
  assert.match(html, /name="returnTo"/);
});

test('Correct password unlocks the homepage and preserves the requested page', { skip: !process.env.PORTFOLIO_TEST_PASSWORD }, async () => {
  const response = await login(process.env.PORTFOLIO_TEST_PASSWORD, '/research.html#capstan');
  assert.equal(response.status, 303);
  assert.equal(response.headers.get('location'), '/research.html');
  const session = response.headers.get('set-cookie');
  assert.match(session, /HttpOnly/);
  assert.match(session, /Secure/);
  assert.match(session, /SameSite=Lax/);
  assert.equal(session.includes(process.env.PORTFOLIO_TEST_PASSWORD), false);
  for (const path of ['/', '/research.html', '/documents/ambugo-paper.pdf', '/videos/ambugo.mp4', '/app.js']) {
    const allowed = await middleware(request(path, { headers: { Cookie: session.split(';')[0] } }));
    assert.equal(allowed.headers.get('x-middleware-next'), '1', path);
    assert.match(allowed.headers.get('cache-control'), /no-store/);
  }
  for (const target of ['https://other.example', '//other.example', '/\\other.example', '/_portfolio/unlock']) {
    const redirect = await login(process.env.PORTFOLIO_TEST_PASSWORD, target);
    assert.equal(redirect.headers.get('location'), '/');
  }
});

test('Lock clears the authentication cookie and requests stay private', async () => {
  const response = await accessResponse(request('/_portfolio/lock'));
  assert.equal(response.status, 303);
  assert.match(response.headers.get('set-cookie'), /Max-Age=0/);
  const robots = await accessResponse(request('/robots.txt'));
  assert.match(await robots.text(), /Disallow: \//);
});
