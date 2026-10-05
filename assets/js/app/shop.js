import { shopGrid, shopTitleEl } from './dom.js';
import { pgridHTML } from './grid.js';
import { state } from './state.js';
import { activeCount, applyFilters, initFilters, openFilters, readFilters } from './filters.js';
import { WISHLIST_EVENT, savedProducts } from './wishlist.js';

/* ═══════════════════════════════════════════
   SHOP — griglia prodotti
   ─────────────────────────────────────────
   Rotte:
     /shop/              All (tutto, accessori compresi)
     /shop/new/          New arrivals (tag Shopify `new`)
     /shop/<categoria>/  categoria (tailoring, pants… accessories)
     /wishlist/          capi salvati
   Women / Men = filtro "Department" (?dept=women), vedi filters.js.
   I vecchi /shop/women/<cat>/ diventano /shop/<cat>/?dept=women.
   ═══════════════════════════════════════════ */
export const PRODUCTS    = window.TATO_PRODUCTS    || [];
export const CATEGORIES  = window.TATO_CATEGORIES  || [];

const DEPT_LABEL = { women: 'Women', men: 'Men' };

/* Titolo: sezione (o categoria), preceduto dal reparto se filtrato */
export function renderShopHead() {
  if (!shopTitleEl) return;
  const base =
    state.shopScope === 'wishlist'      ? 'Wishlist'
    : state.shopScope === 'new'         ? 'New Arrivals'
    : state.shopScope === 'accessories' ? 'Accessories'
    : state.shopCategory !== 'all'      ? window.TATO_getCategoryLabel(state.shopCategory)
    : 'All';
  const dept = state.shopScope !== 'wishlist' && DEPT_LABEL[readFilters().dept];
  shopTitleEl.textContent = dept ? (base === 'All' ? dept : `${dept} / ${base}`) : base;
}

/* Pill: All · New arrivals · categorie con prodotti · Accessories.
   Il filtro reparto (?dept=) resta attivo passando da una pill all'altra. */
export function renderShopPills() {
  const nav = document.getElementById('shop-pills');
  if (!nav) return;
  nav.hidden = state.shopScope === 'wishlist';
  if (nav.hidden) return;
  const dept = readFilters().dept;
  const q = dept ? `?dept=${dept}` : '';
  const hasNew = PRODUCTS.some(p => (p.badges || []).includes('New'));
  const cats = CATEGORIES.filter(c => PRODUCTS.some(p => p.category === c.slug));
  const pills = [
    { href: '/shop/', label: 'All', on: state.shopScope === 'all' && state.shopCategory === 'all' },
    ...(hasNew ? [{ href: '/shop/new/', label: 'New arrivals', on: state.shopScope === 'new' }] : []),
    ...cats.map(c => ({ href: `/shop/${c.slug}/`, label: c.label, on: state.shopCategory === c.slug })),
    ...(PRODUCTS.some(p => p.category === 'accessories')
      ? [{ href: '/shop/accessories/', label: 'Accessories', on: state.shopScope === 'accessories' }] : []),
  ];
  nav.innerHTML = pills.map(x =>
    `<a class="shop-pill${x.on ? ' is-active' : ''}" href="${x.href}${q}"${x.on ? ' aria-current="page"' : ''}>${x.label}</a>`
  ).join('');
  /* porta la pill attiva al centro della riga (solo scroll orizzontale) */
  const act = nav.querySelector('.is-active');
  if (act) nav.scrollLeft = act.offsetLeft - (nav.clientWidth - act.offsetWidth) / 2;
}

/* ─── Prodotti della vista (prima dei filtri) ─ */
export function shopFilteredProducts() {
  if (state.shopScope === 'wishlist') return savedProducts();
  if (state.shopScope === 'new') return PRODUCTS.filter(p => (p.badges || []).includes('New'));
  if (state.shopScope === 'accessories') return PRODUCTS.filter(p => p.category === 'accessories');
  if (state.shopCategory !== 'all') return PRODUCTS.filter(p => p.category === state.shopCategory);
  return PRODUCTS.slice();
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
  initFilters(renderShop);   // il reparto cambia anche titolo e pill
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
