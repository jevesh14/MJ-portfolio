import http from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { Readable } from 'node:stream';
import { resolve, extname } from 'node:path';
import { pathToFileURL } from 'node:url';
import { accessResponse, privateHeaders } from './src/access.mjs';

const root = resolve('dist');
const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.woff2': 'font/woff2', '.pdf': 'application/pdf', '.mp4': 'video/mp4' };

export function createPortfolioServer() {
  return http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://127.0.0.1:' + req.socket.localPort);
      const options = { method: req.method, headers: req.headers };
      if (!['GET', 'HEAD'].includes(req.method)) { options.body = Readable.toWeb(req); options.duplex = 'half'; }
      const auth = await accessResponse(new Request(url, options));
      if (auth) {
        res.writeHead(auth.status, Object.fromEntries(auth.headers));
        if (auth.body) Readable.fromWeb(auth.body).pipe(res); else res.end();
        return;
      }
      if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405, { Allow: 'GET, HEAD', ...privateHeaders }); res.end(); return; }
      let path = decodeURIComponent(url.pathname);
      if (path.endsWith('/')) path += 'index.html';
      const file = resolve(root, '.' + path);
      if (!file.startsWith(root + '/')) throw new Error('Invalid path');
      const info = await stat(file);
      if (!info.isFile()) throw new Error('Not a file');
      const headers = { ...privateHeaders, 'Content-Type': mime[extname(file)] || 'application/octet-stream', 'Accept-Ranges': 'bytes' };
      const range = req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
      if (range) {
        const start = +range[1], end = range[2] ? Math.min(+range[2], info.size - 1) : info.size - 1;
        if (start >= info.size || end < start) { res.writeHead(416, { ...headers, 'Content-Range': `bytes */${info.size}` }); res.end(); return; }
        res.writeHead(206, { ...headers, 'Content-Range': `bytes ${start}-${end}/${info.size}`, 'Content-Length': end - start + 1 });
        if (req.method === 'HEAD') res.end(); else createReadStream(file, { start, end }).pipe(res);
      } else {
        res.writeHead(200, { ...headers, 'Content-Length': info.size });
        if (req.method === 'HEAD') res.end(); else createReadStream(file).pipe(res);
      }
    } catch {
      if (!res.headersSent) res.writeHead(404, privateHeaders);
      res.end('Not found');
    }
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const port = Number(process.env.PORT || 4173);
  createPortfolioServer().listen(port, '127.0.0.1', () => console.log(`Local: http://127.0.0.1:${port}`));
}
