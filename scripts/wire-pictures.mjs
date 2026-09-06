/* ═══════════════════════════════════════════
   TATO — one-shot: <img> dei caroselli → <picture> AVIF
   ─────────────────────────────────────────
   Trasforma i 93 <img> statici dentro .carousel-slide in
   index.html aggiungendo la <source> AVIF (900/1440) e
   loading="lazy" — così le foto della Collection (~30 MB)
   non vengono scaricate finché non si apre la sezione.

   Idempotente: se trova già <picture> non fa nulla.
   Va ri-lanciato solo se cambiano le slide statiche.

     node scripts/wire-pictures.mjs
   ═══════════════════════════════════════════ */

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const HTML = path.join(import.meta.dirname, '..', 'index.html');
const SIZES = '(max-width: 768px) 100vw, min(700px, 36vw)';

const RE = /<img src="(media\/looks\/[^"]+)\.jpg" alt="" \/>/g;

const html = await readFile(HTML, 'utf8');
let n = 0;
const out = html.replace(RE, (_, base) => {
  n++;
  return (
    '<picture>' +
    `<source type="image/avif" srcset="${base}-900.avif 900w, ${base}-1440.avif 1440w" sizes="${SIZES}">` +
    `<img src="${base}.jpg" alt="" loading="lazy" decoding="async" draggable="false" />` +
    '</picture>'
  );
});

if (n === 0) {
  console.log('  Nessun <img> di carosello da convertire (già fatto?).');
} else {
  await writeFile(HTML, out);
  console.log(`  ${n} slide convertite in <picture> in index.html`);
}
