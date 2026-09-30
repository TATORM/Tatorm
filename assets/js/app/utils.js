/* Utility condivise: immagini, escape, prezzi */

export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ═══════════════════════════════════════════
   <picture> con AVIF (900 / 1440) + originale come fallback.
   I derivati li genera scripts/images.mjs accanto all'originale:
     media/…/01.jpg  →  media/…/01-900.avif  media/…/01-1440.avif
   media/brand/* e assets/* NON hanno derivati → si degradano
   automaticamente al solo <img>.
   ═══════════════════════════════════════════ */
export const HAS_DERIVATIVES = /^media\/(looks|home)\//;

/* Foto prodotto dalla CDN Shopify: ridimensiona via ?width= e
   serve da sola WebP/AVIF in base al browser → niente derivati. */
export const IS_SHOPIFY_CDN = /^https:\/\/cdn\.shopify\.com\//;
export const CDN_WIDTHS = [480, 720, 900, 1200, 1600];
export function cdnUrl(src, w) {
  return src + (src.includes('?') ? '&' : '?') + 'width=' + w;
}
export function cdnSrcset(src) {
  return CDN_WIDTHS.map(w => `${cdnUrl(src, w)} ${w}w`).join(', ');
}

/* Testo esterno (Shopify, carrello salvato) → sicuro dentro HTML e attributi */
export function esc(v) {
  return String(v == null ? '' : v).replace(/[&<>"']/g, ch => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]
  ));
}

export function pictureHTML(src, opts) {
  opts = opts || {};
  const alt   = esc(opts.alt || '');
  src = esc(src);
  const cls   = opts.cls ? ` class="${opts.cls}"` : '';
  const sizes = opts.sizes || '100vw';
  const eager = !!opts.eager;
  const load  = eager ? 'eager' : 'lazy';
  const prio  = eager ? ' fetchpriority="high"' : '';
  const dims  = opts.width && opts.height
    ? ` width="${opts.width}" height="${opts.height}"` : '';
  if (IS_SHOPIFY_CDN.test(src)) {
    return `<img src="${cdnUrl(src, 900)}" srcset="${cdnSrcset(src)}" sizes="${sizes}" alt="${alt}"${cls} loading="${load}" decoding="async"${prio}${dims} draggable="false">`;
  }
  const img = `<img src="${src}" alt="${alt}"${cls} loading="${load}" decoding="async"${prio}${dims} draggable="false">`;
  if (!HAS_DERIVATIVES.test(src)) return img;
  const base = src.replace(/\.[^.]+$/, '');
  return `<picture>` +
    `<source type="image/avif" srcset="${base}-900.avif 900w, ${base}-1440.avif 1440w" sizes="${sizes}">` +
    img +
    `</picture>`;
}

/* Costruisce <picture> come nodi DOM (source PRIMA di img) così il
   browser non parte a scaricare l'<img src> jpg prima di valutare la
   <source> AVIF — succede sulle immagini eager iniettate via innerHTML. */
export function pictureEl(src, opts) {
  opts = opts || {};
  const pic = document.createElement('picture');
  if (HAS_DERIVATIVES.test(src)) {
    const base = src.replace(/\.[^.]+$/, '');
    const widths = opts.widths || [900, 1440];
    const s = document.createElement('source');
    s.type = 'image/avif';
    s.srcset = widths.map(w => `${base}-${w}.avif ${w}w`).join(', ');
    s.sizes = opts.sizes || '100vw';
    pic.appendChild(s);
  }
  const img = document.createElement('img');
  if (IS_SHOPIFY_CDN.test(src)) {
    img.srcset = cdnSrcset(src);
    img.sizes = opts.sizes || '100vw';
    src = cdnUrl(src, 900);
  }
  img.alt = opts.alt || '';
  img.decoding = 'async';
  img.draggable = false;
  if (opts.eager) { img.loading = 'eager'; img.fetchPriority = 'high'; }
  else img.loading = 'lazy';
  img.src = src;
  pic.appendChild(img);
  return pic;
}

export function isDesktopViewport() {
  return !window.matchMedia('(max-width: 768px)').matches;
}

export function money(price, currency) {
  return (currency === 'EUR' ? '€' : '') + price;
}
