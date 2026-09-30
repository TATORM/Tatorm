import { shopGrid, shopTitleEl } from './dom.js';
import { pgridHTML } from './grid.js';
import { state } from './state.js';
import { activeCount, applyFilters, initFilters, openFilters, readFilters } from './filters.js';
import { WISHLIST_EVENT, savedProducts } from './wishlist.js';

/* ═══════════════════════════════════════════
   SHOP + PDP — prodotti singoli
   ─────────────────────────────────────────
   Dati: window.TATO_PRODUCTS (data/products.js)
   Route hash:
     #shop                       → New Arrivals (tutto)
     #shop/women · #shop/men     → reparto, tutte le categorie
     #shop/women/<cat> · …/men/… → reparto + categoria
     #shop/accessories           → accessori (no genere)
     #shop/<cat>                  → New Arrivals filtrato per categoria
     #product/<slug>             → scheda prodotto
   Foto: se colore.images è vuoto → foto dei look (lookRefs)
   ═══════════════════════════════════════════ */
export const PRODUCTS    = window.TATO_PRODUCTS    || [];
export const CATEGORIES  = window.TATO_CATEGORIES  || [];
/* ─── SHOP: titolo sezione ───────────────────
   Le categorie si scelgono dal menu (Women▸ / Men▸),
   non c'è più la barra filtri sulla pagina: il titolo
   riporta reparto + categoria attiva.               */
export function renderShopHead() {
  if (!shopTitleEl) return;
  const scopeLabel =
    state.shopScope === 'women'         ? 'Women'
    : state.shopScope === 'men'         ? 'Men'
    : state.shopScope === 'accessories' ? 'Accessories'
    : state.shopScope === 'wishlist'    ? 'Wishlist'
    : 'New Arrivals';
  const cat = (state.shopCategory && state.shopCategory !== 'all')
    ? window.TATO_getCategoryLabel(state.shopCategory)
    : '';
  shopTitleEl.textContent = cat ? `${scopeLabel} / ${cat}` : scopeLabel;
}

/* Pill categorie (solo mobile, via CSS): una riga scorrevole
   All · Women · Men · <categorie con prodotti nello scope> · Accessories.
   Le categorie mantengono lo scope attuale (#shop/women/pants…). */
export function renderShopPills() {
  const nav = document.getElementById('shop-pills');
  if (!nav) return;
  nav.hidden = state.shopScope === 'wishlist';
  if (nav.hidden) return;
  const g = (state.shopScope === 'women' || state.shopScope === 'men') ? state.shopScope : null;
  const inScope = p => p.category !== 'accessories' &&
    (!g || (p.genders || ['women', 'men']).includes(g));
  const cats = CATEGORIES.filter(c => PRODUCTS.some(p => inScope(p) && p.category === c.slug));
  const base = g ? `/shop/${g}` : '/shop';
  const pills = [
    { href: '/shop/',       label: 'All',   on: state.shopScope === 'new' && state.shopCategory === 'all' },
    { href: '/shop/women/', label: 'Women', on: state.shopScope === 'women' && state.shopCategory === 'all', scope: g === 'women' },
    { href: '/shop/men/',   label: 'Men',   on: state.shopScope === 'men' && state.shopCategory === 'all',   scope: g === 'men' },
    ...cats.map(c => ({ href: `${base}/${c.slug}/`, label: c.label,
      on: state.shopScope !== 'accessories' && state.shopCategory === c.slug })),
    { href: '/shop/accessories/', label: 'Accessories', on: state.shopScope === 'accessories' },
  ];
  nav.innerHTML = pills.map(x =>
    `<a class="shop-pill${x.on ? ' is-active' : x.scope ? ' is-scope' : ''}" href="${x.href}"${x.on ? ' aria-current="page"' : ''}>${x.label}</a>`
  ).join('');
  /* porta la pill attiva al centro della riga (solo scroll orizzontale) */
  const act = nav.querySelector('.is-active');
  if (act) nav.scrollLeft = act.offsetLeft - (nav.clientWidth - act.offsetWidth) / 2;
}

/* ─── SHOP: griglia prodotti ─────────────── */
export function shopFilteredProducts() {
  if (state.shopScope === 'wishlist') return savedProducts();
  let list = PRODUCTS.slice();
  if (state.shopScope === 'accessories') {
    return list.filter(p => p.category === 'accessories');
  }
  list = list.filter(p => p.category !== 'accessories');
  if (state.shopScope === 'women' || state.shopScope === 'men') {
    list = list.filter(p => (p.genders || ['women', 'men']).includes(state.shopScope));
  }
  if (state.shopCategory !== 'all') {
    list = list.filter(p => p.category === state.shopCategory);
  }
  return list;
}

export function renderShopGrid() {
  if (!shopGrid) return;
  const scope = shopFilteredProducts();
  const f = readFilters();
  const list = applyFilters(scope, f);
  shopGrid.className = 'pgrid';
  const wish = state.shopScope === 'wishlist';
  shopGrid.innerHTML = wish && !scope.length
    ? '<p class="pgrid-empty">Your wishlist is empty. <a href="/shop/">Discover the collection</a></p>'
    : list.length || !scope.length
      ? pgridHTML(list)
      : '<p class="pgrid-empty">No products match these filters.</p>';
  const count = document.getElementById('shop-count');
  if (count) count.textContent = list.length === 1 ? '1 product' : `${list.length} products`;
  const btn = document.getElementById('shop-filter-btn');
  if (btn) {
    const n = activeCount(f);
    btn.textContent = n ? `Filter & sort (${n})` : 'Filter & sort';
    btn.hidden = !scope.length || wish;
  }
}

/* "Filter & sort": apre il pannello con le opzioni della vista corrente */
export function initShopFilters() {
  initFilters(renderShopGrid);
  // togliendo un capo dalla pagina Wishlist la griglia si aggiorna
  document.addEventListener(WISHLIST_EVENT, () => {
    if (state.shopScope === 'wishlist' && document.getElementById('shop')?.classList.contains('active')) renderShopGrid();
  });
  document.getElementById('shop-filter-btn')
    ?.addEventListener('click', () => openFilters(shopFilteredProducts()));
}

export function renderShop() {
  renderShopHead();
  renderShopPills();
  renderShopGrid();
}
