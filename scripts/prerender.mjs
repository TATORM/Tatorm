/* ═══════════════════════════════════════════
   Pagine per URL vero — chiamato da build.mjs
   ─────────────────────────────────────────
   Per ogni rotta nota (prodotti dalla copia del catalogo, shop,
   collection, about, pagine info) scrive _site/<rotta>/index.html:
   stesso index.html del sito, ma con title, description, canonical,
   Open Graph e (per i prodotti) JSON-LD Product propri. Così Google e
   le anteprime dei link (WhatsApp, Instagram, iMessage…) vedono il
   prodotto giusto senza eseguire JavaScript. Poi il sito si avvia
   normalmente e mostra la pagina di quel percorso.
   Scrive anche sitemap.xml con tutte le pagine indicizzabili.
   ═══════════════════════════════════════════ */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';

const BASE = 'https://www.tatorm.com/';
const INFO = {
  shipping: 'Shipping', returns: 'Returns & Refunds', faq: 'FAQ',
  privacy: 'Privacy Policy', cookies: 'Cookie Policy', terms: 'Terms of Sale',
};

const attr = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* Catalogo, categorie e look come li vede il browser */
async function loadSiteData(root) {
  const ctx = { window: {}, console };
  for (const f of ['catalog-core.js', 'catalog-snapshot.js', 'products.js']) {
    vm.runInNewContext(await readFile(path.join(root, 'assets/js', f), 'utf8'), ctx, { filename: f });
  }
  return ctx.window;
}

function setTag(html, re, replacement) {
  if (!re.test(html)) throw new Error('Tag non trovato in index.html: ' + re);
  return html.replace(re, replacement);
}

function withMeta(html, { title, description, url, image, type = 'website', robots, jsonLd, extra = '' }) {
  const t = attr(title), d = attr(description);
  html = setTag(html, /<title>[\s\S]*?<\/title>/, `<title>${t}</title>`);
  html = setTag(html, /<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${d}" />`);
  html = setTag(html, /<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${attr(url)}" />`);
  html = setTag(html, /<meta property="og:type" content="[^"]*" \/>/, `<meta property="og:type" content="${type}" />`);
  html = setTag(html, /<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${attr(url)}" />`);
  html = setTag(html, /<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${t}" />`);
  html = setTag(html, /<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${d}" />`);
  html = setTag(html, /<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${t}" />`);
  html = setTag(html, /<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${d}" />`);
  if (image) {
    html = setTag(html, /<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${attr(image)}" />`);
    html = setTag(html, /<meta name="twitter:image" content="[^"]*" \/>/, `<meta name="twitter:image" content="${attr(image)}" />`);
  }
  if (robots) html = setTag(html, /<meta name="robots" content="[^"]*" \/>/, `<meta name="robots" content="${robots}" />`);
  const ld = jsonLd
    ? `\n  <script type="application/ld+json" id="ld-product">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>`
    : '';
  return html.replace('</head>', `${extra}${ld}\n</head>`);
}

function productPage(p, node, fetchedAt) {
  const variants = (node && node.variants && node.variants.nodes) || [];
  const inStock = variants.some(v => v.availableForSale);
  const img = p.colors.map(c => c.images[0]).find(Boolean);
  const imgBig = img ? img + (img.includes('?') ? '&' : '?') + 'width=1200' : null;
  const description = `${p.name} — ${p.composition}. ${p.description}`.slice(0, 300);
  const url = `${BASE}product/${p.slug}/`;
  return {
    title: `${p.name} — TATO`,
    description,
    url,
    image: imgBig,
    type: 'product',
    extra: p.price != null
      ? `\n  <meta property="product:price:amount" content="${p.price}" />\n  <meta property="product:price:currency" content="${attr(p.currency)}" />`
      : '',
    jsonLd: {
      '@context': 'https://schema.org', '@type': 'Product',
      name: p.name, description: p.description,
      brand: { '@type': 'Brand', name: 'TATO' },
      image: p.colors.map(c => c.images[0]).filter(Boolean),
      material: p.composition || undefined,
      offers: {
        '@type': 'Offer', priceCurrency: p.currency, price: String(p.price), url,
        availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      },
    },
    lastmod: fetchedAt,
  };
}


export async function prerender({ root, out }) {
  const html = await readFile(path.join(out, 'index.html'), 'utf8');
  const W = await loadSiteData(root);
  const products = W.TATO_PRODUCTS;
  const nodes = (W.TATO_CATALOG_SNAPSHOT && W.TATO_CATALOG_SNAPSHOT.nodes) || [];
  const fetchedAt = ((W.TATO_CATALOG_SNAPSHOT && W.TATO_CATALOG_SNAPSHOT.fetchedAt) || new Date().toISOString()).slice(0, 10);
  const pages = [];   // { route, meta }

  const shop = (route, label) => {
    pages.push({ route, meta: {
      title: `${label} — TATO`,
      description: `Shop ${label} — TATO. Independent fashion, designed in Rome, made in Italy.`,
      url: `${BASE}${route}/`,
    } });
  };
  shop('shop', 'All');
  if (products.some(p => (p.badges || []).includes('New'))) shop('shop/new', 'New Arrivals');
  for (const c of W.TATO_CATEGORIES) {
    if (products.some(p => p.category === c.slug)) shop(`shop/${c.slug}`, c.label);
  }
  if (products.some(p => p.category === 'accessories')) shop('shop/accessories', 'Accessories');
  pages.push({ route: 'collection', meta: {
    title: 'Collection — TATO',
    description: 'The TATO collection — 21 looks. Designed in Rome, made in Italy.',
    url: `${BASE}collection/`,
  } });
  pages.push({ route: 'about', meta: {
    title: 'Contacts — TATO',
    description: 'Get in touch with TATO — general, press and sales enquiries.',
    url: `${BASE}about/`,
  } });
  pages.push({ route: 'wishlist', noindex: true, meta: {
    title: 'Wishlist — TATO', description: 'Your saved pieces — TATO.', url: `${BASE}wishlist/`, robots: 'noindex, follow',
  } });
  /* pagine info: contenuti ancora da fornire → non indicizzate finché non sono reali */
  for (const [k, t] of Object.entries(INFO)) {
    pages.push({ route: k, noindex: true, meta: {
      title: `${t} — TATO`, description: `${t} — TATO.`, url: `${BASE}${k}/`, robots: 'noindex, follow',
    } });
  }
  for (const p of products) {
    pages.push({ route: `product/${p.slug}`, meta: productPage(p, nodes.find(n => n.handle === p.slug), fetchedAt) });
  }

  for (const pg of pages) {
    const dir = path.join(out, pg.route);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, 'index.html'), withMeta(html, pg.meta));
  }

  const urls = [{ loc: BASE, priority: '1.0' }]
    .concat(pages.filter(p => !p.noindex).map(p => ({
      loc: p.meta.url,
      priority: p.route.startsWith('product/') ? '0.8' : '0.6',
      lastmod: p.meta.lastmod,
    })));
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Generata da scripts/prerender.mjs a ogni build: non modificare a mano. -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}<priority>${u.priority}</priority></url>`).join('\n')}
</urlset>
`;
  await writeFile(path.join(out, 'sitemap.xml'), sitemap);
  return { pages: pages.length, products: products.length };
}
