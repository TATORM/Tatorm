/* ═══════════════════════════════════════════
   TATO — build di produzione → _site/
   ─────────────────────────────────────────
   Produce in _site/ SOLO i file pubblici del sito
   (niente docs/, scripts/, archive/, sorgenti JS/CSS,
   package.json…). È la cartella che va online.

   1. esbuild bundla+minifica il JS  → _site/assets/dist/app-[hash].js
   2. esbuild bundla+minifica il CSS → _site/assets/dist/app-[hash].css
   3. copia index.html in _site/ riscrivendo i tag tra i marker
        <!-- build:css --> … <!-- /build:css -->
        <!-- build:js -->  … <!-- /build:js -->
   4. copia gli asset pubblici elencati in PUBLIC
   5. genera una pagina per ogni URL vero (/product/…/, /shop/…/)
      e sitemap.xml (scripts/prerender.mjs)

   USO
     npm run build     — genera _site/ (l'index.html del progetto non viene toccato)
     npm run preview   — serve _site/ su http://127.0.0.1:8001
   In locale per lavorare: `python3 -m http.server 8777` (sorgenti).
   ═══════════════════════════════════════════ */

import { build } from 'esbuild';
import { readFile, writeFile, rm, mkdir, cp, stat } from 'node:fs/promises';
import path from 'node:path';
import { prerender } from './prerender.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT_REL = '_site';
const OUT_ABS = path.join(ROOT, OUT_REL);
const DIST_REL = OUT_REL + '/assets/dist';
const HTML = path.join(ROOT, 'index.html');

/* Tutto ciò che va online oltre a index.html e al bundle.
   Un file nuovo che deve essere pubblico va aggiunto qui. */
const PUBLIC = [
  '404.html', '404.js', 'robots.txt', 'CNAME',
  'assets/fonts', 'assets/icons',
  'media/brand', 'media/home', 'media/looks',
];

const COMMON = {
  absWorkingDir: ROOT,
  bundle: true,
  minify: true,
  metafile: true,
  entryNames: 'app-[hash]',
  outdir: DIST_REL,
  logLevel: 'silent',
};

async function run() {
  await rm(OUT_ABS, { recursive: true, force: true });
  await mkdir(path.join(ROOT, DIST_REL), { recursive: true });

  const js = await build({
    ...COMMON,
    entryPoints: ['assets/js/main.js'],
    format: 'esm',
    target: ['es2019'],
    charset: 'utf8',
  });

  const css = await build({
    ...COMMON,
    entryPoints: ['assets/css/style.css'],
    loader: { '.css': 'css' },
    // I font referenziati da @font-face restano dove sono (assets/fonts/):
    // "esterni" per esbuild = non li tocca, il path relativo nel CSS
    // bundlato resta valido perché assets/dist/ e assets/css/ sono allo
    // stesso livello sotto assets/. Evita di doverli hashare e tenere
    // sincronizzato il <link rel=preload> in index.html con quel hash.
    external: ['*.woff', '*.woff2'],
  });

  const jsFile = pickOutput(js, '.js');
  const cssFile = pickOutput(css, '.css');

  const jsKB = kb(js, jsFile);
  const cssKB = kb(css, cssFile);
  console.log(`  JS   ${jsFile}  ${jsKB} KB`);
  console.log(`  CSS  ${cssFile}  ${cssKB} KB`);

  let html = await readFile(HTML, 'utf8');
  html = replaceBlock(html, 'build:css',
    `  <link rel="stylesheet" href="${href(cssFile)}" />`);
  html = replaceBlock(html, 'build:js',
    `  <script type="module" src="${href(jsFile)}"></script>`);
  await writeFile(path.join(OUT_ABS, 'index.html'), html);

  for (const rel of PUBLIC) {
    const src = path.join(ROOT, rel);
    try { await stat(src); } catch { throw new Error(`File pubblico mancante: ${rel}`); }
    await cp(src, path.join(OUT_ABS, rel), {
      recursive: true,
      filter: (f) => !path.basename(f).startsWith('.'),   // niente .DS_Store
    });
  }
  const pr = await prerender({ root: ROOT, out: OUT_ABS });
  console.log(`  ${pr.pages} pagine generate (${pr.products} prodotti) + sitemap.xml`);
  console.log(`  _site/ pronto (${PUBLIC.length + 1} voci pubbliche + bundle).`);
}

/* metafile.outputs: chiavi tipo "assets/dist/app-XXXXXXXX.js"
   già relative alla site-root → usabili come URL. */
function pickOutput(result, ext) {
  const hit = Object.keys(result.metafile.outputs).find(
    (f) => f.endsWith(ext) && !f.endsWith('.map'),
  );
  if (!hit) throw new Error(`Nessun output ${ext} da esbuild`);
  return hit.split(path.sep).join('/');
}

/* "_site/assets/dist/app-X.js" → "assets/dist/app-X.js" (URL relativo al sito) */
function href(file) {
  return file.slice(OUT_REL.length + 1);
}

function kb(result, file) {
  const key = Object.keys(result.metafile.outputs).find(
    (f) => f.split(path.sep).join('/') === file,
  );
  return (result.metafile.outputs[key].bytes / 1024).toFixed(1);
}

function replaceBlock(src, name, replacement) {
  const re = new RegExp(`(<!-- ${name} -->)[\\s\\S]*?(<!-- /${name} -->)`);
  if (!re.test(src)) {
    throw new Error(`Marker "${name}" non trovato in index.html`);
  }
  return src.replace(re, `$1\n${replacement}\n  $2`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
