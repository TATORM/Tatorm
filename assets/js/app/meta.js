/* ─── Meta per vista (title / description / canonical / OG) ──────
   Nota: essendo una SPA con hash routing su hosting statico, i
   crawler che NON eseguono JS vedono solo i meta di index.html.
   Questo aggiorna title/canonical per browser e crawler JS-capaci. */
import { t } from './i18n.js';
export const BASE_URL = 'https://www.tatorm.com/';
export function setMeta({ title, description, canonicalPath, ogImage }) {
  document.title = title ? `${t(title)} · TATO` : t('TATO · Independent Fashion. Designed in Rome, Made in Italy.');
  const set = (sel, attr, val) => { const n = document.head.querySelector(sel); if (n && val) n.setAttribute(attr, val); };
  if (description) {
    set('meta[name="description"]', 'content', description);
    set('meta[property="og:description"]', 'content', description);
    set('meta[name="twitter:description"]', 'content', description);
  }
  set('meta[property="og:title"]', 'content', document.title);
  set('meta[name="twitter:title"]', 'content', document.title);
  const url = BASE_URL + (canonicalPath ? canonicalPath.replace(/^\/+|\/+$/g, '') + '/' : '');
  set('link[rel="canonical"]', 'href', url);
  set('meta[property="og:url"]', 'content', url);
  if (ogImage) {
    const abs = ogImage.startsWith('http') ? ogImage : BASE_URL + ogImage.replace(/^\//, '');
    set('meta[property="og:image"]', 'content', abs);
    set('meta[name="twitter:image"]', 'content', abs);
  }
}

/* JSON-LD Product per la PDP (rimosso quando si esce dalla PDP) */
export function setProductJsonLd(p) {
  const old = document.getElementById('ld-product');
  if (old) old.remove();
  if (!p) return;
  const sh = window.TATO_shopify;
  const pd = sh && sh.ready ? sh.productData(p.slug) : null;
  const price = pd && pd.minPrice != null ? pd.minPrice : p.price;
  const cur = (pd && pd.currency) || p.currency || 'EUR';
  const avail = (sh && sh.ready && sh.soldOut(p.slug))
    ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock';
  const imgs = (pd && pd.images && pd.images.length) ? pd.images
    : (window.TATO_lookImages ? window.TATO_lookImages(p.lookRefs, { onePerLook: true, limit: 3 }).map(u => BASE_URL + u) : []);
  const data = {
    '@context': 'https://schema.org', '@type': 'Product',
    name: (pd && pd.title) || p.name,
    description: p.description,
    brand: { '@type': 'Brand', name: 'TATO' },
    image: imgs,
    offers: {
      '@type': 'Offer', priceCurrency: cur, price: String(price),
      availability: avail, url: BASE_URL + 'product/' + p.slug + '/',
    },
  };
  const s = document.createElement('script');
  s.type = 'application/ld+json';
  s.id = 'ld-product';
  s.textContent = JSON.stringify(data);
  document.head.appendChild(s);
}
