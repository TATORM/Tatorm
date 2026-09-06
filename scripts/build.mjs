/* ═══════════════════════════════════════════
   TATO — build di produzione
   ─────────────────────────────────────────
   1. esbuild bundla+minifica il JS  → assets/dist/app-[hash].js
   2. esbuild bundla+minifica il CSS → assets/dist/app-[hash].css
   3. riscrive i tag <link>/<script> in index.html tra i marker:
        <!-- build:css --> … <!-- /build:css -->
        <!-- build:js -->  … <!-- /build:js -->

   USO
     npm run build          — genera dist/ e riscrive index.html IN PLACE
     npm run build -- --check — genera dist/ ma NON tocca index.html

   In locale usa `npm run dev` (serve i sorgenti così come sono).
   `npm run build` è pensato per la GitHub Action, che lavora su un
   checkout usa-e-getta: l'index.html riscritto viene deployato, mai
   ri-committato. Se lo lanci in locale e vuoi tornare indietro:
     git checkout -- index.html
   ═══════════════════════════════════════════ */

import { build } from 'esbuild';
import { readFile, writeFile, rm, mkdir } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST_REL = 'assets/dist';
const DIST_ABS = path.join(ROOT, DIST_REL);
const HTML = path.join(ROOT, 'index.html');
const CHECK_ONLY = process.argv.includes('--check');

/* Lo SDK Shopify da CDN resta un <script> a sé finché non lo
   sostituiamo con una fetch GraphQL diretta (fase 04). */
const SHOPIFY_SDK = 'https://sdks.shopifycdn.com/js-buy-sdk/v2/latest/index.umd.min.js';

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
  await rm(DIST_ABS, { recursive: true, force: true });
  await mkdir(DIST_ABS, { recursive: true });

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
  });

  const jsFile = pickOutput(js, '.js');
  const cssFile = pickOutput(css, '.css');

  const jsKB = kb(js, jsFile);
  const cssKB = kb(css, cssFile);
  console.log(`  JS   ${jsFile}  ${jsKB} KB`);
  console.log(`  CSS  ${cssFile}  ${cssKB} KB`);

  if (CHECK_ONLY) {
    console.log('  --check: index.html non modificato.');
    return;
  }

  let html = await readFile(HTML, 'utf8');
  html = replaceBlock(html, 'build:css',
    `  <link rel="stylesheet" href="${cssFile}" />`);
  html = replaceBlock(html, 'build:js',
    `  <script src="${SHOPIFY_SDK}"></script>\n` +
    `  <script type="module" src="${jsFile}"></script>`);
  await writeFile(HTML, html);
  console.log('  index.html riscritto (tag dist tra i marker).');
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
