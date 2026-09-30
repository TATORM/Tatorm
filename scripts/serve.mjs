/* ═══════════════════════════════════════════
   npm run dev — server locale per lavorare sui sorgenti
   ─────────────────────────────────────────
   http://localhost:8777  (porta: PORT=xxxx npm run dev)
   Serve la cartella del progetto con Cache-Control: no-store,
   così ogni ricarica prende i moduli JS/CSS appena modificati
   (con i moduli ES il browser altrimenti tiene in cache gli import).
   Le rotte del sito (/shop/…, /product/…) ricevono index.html: in
   sviluppo non ci sono le pagine generate dal build.

   DIR=_site → serve la build come l'hosting: file veri, altrimenti
   404.html con stato 404 (npm run preview, test Playwright).
   ═══════════════════════════════════════════ */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const PROJECT = path.resolve(import.meta.dirname, '..');
const ROOT = process.env.DIR ? path.resolve(PROJECT, process.env.DIR) : PROJECT;
const SPA_FALLBACK = !process.env.DIR;
const PORT = Number(process.env.PORT) || 8777;
const APP_ROOTS = ['shop', 'product', 'collection', 'about', 'wishlist',
  'shipping', 'returns', 'faq', 'privacy', 'cookies', 'terms'];
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.avif': 'image/avif', '.webp': 'image/webp',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml', '.md': 'text/plain; charset=utf-8',
};

createServer(async (req, res) => {
  try {
    let rel = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (rel.endsWith('/')) rel += 'index.html';
    let file = path.join(ROOT, rel);
    if (!file.startsWith(ROOT + path.sep)) { res.writeHead(403).end(); return; }
    let st = await stat(file).catch(() => null);
    if (st && st.isDirectory()) {                    // /shop/women → /shop/women/index.html
      file = path.join(file, 'index.html');
      st = await stat(file).catch(() => null);
    }
    if ((!st || !st.isFile()) && SPA_FALLBACK && APP_ROOTS.includes(rel.split('/')[1])) {
      file = path.join(ROOT, 'index.html');
      st = await stat(file).catch(() => null);
    }
    if (!st || !st.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(await readFile(path.join(ROOT, '404.html')).catch(() => 'Not found'));
      return;
    }
    res.writeHead(200, {
      'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    res.end(await readFile(file));
  } catch (e) {
    res.writeHead(500).end(String(e));
  }
}).listen(PORT, '127.0.0.1', () => {
  console.log(`TATO ${SPA_FALLBACK ? 'dev' : 'preview ' + process.env.DIR} → http://localhost:${PORT}`);
});
