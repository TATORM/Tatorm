/* ═══════════════════════════════════════════
   npm run content
   ─────────────────────────────────────────
   Scarica da Shopify collezioni e look (metaoggetti
   tato_collection / tato_look) e le Pagine (About, info),
   e scrive assets/js/content-snapshot.js: i contenuti
   editoriali inclusi nel sito (vedi content-core.js).

   Le due parti sono indipendenti: se una non risponde
   (o il token non ha il permesso) resta la copia
   precedente di quella parte e la build prosegue.
   Flag --strict → esce con 1 se una parte fallisce.
   Stampa un controllo dei contenuti (look senza foto,
   capi che non corrispondono a un prodotto…).
   ═══════════════════════════════════════════ */
import { writeFile, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'assets/js/content-snapshot.js');
const strict = process.argv.includes('--strict');

await import(path.join(ROOT, 'assets/js/catalog-core.js'));
await import(path.join(ROOT, 'assets/js/content-core.js'));
const core = globalThis.TATO_contentCore;
const cfg = globalThis.TATO_SHOPIFY;

/* Permessi del token Storefront che servono (canale Headless) */
const SCOPE_HINT = {
  unauthenticated_read_metaobjects: 'Metaobjects (lettura)',
  unauthenticated_read_content: 'Contenuti / Pagine (lettura)',
};

async function gql(query, attempt = 1) {
  try {
    const res = await fetch(`https://${cfg.domain}/api/${cfg.apiVersion}/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': cfg.storefrontToken,
      },
      body: JSON.stringify({ query }),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const json = await res.json();
    if (json.errors && json.errors.length) {
      const denied = json.errors.find(e => e.extensions && e.extensions.code === 'ACCESS_DENIED');
      if (denied) {
        const scope = (String(denied.extensions.requiredAccess || '').match(/`([^`]+)`/) || [])[1];
        const err = new Error(`il token Storefront non ha il permesso "${SCOPE_HINT[scope] || scope}"`);
        err.noRetry = true;
        throw err;
      }
      throw new Error(json.errors.map(e => e.message).join('; '));
    }
    return json.data;
  } catch (e) {
    if (!e.noRetry && attempt < 3) return gql(query, attempt + 1);
    throw e;
  }
}

let prev = {};
let prevText = '';
try {
  prevText = await readFile(OUT, 'utf8');
  const ctx = { window: {} };
  vm.runInNewContext(prevText, ctx);
  prev = ctx.window.TATO_CONTENT_SNAPSHOT || {};
} catch (_) {}

let failed = 0;
async function part(name, query, take) {
  try {
    return take(await gql(query));
  } catch (e) {
    failed++;
    console.warn(`[content] ${name}: ${e.message} → tengo la copia esistente.`);
    return prev[name] == null ? null : prev[name];
  }
}

const collections = await part('collections', core.COLLECTIONS_QUERY, d => d.metaobjects.nodes);
const pages = await part('pages', core.PAGES_QUERY, d => d.pages.nodes);

/* Controllo dei contenuti */
const issues = {};
const warn = (where, msg) => { (issues[where] = issues[where] || []).push(msg); };
const content = core.buildContent({ collections, pages }, null, warn);
const ctx = { window: {} };
for (const f of ['catalog-core.js', 'catalog-snapshot.js']) {
  vm.runInNewContext(await readFile(path.join(ROOT, 'assets/js', f), 'utf8'), ctx);
}
const names = new Set(((ctx.window.TATO_CATALOG_SNAPSHOT || {}).nodes || []).map(n => String(n.title).trim().toUpperCase()));
const archive = new Set();   // capi non in vendita: normale, si elencano in una riga sola
for (const c of content.collections) {
  for (const l of c.looks) {
    for (const it of l.items) if (!names.has(it.name.toUpperCase())) archive.add(it.name.toUpperCase());
  }
}

const body = `/* GENERATO da scripts/fetch-content.mjs — non modificare a mano.
   Contenuti editoriali da Shopify al momento della build. */
window.TATO_CONTENT_SNAPSHOT = ${JSON.stringify({ fetchedAt: new Date().toISOString(), collections, pages })};
`;
const strip = s => s.replace(/"fetchedAt":\s*"[^"]*"/, '');
const same = strip(prevText) === strip(body);
if (!same) await writeFile(OUT, body);

const nLooks = content.collections.reduce((s, c) => s + c.looks.length, 0);
console.log(`[content] ${content.collections.length} collezioni (${nLooks} look), ${Object.keys(content.pages).length} pagine${same ? ' (invariato)' : ' → content-snapshot.js aggiornato'}`);
if (!content.collections.length) console.log('[content] Nessuna collezione su Shopify → il sito usa i look locali.');
if (archive.size) console.log(`[content] "Archive piece" (nome diverso da ogni prodotto in vendita): ${[...archive].sort().join(', ')}`);
const where = Object.keys(issues);
if (where.length) {
  console.log('[content] Da controllare su Shopify:');
  where.forEach(w => issues[w].forEach(m => console.log(`  • ${w}: ${m}`)));
}
if (strict && failed) process.exit(1);
