/* ═══════════════════════════════════════════
   npm run catalog
   ─────────────────────────────────────────
   Scarica da Shopify tutti i prodotti attivi e scrive
   assets/js/catalog-snapshot.js: la copia del catalogo
   inclusa nel sito (prima pagina istantanea + fallback
   se Shopify non risponde). Il sito poi aggiorna prezzi,
   stock e prodotti dal vivo.

   Stampa anche un controllo di qualità dei dati Shopify
   (tag reparto, lavaggio, colori, immagini).
   Se Shopify non risponde NON sovrascrive la copia
   esistente ed esce con codice 0 (la build prosegue).
   Flag --strict → esce con 1 se Shopify non risponde.
   ═══════════════════════════════════════════ */
import { writeFile, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'assets/js/catalog-snapshot.js');
const strict = process.argv.includes('--strict');

await import(path.join(ROOT, 'assets/js/catalog-core.js'));
const core = globalThis.TATO_catalogCore;
const cfg = globalThis.TATO_SHOPIFY;

async function gql(variables, attempt = 1) {
  try {
    const res = await fetch(`https://${cfg.domain}/api/${cfg.apiVersion}/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': cfg.storefrontToken,
      },
      body: JSON.stringify({ query: core.CATALOG_QUERY, variables }),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const json = await res.json();
    if (json.errors && json.errors.length) throw new Error(json.errors.map(e => e.message).join('; '));
    return json.data.products;
  } catch (e) {
    if (attempt < 3) return gql(variables, attempt + 1);
    throw e;
  }
}

let nodes = [];
try {
  let after = null;
  do {
    const page = await gql({ after });
    nodes = nodes.concat(page.nodes);
    after = page.pageInfo.hasNextPage ? page.pageInfo.endCursor : null;
  } while (after);
} catch (e) {
  console.warn(`[catalog] Shopify non raggiungibile (${e.message}) → tengo la copia esistente.`);
  process.exit(strict ? 1 : 0);
}

/* Controllo qualità */
const issues = {};
core.buildCatalog(nodes, null, (handle, msg) => { (issues[handle] = issues[handle] || []).push(msg); });

const body = `/* GENERATO da scripts/fetch-catalog.mjs — non modificare a mano.
   Copia del catalogo Shopify al momento della build. */
window.TATO_CATALOG_SNAPSHOT = ${JSON.stringify({ fetchedAt: new Date().toISOString(), nodes })};
`;
let prev = '';
try { prev = await readFile(OUT, 'utf8'); } catch (_) {}
const strip = s => s.replace(/"fetchedAt":\s*"[^"]*"/, '');
if (strip(prev) !== strip(body)) await writeFile(OUT, body);

console.log(`[catalog] ${nodes.length} prodotti da Shopify${strip(prev) === strip(body) ? ' (invariato)' : ' → catalog-snapshot.js aggiornato'}`);
const handles = Object.keys(issues);
if (handles.length) {
  console.log(`[catalog] Da sistemare su Shopify (${handles.length} prodotti):`);
  handles.forEach(h => issues[h].forEach(m => console.log(`  • ${h}: ${m}`)));
}
