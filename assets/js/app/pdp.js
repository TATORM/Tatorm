import { addToCart, openCart } from './cart.js';
import { pdpEl } from './dom.js';
import { pgridCardHTML } from './grid.js';
import { showSection } from './nav.js';
import { PRODUCTS } from './shop.js';
import { state } from './state.js';
import { esc, money, pictureHTML, shuffle } from './utils.js';

/* ─── PDP: scheda prodotto ─────────────────
   Shopify (window.TATO_shopify) è fonte autorevole per prezzo,
   compare-at, disponibilità taglie e stato sold-out quando `ready`.
   In assenza (offline / prefetch non finito) si usa il catalogo locale. */
export function renderPDP(slug) {
  const p = window.TATO_getProduct(slug);
  if (!p || !pdpEl) return false;

  if (state.pdp.slug !== slug) state.pdp = { slug, colorIdx: 0, size: null };
  const color = p.colors[state.pdp.colorIdx] || p.colors[0];

  const sh = window.TATO_shopify;
  const shReady = !!(sh && sh.ready);
  const soldOut = shReady && sh.soldOut(slug);
  const availColors = shReady ? sh.availableColors(slug) : null;

  let galleryImgs = (color.images && color.images.length) ? color.images.slice() : [];
  const galleryFlat = galleryImgs.length > 0;   // packshot flat vs foto dei look
  if (!galleryImgs.length && window.TATO_lookImages) {
    galleryImgs = window.TATO_lookImages(p.lookRefs, { onePerLook: true, limit: 8 });
  }
  const gallery = galleryImgs.length
    ? galleryImgs.map((src, i) => pictureHTML(src, {
        alt: `${p.name} — ${color.name}${galleryImgs.length > 1 ? ', view ' + (i + 1) : ''}`,
        cls: 'pdp-gallery-img',
        eager: i === 0,
        sizes: '(max-width: 768px) 50vw, min(900px, 60vw)',
      })).join('')
    : Array.from({ length: 3 }, () => '<span class="ph-block"></span>').join('');

  const swatches = p.colors.map((c, i) => {
    const cSold = availColors && !availColors[c.name];
    return `<button class="pdp-color${i === state.pdp.colorIdx ? ' selected' : ''}${cSold ? ' is-soldout' : ''}" data-idx="${i}" style="background:${c.hex}" aria-label="${esc(c.name)}${cSold ? ' — sold out' : ''}"></button>`;
  }).join('');

  const sizes = color.sizes.map(s => {
    const avail = shReady ? sh.variantAvailable(slug, color.name, s.label) : (s.available !== false);
    return `<button class="pdp-size${s.label === state.pdp.size ? ' selected' : ''}" data-size="${esc(s.label)}"${avail ? '' : ' disabled aria-disabled="true"'}>${esc(s.label)}</button>`;
  }).join('');
  const singleSize = color.sizes.length === 1 && /one size/i.test(color.sizes[0].label);

  /* Prezzo: variante selezionata → prezzo variante; altrimenti minimo prodotto */
  const vp = shReady && state.pdp.size ? sh.variantPrice(slug, color.name, state.pdp.size) : null;
  const pd = shReady ? sh.productData(slug) : null;
  const price   = vp && vp.price != null ? vp.price : (pd && pd.minPrice != null ? pd.minPrice : p.price);
  const compare = vp && vp.compareAt ? vp.compareAt : null;
  const cur     = (vp && vp.currency) || (pd && pd.currency) || p.currency || 'EUR';
  const priceHTML = compare && compare > price
    ? `<span class="pdp-price-sale">${money(price, cur)}</span> <span class="pdp-price-was">${money(compare, cur)}</span>`
    : money(price, cur);

  const ref = (p.id ? 'TATO-' + String(p.id).toUpperCase() : '').trim();
  const singleSizeLabel = singleSize ? color.sizes[0].label : null;

  /* opzioni della tendina taglia (native <select> = accessibile) */
  const sizeOptions = ['<option value="">Select a size</option>'].concat(
    color.sizes.map(s => {
      const avail = shReady ? sh.variantAvailable(slug, color.name, s.label) : (s.available !== false);
      return `<option value="${esc(s.label)}"${s.label === state.pdp.size ? ' selected' : ''}${avail ? '' : ' disabled'}>${esc(s.label)}${avail ? '' : ' — Sold out'}</option>`;
    })
  ).join('');

  const priceLabel = money(price, cur);
  const addLabel = soldOut ? 'Sold out'
    : `<span>Add to bag</span><span class="pdp-add-price">${compare && compare > price ? `<s>${money(compare, cur)}</s> ` : ''}${priceLabel}</span>`;

  /* "Complete the look": foto del 1° look di questo prodotto a sinistra,
     i capi consigliati (a catalogo) a destra. Sempre almeno 2 card:
     prima gli altri capi dei look del prodotto, poi si riempie con capi
     della stessa categoria e infine con altri prodotti. */
  const lookN = (p.lookRefs || [])[0];
  const relatedSlugs = [];
  (p.lookRefs || []).forEach(n => {
    const ld = window.TATO_resolveLook && window.TATO_resolveLook(n);
    if (!ld) return;
    ld.items.forEach(it => {
      if (it.slug && it.slug !== slug && relatedSlugs.indexOf(it.slug) === -1) {
        relatedSlugs.push(it.slug);
      }
    });
  });
  if (relatedSlugs.length < 2) {
    const others = (window.TATO_PRODUCTS || [])
      .filter(x => x.slug !== slug && relatedSlugs.indexOf(x.slug) === -1);
    const sameCat = others.filter(x => x.category === p.category);
    const rest    = others.filter(x => x.category !== p.category);
    sameCat.concat(rest).forEach(x => {
      if (relatedSlugs.length < 2) relatedSlugs.push(x.slug);
    });
  }
  const completeItems = relatedSlugs.slice(0, 3);
  const lookPhoto = lookN && window.TATO_lookImages
    ? window.TATO_lookImages([lookN], { onePerLook: true, limit: 1 })[0]
    : null;
  const completeHTML = completeItems.length ? `
    <section class="pdp-complete">
      <p class="pdp-complete-title">Complete the look</p>
      <div class="pdp-complete-row">
        ${lookPhoto ? `<div class="pdp-complete-look">${pictureHTML(lookPhoto, {
          alt: `Look ${lookN}`, sizes: '(max-width: 768px) 100vw, 48vw',
        })}</div>` : ''}
        <div class="pgrid pdp-complete-items" style="--n:${completeItems.length}">
          ${completeItems.map(s => pgridCardHTML(window.TATO_getProduct(s))).join('')}
        </div>
      </div>
    </section>` : '';

  pdpEl.innerHTML = `
    <div class="pdp-main">
      <div class="pdp-gallery${galleryFlat ? ' is-flat' : ''}">${gallery}</div>
      <div class="pdp-info">
        <button class="pdp-back" id="pdp-back">← Shop</button>

        <div class="pdp-head">
          <h1 class="pdp-name">${esc(p.name)}</h1>
        </div>
        <div class="pdp-subhead">
          <p class="pdp-material">${esc(p.composition)}</p>
          ${ref ? `<p class="pdp-ref">Ref. ${ref}</p>` : ''}
        </div>
        ${soldOut ? '<p class="pdp-soldout-tag">Sold out</p>' : ''}

        <p class="pdp-row-label">Colour</p>
        <div class="pdp-colors">${swatches}</div>
        <p class="pdp-color-name">${esc(color.name)}</p>

        ${singleSize ? `
        <p class="pdp-row-label">Size</p>
        <p class="pdp-size-single">OS</p>` : `
        <div class="pdp-size-row">
          <label class="pdp-row-label" for="pdp-size-select">Select the size</label>
          <button class="pdp-sizeguide-link" id="pdp-sizeguide" type="button">Size guide</button>
        </div>
        <div class="pdp-select-wrap">
          <select class="pdp-size-select" id="pdp-size-select" aria-describedby="pdp-size-hint">${sizeOptions}</select>
        </div>`}
        <p class="pdp-size-hint" id="pdp-size-hint"></p>

        <button class="pdp-add-btn" id="pdp-add"${soldOut ? ' disabled' : ''}>${addLabel}</button>
        <button class="pdp-express-btn" id="pdp-express"${soldOut ? ' disabled' : ''}>
          <span>Express checkout</span>
          <span class="pdp-pay-marks">PayPal · Apple Pay · Card</span>
        </button>

        <p class="pdp-delivery-note">Delivery estimate — to be configured</p>
        <p class="pdp-phone-note">Order by phone — number to be provided</p>

        <div class="pdp-tabs" role="tablist">
          <button class="pdp-tab active" data-tab="desc" role="tab" aria-selected="true">Description</button>
          <button class="pdp-tab" data-tab="fit" role="tab" aria-selected="false">Size &amp; fit</button>
          <button class="pdp-tab" data-tab="care" role="tab" aria-selected="false">Composition &amp; care</button>
          <button class="pdp-tab" data-tab="ship" role="tab" aria-selected="false">Shipping &amp; returns</button>
        </div>
        <div class="pdp-tab-panels">
          <div class="pdp-tab-panel active" data-panel="desc">
            <ul class="pdp-details">${(p.details && p.details.length ? p.details : [p.description])
              .map(t => `<li>${esc(t)}</li>`).join('')}</ul>
            ${lookN ? `<p class="pdp-seenin">Seen in ${(p.lookRefs || []).map(n => `<a href="#" data-look-ref="${n}">Look ${n}</a>`).join(', ')}</p>` : ''}
          </div>
          <div class="pdp-tab-panel" data-panel="fit">
            <p>${p.fit ? p.fit : 'Fit information to be provided.'}</p>
            ${p.model && p.model.height && p.model.wears ? `<p>Model is ${p.model.height} and wears size ${p.model.wears}.</p>` : ''}
            <p><button class="pdp-inline-link" id="pdp-sizeguide-2" type="button">Open size guide</button></p>
          </div>
          <div class="pdp-tab-panel" data-panel="care">
            <p>${esc(p.composition)}<br>${esc(p.care)}</p>
          </div>
          <div class="pdp-tab-panel" data-panel="ship">
            <p><a href="#shipping" data-section="shipping">Shipping information</a><br>
            <a href="#returns" data-section="returns">Returns &amp; refunds</a></p>
          </div>
        </div>
      </div>
    </div>
    ${completeHTML}
  `;

  /* ── handlers ── */
  const openGuide = () => window.TATO_openSizeGuide && window.TATO_openSizeGuide(p.category, p.name);
  pdpEl.querySelector('#pdp-sizeguide')?.addEventListener('click', openGuide);
  pdpEl.querySelector('#pdp-sizeguide-2')?.addEventListener('click', openGuide);

  pdpEl.querySelectorAll('[data-section]').forEach(a => {
    a.addEventListener('click', e => { e.preventDefault(); location.hash = '#' + a.dataset.section; });
  });

  pdpEl.querySelectorAll('.pdp-color').forEach(btn => {
    btn.addEventListener('click', () => {
      state.pdp.colorIdx = parseInt(btn.dataset.idx);
      state.pdp.size = null;
      renderPDP(slug);
    });
  });

  const priceEl = () => pdpEl.querySelector('.pdp-add-price');
  const sel = pdpEl.querySelector('#pdp-size-select');
  sel?.addEventListener('change', () => {
    state.pdp.size = sel.value || null;
    const hint = document.getElementById('pdp-size-hint');
    if (hint) { hint.textContent = ''; hint.classList.remove('error'); }
    const vp2 = shReady && state.pdp.size ? sh.variantPrice(slug, color.name, state.pdp.size) : null;
    if (vp2 && vp2.price != null && priceEl()) {
      priceEl().innerHTML = (vp2.compareAt && vp2.compareAt > vp2.price)
        ? `<s>${money(vp2.compareAt, vp2.currency)}</s> ${money(vp2.price, vp2.currency)}`
        : money(vp2.price, vp2.currency);
    }
  });

  pdpEl.querySelectorAll('.pdp-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      pdpEl.querySelectorAll('.pdp-tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      pdpEl.querySelectorAll('.pdp-tab-panel').forEach(pnl => pnl.classList.remove('active'));
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      pdpEl.querySelector(`.pdp-tab-panel[data-panel="${tab.dataset.tab}"]`)?.classList.add('active');
    });
  });

  document.getElementById('pdp-back')?.addEventListener('click', () => { location.hash = '#shop'; });

  pdpEl.querySelectorAll('[data-look-ref]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const n = parseInt(a.dataset.lookRef);
      showSection('collection');
      const target = document.querySelector(`.look-carousel[data-look="${n}"]`);
      if (target) setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 80);
    });
  });

  /* validazione condivisa add / express */
  function resolveSelection() {
    const hint = document.getElementById('pdp-size-hint');
    const chosenSize = singleSizeLabel || state.pdp.size;
    if (!chosenSize) {
      if (hint) { hint.textContent = 'Select a size'; hint.classList.add('error'); }
      return null;
    }
    const variantId = sh ? sh.variantId(slug, color.name, chosenSize) : null;
    if (shReady && (!variantId || !sh.variantAvailable(slug, color.name, chosenSize))) {
      if (hint) { hint.textContent = 'This option is not available'; hint.classList.add('error'); }
      return null;
    }
    const vpAdd = shReady ? sh.variantPrice(slug, color.name, chosenSize) : null;
    return {
      chosenSize, variantId,
      price: vpAdd && vpAdd.price != null ? vpAdd.price : (p.price || 0),
      currency: (vpAdd && vpAdd.currency) || p.currency || 'EUR',
    };
  }

  document.getElementById('pdp-add')?.addEventListener('click', () => {
    const btn = document.getElementById('pdp-add');
    if (!btn || btn.disabled) return;
    const s = resolveSelection();
    if (!s) return;
    addToCart({
      name: p.name, slug, price: s.price, currency: s.currency,
      look: window.TATO_getCategoryLabel(p.category),
      color: color.name, size: s.chosenSize, shopifyVariantId: s.variantId, qty: 1,
      image: galleryImgs[0] || '', imageFlat: galleryFlat,
    });
    const orig = btn.innerHTML;
    btn.textContent = 'Added';
    btn.disabled = true;
    btn.setAttribute('aria-busy', 'true');
    openCart();
    setTimeout(() => {
      btn.innerHTML = soldOut ? 'Sold out' : orig;
      btn.disabled = soldOut;
      btn.removeAttribute('aria-busy');
    }, 1400);
  });

  document.getElementById('pdp-express')?.addEventListener('click', async () => {
    const btn = document.getElementById('pdp-express');
    if (!btn || btn.disabled) return;
    if (!shReady) { const h = document.getElementById('pdp-size-hint'); if (h) { h.textContent = 'Checkout unavailable right now'; h.classList.add('error'); } return; }
    const s = resolveSelection();
    if (!s || !s.variantId) return;
    const orig = btn.innerHTML;
    btn.textContent = 'Redirecting…';
    btn.disabled = true;
    btn.setAttribute('aria-busy', 'true');
    try {
      const url = await sh.createCheckoutUrl([{ variantId: s.variantId, quantity: 1 }]);
      if (url) { window.location.href = url; return; }
      throw new Error('no url');
    } catch (e) {
      console.warn('[TATO] express checkout fallito:', e);
      btn.innerHTML = orig;
      btn.disabled = false;
      btn.removeAttribute('aria-busy');
      const h = document.getElementById('pdp-size-hint');
      if (h) { h.textContent = 'Checkout error — please retry'; h.classList.add('error'); }
    }
  });

  return true;
}

