/* ═══════════════════════════════════════════
   TATO — pipeline immagini  (usata dalla fase 02)
   ─────────────────────────────────────────
   Sorgenti:  media/_src/**/<nome>.{jpg,jpeg,png}   (gitignored)
   Output:    media/<stesso percorso>/<nome>-<w>.{avif,webp,jpg}
              per ogni larghezza in WIDTHS

   USO
     npm run images            — genera i mancanti
     npm run images -- --force — rigenera tutto

   NB: in fase 00 questo script è predisposto ma non ancora
   invocato. Serve la cartella media/_src/ con gli originali.
   ═══════════════════════════════════════════ */

import sharp from 'sharp';
import { readdir, mkdir, access } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'media', '_src');
const OUT = path.join(ROOT, 'media');
const FORCE = process.argv.includes('--force');

const WIDTHS = [900, 1440];
const QUALITY = { avif: 50, webp: 72, jpeg: 78 };
const EXT_IN = new Set(['.jpg', '.jpeg', '.png']);

async function* walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return; // _src non esiste ancora
  }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (EXT_IN.has(path.extname(e.name).toLowerCase())) yield p;
  }
}

const exists = (p) => access(p).then(() => true, () => false);

async function run() {
  let count = 0;
  let skipped = 0;
  for await (const file of walk(SRC)) {
    const rel = path.relative(SRC, file);
    const dir = path.join(OUT, path.dirname(rel));
    const base = path.basename(rel, path.extname(rel));
    await mkdir(dir, { recursive: true });

    const meta = await sharp(file).metadata();
    for (const w of WIDTHS) {
      const width = Math.min(w, meta.width || w);
      for (const [fmt, ext] of [['avif', 'avif'], ['webp', 'webp'], ['jpeg', 'jpg']]) {
        const dest = path.join(dir, `${base}-${w}.${ext}`);
        if (!FORCE && (await exists(dest))) { skipped++; continue; }
        await sharp(file)
          .resize({ width, withoutEnlargement: true })
          .toFormat(fmt, { quality: QUALITY[fmt] })
          .toFile(dest);
        count++;
        console.log(`  ${path.relative(ROOT, dest)}`);
      }
    }
  }
  if (count === 0 && skipped === 0) {
    console.log('  Nessun originale in media/_src/. Niente da fare.');
  } else {
    console.log(`  Generati ${count}, saltati ${skipped}.`);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
