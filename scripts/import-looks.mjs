/* ═══════════════════════════════════════════
   Import una tantum: look locali → Shopify (metaoggetti)
   ─────────────────────────────────────────
   Carica le foto di media/looks/look-NN/ su Shopify (File) e
   crea/aggiorna un metaoggetto `tato_look` per ogni look di
   TATO_LOOKS_LOCAL (products.js): number, images, items.
   Si può rilanciare: i look si aggiornano per handle (= numero)
   e le foto non vengono ricaricate se il look le ha già.

   USO (token Admin con write_files + write_metaobjects,
   NON va salvato nel progetto):
     SHOPIFY_ADMIN_TOKEN=shpat_… node scripts/import-looks.mjs [2-21]
   ═══════════════════════════════════════════ */
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = path.resolve(import.meta.dirname, '..');
const SHOP = 'pshgtp-ak.myshopify.com';
const API = '2026-10';
const TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;
if (!TOKEN) { console.error('Manca SHOPIFY_ADMIN_TOKEN'); process.exit(1); }

const [from, to] = (process.argv[2] || '1-99').split('-').map(Number);

async function gql(query, variables) {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(`https://${SHOP}/admin/api/${API}/graphql.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': TOKEN },
      body: JSON.stringify({ query, variables }),
    });
    const json = await res.json();
    const throttled = (json.errors || []).some(e => e.extensions && e.extensions.code === 'THROTTLED');
    if (throttled && attempt < 5) { await new Promise(r => setTimeout(r, 2000 * attempt)); continue; }
    if (json.errors) throw new Error(JSON.stringify(json.errors));
    return json.data;
  }
}
const userErrors = (where, errs) => {
  if (errs && errs.length) throw new Error(`${where}: ${errs.map(e => `${(e.field || []).join('.')} ${e.message}`).join('; ')}`);
};

/* Dati locali come li vede il sito (senza contenuti Shopify) */
const ctx = { window: {}, console };
for (const f of ['catalog-core.js', 'content-core.js', 'products.js']) {
  vm.runInNewContext(await readFile(path.join(ROOT, 'assets/js', f), 'utf8'), ctx, { filename: f });
}
const looks = ctx.window.TATO_CONTENT.current.looks.filter(l => l.number >= from && l.number <= to);

async function uploadImage(rel, alt) {
  const abs = path.join(ROOT, rel);
  const buf = await readFile(abs);
  const filename = rel.split('/').slice(-2).join('-');          // look-02-01.jpg (nome unico)
  const st = await gql(`mutation($input: [StagedUploadInput!]!) {
    stagedUploadsCreate(input: $input) { stagedTargets { url resourceUrl parameters { name value } } userErrors { field message } }
  }`, { input: [{ resource: 'IMAGE', filename, mimeType: 'image/jpeg', httpMethod: 'POST', fileSize: String((await stat(abs)).size) }] });
  userErrors('stagedUploadsCreate', st.stagedUploadsCreate.userErrors);
  const target = st.stagedUploadsCreate.stagedTargets[0];
  const form = new FormData();
  target.parameters.forEach(p => form.append(p.name, p.value));
  form.append('file', new Blob([buf], { type: 'image/jpeg' }), filename);
  const up = await fetch(target.url, { method: 'POST', body: form });
  if (!up.ok) throw new Error(`upload ${filename}: HTTP ${up.status}`);

  const fc = await gql(`mutation($files: [FileCreateInput!]!) {
    fileCreate(files: $files) { files { id } userErrors { field message } }
  }`, { files: [{ originalSource: target.resourceUrl, contentType: 'IMAGE', alt, filename }] });
  userErrors('fileCreate', fc.fileCreate.userErrors);
  const id = fc.fileCreate.files[0].id;

  for (let i = 0; i < 30; i++) {                                // attesa elaborazione
    const n = await gql(`query($id: ID!) { node(id: $id) { ... on MediaImage { fileStatus fileErrors { message } } } }`, { id });
    if (n.node.fileStatus === 'READY') return id;
    if (n.node.fileStatus === 'FAILED') throw new Error(`${filename}: ${JSON.stringify(n.node.fileErrors)}`);
    await new Promise(r => setTimeout(r, 1000));
  }
  throw new Error(`${filename}: elaborazione troppo lunga`);
}

for (const look of looks) {
  const handle = String(look.number);
  const ex = await gql(`query($h: MetaobjectHandleInput!) {
    metaobjectByHandle(handle: $h) { id field(key: "images") { value } }
  }`, { h: { type: 'tato_look', handle } });
  let images = [];
  try { images = JSON.parse((ex.metaobjectByHandle && ex.metaobjectByHandle.field && ex.metaobjectByHandle.field.value) || '[]'); } catch (_) {}

  if (images.length !== look.images.length) {
    images = [];
    for (let i = 0; i < look.images.length; i++) {
      images.push(await uploadImage(look.images[i], `TATO — Look ${look.number}, view ${i + 1} of ${look.images.length}`));
    }
  }
  const items = look.items.map(it => [it.name, it.comp, it.color].join(' | ')).join('\n');
  const r = await gql(`mutation($h: MetaobjectHandleInput!, $m: MetaobjectUpsertInput!) {
    metaobjectUpsert(handle: $h, metaobject: $m) { metaobject { id handle } userErrors { field message } }
  }`, { h: { type: 'tato_look', handle }, m: {
    fields: [
      { key: 'number', value: handle },
      { key: 'images', value: JSON.stringify(images) },
      { key: 'items', value: items },
    ],
    capabilities: { publishable: { status: 'ACTIVE' } },
  } });
  userErrors(`look ${handle}`, r.metaobjectUpsert.userErrors);
  console.log(`look ${handle}: ${images.length} foto, ${look.items.length} capi ✓`);
}
