import { t, tColor } from './i18n.js';
import { btnShop } from './dom.js';
import { esc, money, pictureHTML } from './utils.js';
import { go } from './url.js';

/* ─── Carrello ───────────────────────────────
   Righe unite per variante (slug|colore|taglia) con quantità.
   Persistito in localStorage; il carrello Shopify vero viene
   creato al checkout (cartCreate) dalle righe con variantId. */
export const CART_KEY = 'tato-cart-v1';
export let cart = loadCart();

export function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.filter(i => i && i.name && i.qty > 0) : [];
  } catch (_) { return []; }
}

export function saveCart() {
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (_) {}
}

export function lineKey(item) {
  return [item.slug || item.name, item.color || '', item.size || ''].join('|');
}

export function addToCart(item) {
  cartNotice = '';
  const key = lineKey(item);
  const existing = cart.find(i => i.key === key);
  if (existing) existing.qty += (item.qty || 1);
  else cart.push({ key, qty: item.qty || 1, ...item });
  syncCart();
}

export function setQty(key, qty) {
  const it = cart.find(i => i.key === key);
  if (!it) return;
  if (qty <= 0) cart = cart.filter(i => i.key !== key);
  else it.qty = qty;
  syncCart();
}

export function removeFromCart(key) {
  cart = cart.filter(i => i.key !== key);
  syncCart();
}

/* Allinea il carrello salvato al catalogo attuale: righe di prodotti
   tolti da Shopify, varianti sparite o esaurite → rimosse (con avviso);
   id variante e prezzo aggiornati. Solo con i dati DAL VIVO: la copia
   del catalogo può essere vecchia (stock, prodotti nuovi) e svuoterebbe
   carrelli validi. */
export let cartNotice = '';
export function reconcileCart() {
  const sh = window.TATO_shopify;
  if (!sh || !sh.live || !cart.length) return;
  let removed = 0, changed = false;
  cart = cart.filter(it => {
    const hit = it.slug ? sh._hit(it.slug, it.color, it.size) : null;
    if (!hit || !hit.available) { removed++; return false; }
    if (hit.id !== it.shopifyVariantId) { it.shopifyVariantId = hit.id; changed = true; }
    if (hit.price != null && hit.price !== it.price) { it.price = hit.price; changed = true; }
    return true;
  });
  if (removed) {
    cartNotice = removed === 1
      ? t('An item in your bag is no longer available and has been removed.')
      : t('{n} items in your bag are no longer available and have been removed.', { n: removed });
  }
  if (removed || changed) syncCart();
}

export function cartCount() {
  return cart.reduce((n, i) => n + i.qty, 0);
}

export function syncCart() {
  saveCart();
  updateBadge();
  renderCart();
  document.dispatchEvent(new CustomEvent('tato:cart-change', { detail: { count: cartCount() } }));
}

export function updateBadge() {
  const badge = document.getElementById('cart-badge');
  if (!badge) return;
  const n = cartCount();
  badge.textContent = n;
  badge.classList.toggle('hidden', n === 0);
}

export function renderCart() {
  const body   = document.getElementById('cart-body');
  const footer = document.getElementById('cart-footer');
  if (!body || !footer) return;

  const notice = cartNotice ? `<p class="cart-notice" role="status">${cartNotice}</p>` : '';

  if (cart.length === 0) {
    body.innerHTML = notice +
      `<p class="cart-empty">${t('Your bag is empty.')}</p>` +
      `<button class="cart-continue" id="cart-continue" type="button">${t('Continue shopping')}</button>`;
    footer.classList.add('hidden');
    document.getElementById('cart-continue')
      ?.addEventListener('click', () => { closeCart(); go('shop'); });
    return;
  }

  const total = cart.reduce((sum, i) => sum + (i.price || 0) * i.qty, 0);
  const cur = cart[0] && cart[0].currency ? cart[0].currency : 'EUR';

  body.innerHTML = notice + cart.map(item => `
    <div class="cart-item-row" data-key="${esc(item.key)}">
      ${item.image
        ? `<span class="cart-item-thumb${item.imageFlat ? ' is-flat' : ''}">${pictureHTML(item.image, { alt: item.name, sizes: '56px' })}</span>`
        : '<span class="cart-item-thumb ph-block"></span>'}
      <div class="cart-item-info">
        <p class="cart-item-name">${esc(item.name)}</p>
        <p class="cart-item-meta">${item.color ? esc(tColor(item.color)) + ' · ' : ''}${esc(item.size || '')}</p>
        <div class="cart-qty" role="group" aria-label="${t('Quantity')}">
          <button class="cart-qty-btn" data-act="dec" aria-label="${t('Decrease quantity')}">−</button>
          <span class="cart-qty-val" aria-live="polite">${item.qty}</span>
          <button class="cart-qty-btn" data-act="inc" aria-label="${t('Increase quantity')}">+</button>
        </div>
      </div>
      <div class="cart-item-right">
        <p class="cart-item-price">${money((item.price || 0) * item.qty, item.currency || cur)}</p>
        <button class="cart-remove-btn" data-act="rm" aria-label="${esc(t('Remove {name}', { name: item.name }))}">×</button>
      </div>
    </div>
  `).join('');

  footer.classList.remove('hidden');
  document.getElementById('cart-total').textContent = money(total, cur);

  body.querySelectorAll('.cart-item-row').forEach(row => {
    const key = row.dataset.key;
    const it = cart.find(i => i.key === key);
    row.querySelector('[data-act="dec"]')?.addEventListener('click', () => setQty(key, (it.qty || 1) - 1));
    row.querySelector('[data-act="inc"]')?.addEventListener('click', () => setQty(key, (it.qty || 1) + 1));
    row.querySelector('[data-act="rm"]')?.addEventListener('click', () => removeFromCart(key));
  });
}

