import { esc, money, pictureHTML } from './utils.js';
import { wishBtnHTML } from './wishlist.js';

/* ═══════════════════════════════════════════
   GRIGLIA PRODOTTI condivisa (Shop + Home)
   Markup: .pgrid > a.pgrid-card
   ═══════════════════════════════════════════ */
/* Sorgente immagine di anteprima + se è un packshot flat (foto colore da Shopify) */
export function productImgSrc(p) {
  const c = p.colors && p.colors[0];
  if (c && c.images && c.images.length) return { src: c.images[0], flat: true };
  const look = window.TATO_lookImages
    ? window.TATO_lookImages(p.lookRefs, { onePerLook: true, limit: 1 })[0]
    : null;
  return { src: look || '', flat: false };
}

/* Seconda immagine mostrata al passaggio del mouse: la 2ª foto di quel
   colore su Shopify se c'è, altrimenti il capo indossato in un look DELLO
   STESSO COLORE (colore del capo nel look = colore della card). Nessun look
   con quel colore → nessuna seconda immagine (meglio che un colore diverso).
   Solo con mouse: su touch non esiste l'hover e sarebbe traffico sprecato. */
const CAN_HOVER = typeof matchMedia === 'function' && matchMedia('(hover: hover) and (pointer: fine)').matches;
const SAME = { bordeaux: 'burgundy' };          // nomi diversi per lo stesso colore
const colorKey = name => String(name || '').toLowerCase().split(/\s*[\/&]\s*/)
  .map(t => SAME[t.trim()] || t.trim()).filter(Boolean).sort().join('/');
function lookPhotoFor(p, colorName) {
  const want = colorKey(colorName);
  const looks = ((window.TATO_CONTENT && window.TATO_CONTENT.current) || {}).looks || [];
  const look = looks.find(l => l.items.some(it =>
    String(it.name).toUpperCase() === p.name && colorKey(it.color) === want));
  return look ? (look.photos || look.images)[0] || '' : '';
}
function hoverImgSrc(p, col) {
  const c = col || (p.colors && p.colors[0]);
  if (c && c.images && c.images[1]) return c.images[1];
  return c ? lookPhotoFor(p, c.name) : '';
}

/* colorIdx opzionale: card di una specifica variante colore
   (immagine + nome colore). Usata dalla Home per mostrare ogni colorway. */
export function pgridCardHTML(p, colorIdx) {
  const col = (colorIdx != null && p.colors && p.colors[colorIdx]) ? p.colors[colorIdx] : null;
  let img;
  if (col && col.images && col.images.length) img = { src: col.images[0], flat: true };
  else img = productImgSrc(p);

  const media = img.src
    ? pictureHTML(img.src, { alt: col ? `${p.name} — ${col.name}` : p.name, sizes: '(max-width: 768px) 50vw, 25vw' })
    : '<span class="ph-block"></span>';
  const alt = CAN_HOVER && img.flat ? hoverImgSrc(p, col) : '';
  const altMedia = alt && alt !== img.src
    ? `<span class="pgrid-alt" aria-hidden="true">${pictureHTML(alt, { alt: '', sizes: '(max-width: 1180px) 33vw, 25vw' })}</span>`
    : '';
  const badges = (p.badges || []).map(b => `<span class="pgrid-badge">${esc(b)}</span>`).join('');
  const sh = window.TATO_shopify;
  const shReady = !!(sh && sh.ready);
  const sold = col
    ? (shReady && sh.availableColors(p.slug) && !sh.availableColors(p.slug)[col.name])
    : (p.status === 'sold-out' || (shReady && sh.soldOut(p.slug)));
  const pd = shReady ? sh.productData(p.slug) : null;
  const price = pd && pd.minPrice != null ? pd.minPrice : p.price;
  const cur = (pd && pd.currency) || p.currency || 'EUR';
  /* Pallini di tutti i colori del prodotto, sempre — quello della card
     (colorIdx, sulle colorway della Home) evidenziato se presente. */
  const colorInfo = p.colors && p.colors.length > 1
    ? `<span class="pgrid-swatches">${p.colors.map((c, i) =>
        `<span class="pgrid-swatch${i === colorIdx ? ' is-active' : ''}" style="background:${c.hex}" aria-hidden="true"></span>`
      ).join('')}</span>`
    : '';
  return `<div class="pgrid-cell">
    <a class="pgrid-card${sold ? ' is-soldout' : ''}" href="/product/${p.slug}/" data-slug="${p.slug}">
      <span class="pgrid-media${img.flat ? ' is-flat' : ''}${altMedia ? ' has-alt' : ''}">
        ${media}
        ${altMedia}
        ${badges ? `<span class="pgrid-badges">${badges}</span>` : ''}
        ${sold ? '<span class="pgrid-soldout">Sold out</span>' : ''}
      </span>
      <span class="pgrid-name">${esc(p.name)}</span>
      <span class="pgrid-price">${money(price, cur)}</span>
      ${colorInfo}
    </a>
    ${wishBtnHTML(p.slug)}
  </div>`;
}

export function pgridHTML(list) {
  if (!list || !list.length) return '<p class="pgrid-empty">Coming soon.</p>';
  return list.map(p => pgridCardHTML(p)).join('');
}

/* Evita due card dello stesso prodotto adiacenti (best-effort) */
export function declusterBySlug(arr) {
  const out = arr.slice();
  for (let i = 1; i < out.length; i++) {
    if (out[i].p.slug !== out[i - 1].p.slug) continue;
    for (let j = i + 1; j < out.length; j++) {
      const okHere  = out[j].p.slug !== out[i - 1].p.slug;
      const okThere = j + 1 >= out.length || out[j + 1].p.slug !== out[i].p.slug;
      if (okHere && okThere) { [out[i], out[j]] = [out[j], out[i]]; break; }
    }
  }
  return out;
}