/* PDP di un prodotto che non c'è più: messaggio + qualche suggerimento */
export function renderPDPMissing() {
  if (!pdpEl) return;
  state.pdp = { slug: null, colorIdx: 0, size: null };
  const picks = shuffle(PRODUCTS.slice()).slice(0, 4);
  pdpEl.innerHTML = `
    <div class="pdp-missing">
      <button class="pdp-back" id="pdp-back">← Shop</button>
      <p class="pdp-missing-title">This piece is no longer available.</p>
      ${picks.length ? `<p class="pdp-missing-sub">You may also like</p>
      <div class="pgrid pdp-missing-grid">${picks.map(p => pgridCardHTML(p)).join('')}</div>` : ''}
    </div>`;
  document.getElementById('pdp-back')?.addEventListener('click', () => { location.hash = '#shop'; });
}

export function initSizeGuide() {
/* ═══════════════════════════════════════════
   SIZE GUIDE — sistema riusabile
   ─────────────────────────────────────────
   Una tabella per categoria merceologica. Le misure reali
   dei capi (cm) NON sono ancora fornite: le celle mostrano "—"
   e un avviso. Per popolarle: riempire TATO_SIZE_GUIDE[categoria].rows.
   ═══════════════════════════════════════════ */
(function sizeGuide() {
  const COLS = ['Chest', 'Waist', 'Length', 'Shoulder', 'Sleeve'];
  // sizes per categoria, dedotte dal catalogo
  function sizesFor(cat) {
    const set = new Set();
    (window.TATO_PRODUCTS || []).forEach(p => {
      if (p.category !== cat) return;
      (p.colors || []).forEach(c => (c.sizes || []).forEach(s => set.add(s.label)));
    });
    return Array.from(set);
  }
  // struttura aggiornabile: rows[label] = [chest, waist, length, shoulder, sleeve] in cm
  window.TATO_SIZE_GUIDE = window.TATO_SIZE_GUIDE || {};

  const overlay = document.createElement('div');
  overlay.className = 'sizeguide-overlay';
  overlay.hidden = true;
  overlay.innerHTML = `
    <div class="sizeguide" role="dialog" aria-modal="true" aria-labelledby="sizeguide-title">
      <button class="sizeguide-close" type="button" aria-label="Close size guide">×</button>
      <p class="sizeguide-title" id="sizeguide-title">Size guide</p>
      <div class="sizeguide-body"></div>
      <p class="sizeguide-note"></p>
      <p class="sizeguide-how">Measurements are garment measurements in centimetres, taken flat.</p>
    </div>`;
  document.body.appendChild(overlay);
  const panel = overlay.querySelector('.sizeguide');
  const body = overlay.querySelector('.sizeguide-body');
  const note = overlay.querySelector('.sizeguide-note');
  const titleEl = overlay.querySelector('#sizeguide-title');
  let lastFocus = null;

  function close() {
    overlay.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  overlay.querySelector('.sizeguide-close').addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !overlay.hidden) close(); });

  window.TATO_openSizeGuide = function (category, productName) {
    lastFocus = document.activeElement;
    const labels = sizesFor(category);
    titleEl.textContent = productName ? `Size guide — ${productName}` : 'Size guide';
    const guide = window.TATO_SIZE_GUIDE[category] || {};
    const rows = labels.map(lbl => {
      const vals = (guide.rows && guide.rows[lbl]) || [];
      const cells = COLS.map((_, i) => `<td>${vals[i] != null ? vals[i] : '—'}</td>`).join('');
      return `<tr><th scope="row">${lbl}</th>${cells}</tr>`;
    }).join('');
    body.innerHTML = labels.length
      ? `<div class="sizeguide-scroll"><table>
          <thead><tr><th scope="col">Size</th>${COLS.map(c => `<th scope="col">${c}</th>`).join('')}</tr></thead>
          <tbody>${rows}</tbody>
        </table></div>`
      : '<p>One size.</p>';
    const filled = guide.rows && Object.keys(guide.rows).length;
    note.textContent = filled ? '' : 'Garment measurements for this category are not available yet.';
    note.hidden = !!filled;
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    overlay.querySelector('.sizeguide-close').focus();
  };
})();
}
