/* ═══════════════════════════════════════════
   SHOP — filtri e ordinamento
   ─────────────────────────────────────────
   Pannello laterale (stile carrello) aperto da "Filter & sort".
   Stato nell'indirizzo, così una vista filtrata si condivide:
     ?size=1,2  &color=Black,Navy  &stock=1  &price=200-500  &sort=price-asc
   Le opzioni mostrate sono quelle presenti nella vista corrente
   (reparto/categoria), prima dei filtri.
   ═══════════════════════════════════════════ */
import { esc } from './utils.js';

export const SORTS = [
  { id: '',           label: 'Newest' },
  { id: 'price-asc',  label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
];
const PRICE_BANDS = [
  { id: '0-200',   label: 'Under €200',  min: 0,   max: 200 },
  { id: '200-500', label: '€200 – €500', min: 200, max: 500 },
  { id: '500+',    label: 'Over €500',   min: 500, max: Infinity },
];

const list = v => (v ? v.split(',').map(decodeURIComponent).filter(Boolean) : []);

export function readFilters() {
  const q = new URLSearchParams(location.search);
  return {
    size: list(q.get('size')),
    color: list(q.get('color')),
    stock: q.get('stock') === '1',
    price: PRICE_BANDS.some(b => b.id === q.get('price')) ? q.get('price') : '',
    sort: SORTS.some(s => s.id === q.get('sort')) ? q.get('sort') : '',
  };
}

function writeFilters(f) {
  // ordine fisso dei parametri: la stessa vista ha sempre lo stesso indirizzo;
  // eventuali altri parametri (utm…) restano in coda
  const old = new URLSearchParams(location.search);
  const q = new URLSearchParams();
  const set = (k, v) => { if (v) q.set(k, v); };
  set('size', f.size.join(','));
  set('color', f.color.join(','));
  set('stock', f.stock ? '1' : '');
  set('price', f.price);
  set('sort', f.sort);
  old.forEach((v, k) => { if (!['size', 'color', 'stock', 'price', 'sort'].includes(k)) q.append(k, v); });
  const qs = q.toString().replace(/%2C/g, ',');
  history.replaceState(null, '', location.pathname + (qs ? '?' + qs : ''));
}

export function activeCount(f) {
  return f.size.length + f.color.length + (f.stock ? 1 : 0) + (f.price ? 1 : 0);
}

/* ── dati Shopify (se pronti) ─────────────── */
const sh = () => (window.TATO_shopify && window.TATO_shopify.ready ? window.TATO_shopify : null);
function priceOf(p) {
  const pd = sh() && sh().productData(p.slug);
  return pd && pd.minPrice != null ? pd.minPrice : p.price;
}
function available(p, color, size) {
  const s = sh();
  return s ? s.variantAvailable(p.slug, color.name, size.label) : size.available !== false;
}

/* Un prodotto passa se esiste un suo colore (tra quelli scelti) con una
   taglia (tra quelle scelte), disponibile se "In stock" è attivo. */
function matches(p, f) {
  const colors = f.color.length ? p.colors.filter(c => f.color.includes(c.name)) : p.colors;
  if (!colors.length) return false;
  const okVariant = colors.some(c => c.sizes.some(s =>
    (!f.size.length || f.size.includes(s.label)) && (!f.stock || available(p, c, s))));
  if (!okVariant) return false;
  if (f.price) {
    const b = PRICE_BANDS.find(x => x.id === f.price);
    const pr = priceOf(p);
    if (pr == null || pr < b.min || pr >= b.max) return false;
  }
  return true;
}

export function applyFilters(products, f = readFilters()) {
  const out = products.filter(p => matches(p, f));
  if (f.sort === 'price-asc') out.sort((a, b) => priceOf(a) - priceOf(b));
  if (f.sort === 'price-desc') out.sort((a, b) => priceOf(b) - priceOf(a));
  return out;
}

/* Opzioni disponibili nella vista corrente */
function optionsFor(products) {
  const sizes = [], colors = new Map();
  products.forEach(p => p.colors.forEach(c => {
    if (!colors.has(c.name)) colors.set(c.name, c.hex);
    c.sizes.forEach(s => { if (!sizes.includes(s.label)) sizes.push(s.label); });
  }));
  sizes.sort((a, b) => (isNaN(a) ? 1 : 0) - (isNaN(b) ? 1 : 0) || Number(a) - Number(b) || a.localeCompare(b));
  const bands = PRICE_BANDS.filter(b => products.some(p => { const pr = priceOf(p); return pr >= b.min && pr < b.max; }));
  return { sizes, colors: [...colors].map(([name, hex]) => ({ name, hex })), bands };
}

/* ── pannello ─────────────────────────────── */
let drawer, overlay, scopeProducts = [], onChange = () => {};

function render() {
  const f = readFilters();
  const o = optionsFor(scopeProducts);
  const n = applyFilters(scopeProducts, f).length;
  const chip = (group, value, label, on) =>
    `<button type="button" class="filter-chip${on ? ' is-on' : ''}" data-group="${group}" data-value="${esc(value)}" aria-pressed="${on}">${label}</button>`;
  drawer.querySelector('.filter-body').innerHTML = `
    <fieldset class="filter-group"><legend>Sort by</legend>
      ${SORTS.map(s => chip('sort', s.id, s.label, f.sort === s.id)).join('')}
    </fieldset>
    ${o.sizes.length > 1 ? `<fieldset class="filter-group"><legend>Size</legend>
      ${o.sizes.map(s => chip('size', s, esc(s), f.size.includes(s))).join('')}
    </fieldset>` : ''}
    ${o.colors.length > 1 ? `<fieldset class="filter-group"><legend>Colour</legend>
      ${o.colors.map(c => chip('color', c.name,
        `<span class="filter-swatch" style="background:${c.hex}"></span>${esc(c.name)}`, f.color.includes(c.name))).join('')}
    </fieldset>` : ''}
    <fieldset class="filter-group"><legend>Availability</legend>
      ${chip('stock', '1', 'In stock only', f.stock)}
    </fieldset>
    ${o.bands.length > 1 ? `<fieldset class="filter-group"><legend>Price</legend>
      ${o.bands.map(b => chip('price', b.id, b.label, f.price === b.id)).join('')}
    </fieldset>` : ''}`;
  drawer.querySelector('#filter-apply').textContent = n === 1 ? 'Show 1 product' : `Show ${n} products`;
  drawer.querySelector('#filter-clear').hidden = !activeCount(f) && !f.sort;
}

function toggle(group, value) {
  const f = readFilters();
  if (group === 'size' || group === 'color') {
    const arr = f[group];
    const i = arr.indexOf(value);
    if (i >= 0) arr.splice(i, 1); else arr.push(value);
  } else if (group === 'stock') f.stock = !f.stock;
  else if (group === 'price') f.price = f.price === value ? '' : value;
  else if (group === 'sort') f.sort = value;
  writeFilters(f);
  render();
  onChange();
}

export function openFilters(products) {
  scopeProducts = products;
  render();
  drawer.classList.add('open');
  overlay.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
  drawer.querySelector('.cart-close').focus();
}

export function closeFilters() {
  drawer.classList.remove('open');
  overlay.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
  document.getElementById('shop-filter-btn')?.focus();
}

export function initFilters(changed) {
  onChange = changed;
  overlay = document.createElement('div');
  overlay.className = 'cart-overlay filter-overlay';
  drawer = document.createElement('div');
  drawer.className = 'cart-drawer filter-drawer';
  drawer.setAttribute('role', 'dialog');
  drawer.setAttribute('aria-modal', 'true');
  drawer.setAttribute('aria-label', 'Filter and sort');
  drawer.setAttribute('aria-hidden', 'true');
  drawer.innerHTML = `
    <div class="cart-drawer-header">
      <p class="cart-drawer-title">Filter &amp; sort</p>
      <button class="cart-close" type="button" aria-label="Close filters"></button>
    </div>
    <div class="cart-drawer-body filter-body"></div>
    <div class="cart-drawer-footer filter-footer">
      <button class="cart-checkout-btn" id="filter-apply" type="button">Show products</button>
      <button class="filter-clear" id="filter-clear" type="button">Clear all</button>
    </div>`;
  document.body.append(overlay, drawer);
  overlay.addEventListener('click', closeFilters);
  drawer.querySelector('.cart-close').addEventListener('click', closeFilters);
  drawer.querySelector('#filter-apply').addEventListener('click', closeFilters);
  drawer.querySelector('#filter-clear').addEventListener('click', () => {
    history.replaceState(null, '', location.pathname);
    render();
    onChange();
  });
  drawer.addEventListener('click', e => {
    const b = e.target.closest('.filter-chip');
    if (b) toggle(b.dataset.group, b.dataset.value);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) closeFilters();
  });
}

