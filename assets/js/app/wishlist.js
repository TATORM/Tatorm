/* ═══════════════════════════════════════════
   WISHLIST — capi salvati dal cliente
   ─────────────────────────────────────────
   Salvata nel browser (localStorage, sincronizzata tra schede).
   Segnalibro su card e PDP, icona con contatore nell'header,
   pagina /wishlist/ (griglia dello shop, vedi shop.js).
   Con l'account cliente Shopify potrà sincronizzarsi tra dispositivi.
   ═══════════════════════════════════════════ */
import { t } from './i18n.js';
export const WISHLIST_EVENT = 'tato:wishlist-change';
const KEY = 'tato-wishlist-v1';

function load() {
  try {
    const arr = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(arr) ? arr.filter(s => typeof s === 'string' && /^[a-z0-9-]+$/.test(s)) : [];
  } catch (_) { return []; }
}
let saved = load();

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch (_) {}
}

export const isSaved = slug => saved.includes(slug);

/* Salvati che esistono ancora nel catalogo, dal più recente */
export function savedProducts() {
  const all = window.TATO_PRODUCTS || [];
  return saved.slice().reverse().map(s => all.find(p => p.slug === s)).filter(Boolean);
}

const ICON = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"><path d="M6 3h12v18l-6-4.5L6 21z"/></svg>';

export function wishBtnHTML(slug, extra = '') {
  const on = isSaved(slug);
  return `<button type="button" class="wish-btn${extra ? ' ' + extra : ''}${on ? ' is-on' : ''}" data-wish="${slug}" aria-pressed="${on}" aria-label="${on ? t('Remove from wishlist') : t('Add to wishlist')}">${ICON}</button>`;
}

function sync() {
  document.querySelectorAll('[data-wish]').forEach(b => {
    const on = isSaved(b.dataset.wish);
    b.classList.toggle('is-on', on);
    b.setAttribute('aria-pressed', String(on));
    b.setAttribute('aria-label', on ? t('Remove from wishlist') : t('Add to wishlist'));
  });
  const n = savedProducts().length;
  const badge = document.getElementById('wish-badge');
  if (badge) { badge.textContent = n; badge.classList.toggle('hidden', n === 0); }
  document.dispatchEvent(new CustomEvent(WISHLIST_EVENT, { detail: { count: n } }));
}

export function toggleSaved(slug) {
  saved = isSaved(slug) ? saved.filter(s => s !== slug) : saved.concat(slug);
  save();
  sync();
}

export function initWishlist() {
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-wish]');
    if (!b) return;
    e.preventDefault();
    e.stopPropagation();
    toggleSaved(b.dataset.wish);
  });
  window.addEventListener('storage', e => { if (e.key === KEY) { saved = load(); sync(); } });
  document.addEventListener('tato:shopify-ready', sync);   // prodotti tolti → contatore giusto
  sync();
}