export function openCart() {
  const drawer  = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-overlay');
  if (!drawer || !overlay) return;
  drawer.classList.add('open');
  overlay.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
  drawer.inert = false;
}

export function closeCart() {
  const drawer  = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-overlay');
  if (!drawer || !overlay) return;
  drawer.classList.remove('open');
  overlay.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
  drawer.inert = true;   // chiuso: niente Tab dentro il pannello
}

export function initCartUI() {
/* ═══════════════════════════════════════════
   SHOP POPUP
   ═══════════════════════════════════════════ */
btnShop?.addEventListener('click', openCart);
document.getElementById('cart-close')?.addEventListener('click', closeCart);
document.getElementById('cart-overlay')?.addEventListener('click', closeCart);

reconcileCart();
document.addEventListener('tato:shopify-ready', reconcileCart);

/* ─── Checkout Shopify ───────────────────── */
(function initCheckout() {
  const btn  = document.getElementById('cart-checkout');
  const note = document.getElementById('cart-note');
  if (!btn) return;

  function syncNote() {
    const s = window.TATO_shopify;
    if (!note) return;
    if (s && s.ready)              note.textContent = t('Secure checkout on Shopify.');
    else if (s && s.state === 'loading') note.textContent = t('Connecting to checkout…');
    else if (s && s.state === 'error')   note.textContent = t('Checkout temporarily unavailable.');
    else                          note.textContent = t('Checkout unavailable.');
    btn.disabled = !(s && s.ready) || cart.length === 0;
  }
  document.addEventListener('tato:shopify-ready', syncNote);
  document.addEventListener('tato:cart-change', syncNote);
  syncNote();

  btn.addEventListener('click', async () => {
    if (btn.disabled) return;
    if (!window.TATO_shopify || !window.TATO_shopify.ready) return;

    const lineItems = cart
      .filter(i => i.shopifyVariantId)
      .map(i => ({ variantId: i.shopifyVariantId, quantity: i.qty || 1 }));

    if (!lineItems.length) {
      if (note) note.textContent = t('No items linked to Shopify yet.');
      return;
    }
    if (lineItems.length !== cart.length && note) {
      note.textContent = t('Some items are not available for checkout.');
    }

    const original = btn.textContent;
    btn.textContent = t('Redirecting…');
    btn.disabled = true;
    btn.setAttribute('aria-busy', 'true');
    try {
      const url = await window.TATO_shopify.createCheckoutUrl(lineItems);
      if (url) { window.location.href = url; return; }
      throw new Error('no url');
    } catch (e) {
      console.warn('[TATO] checkout fallito:', e);
      if (note) note.textContent = t('Something went wrong at checkout. Please try again.');
      btn.textContent = original;
      btn.disabled = false;
      btn.removeAttribute('aria-busy');
    }
  });
})();
}

export function initCartRestore() {
// Ripristina il carrello salvato (localStorage) all'avvio
updateBadge();
renderCart();

// Sincronizza il carrello tra schede aperte
window.addEventListener('storage', e => {
  if (e.key === CART_KEY) { cart = loadCart(); updateBadge(); renderCart(); }
});
}
