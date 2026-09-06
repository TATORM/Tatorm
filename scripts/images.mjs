/* ═══════════════════════════════════════════
   TATO — pipeline immagini  (fase 02)
   ─────────────────────────────────────────
   Legge gli originali GIÀ nel repo:
     media/looks/**  media/home/**  media/products/**
   e genera accanto a ciascuno i derivati:
     <nome>-900.avif   <nome>-1440.avif
   L'originale (jpg/png) resta com'è: fa da <img> di fallback.
   AVIF copre ~95% dei browser, l'originale il resto → niente WebP.

   media/brand/ e assets/ NON vengono toccati (logo/icone).

   USO
     npm run images            — genera solo i mancanti
     npm run images -- --force — rigenera tutto
   ═══════════════════════════════════════════ */

import sharp from 'sharp';
import { readdir, mkdir, access, stat } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIRS = ['media/looks', 'media/home', 'media/products'];
const FORCE = process.argv.includes('--force');

const WIDTHS = [900, 1440];
const FORMATS = [
  ['avif', 'avif', { quality: 48 }],
];
const EXT_IN = new Set(['.jpg', '.jpeg', '.png']);
const IS_DERIVED = /-(?:900|1440)\.(?:avif|webp)$/;

async function* walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (EXT_IN.has(path.extname(e.name).toLowerCase()) && !IS_DERIVED.test(e.name)) {
      yield p;
    }
  }
}

const exists = (p) => access(p).then(() => true, () => false);

async function run() {
  let made = 0;
  let skipped = 0;
  let srcCount = 0;

  for (const rel of DIRS) {
    const abs = path.join(ROOT, rel);
    for await (const file of walk(abs)) {
      srcCount++;
      const dir = path.dirname(file);
      const base = path.basename(file, path.extname(file));
      const src = sharp(file, { failOn: 'none' }).rotate(); // applica EXIF orientation
      const meta = await src.metadata();

      for (const w of WIDTHS) {
        const width = Math.min(w, meta.width || w);
        for (const [fmt, ext, opts] of FORMATS) {
          const dest = path.join(dir, `${base}-${w}.${ext}`);
          if (!FORCE && (await exists(dest))) { skipped++; continue; }
          await src
            .clone()
            .resize({ width, withoutEnlargement: true })
            .toFormat(fmt, opts)
            .toFile(dest);
          made++;
        }
      }
    }
  }

  let total = 0;
  for (const rel of DIRS) {
    for await (const f of walkAll(path.join(ROOT, rel))) total += (await stat(f)).size;
  }
  console.log(`  Originali letti: ${srcCount}`);
  console.log(`  Derivati creati: ${made}  (saltati ${skipped})`);
  console.log(`  Peso media/looks+home+products: ${(total / 1048576).toFixed(1)} MB`);
}

async function* walkAll(dir) {
  let entries;
  try { entries = await readdir(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walkAll(p);
    else yield p;
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
