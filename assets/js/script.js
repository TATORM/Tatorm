/* ═══════════════════════════════════════════
   TATO — script.js
   ═══════════════════════════════════════════ */

history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

/* I prezzi dei capi vengono da window.TATO_PRODUCTS (products.js);
   i 21 look da window.TATO_LOOKS + window.TATO_resolveLook(). */

/* ─── Hero Home (desktop) — pool curato, foto post-prodotte per il libro.
   Casuale a ogni load E ogni volta che si torna alla Home da un'altra
   sezione (vedi renderHomeHero / showSection). Solo desktop: su mobile
   l'hero resta quello di sempre, pescato da allHomePhotos qui sotto. */
const heroPhotosDesktop = [
  'media/home/hero/01.jpg',
  'media/home/hero/02.jpg',
  'media/home/hero/03.jpg',
  'media/home/hero/04.jpg',
  'media/home/hero/05.jpg',
  'media/home/hero/06.jpg',
  'media/home/hero/07.jpg',
  'media/home/hero/08.jpg',
];

/* ─── Home feed — ordine casuale + scroll infinito.
   Su mobile questo pool serve anche per l'hero (invariato). ─ */
const allHomePhotos = [
  'media/home/01.jpg',
  'media/home/02.jpg',
  'media/home/03.jpg',
  'media/home/04.jpg',
  'media/home/05.jpg',
  'media/home/06.jpg',
  'media/home/07.jpg',
  'media/home/08.jpg',
  'media/home/09.jpg',
  'media/home/10.jpg',
  'media/home/11.jpg',
  'media/home/12.jpg',
  'media/home/13.jpg',
  'media/home/14.jpg',
  'media/home/15.jpg',
  'media/home/16.jpg',
  'media/home/17.jpg',
  'media/home/18.jpg',
  'media/home/19.jpg',
  'media/home/20.png',
  'media/home/21.png',
  'media/looks/look-01/01.jpg',
  'media/looks/look-01/02.jpg',
  'media/looks/look-02/01.jpg',
  'media/looks/look-02/02.jpg',
  'media/looks/look-02/03.jpg',
  'media/looks/look-02/04.jpg',
  'media/looks/look-02/05.jpg',
  'media/looks/look-03/01.jpg',
  'media/looks/look-03/02.jpg',
  'media/looks/look-04/01.jpg',
  'media/looks/look-04/02.jpg',
  'media/looks/look-04/03.jpg',
  'media/looks/look-04/04.jpg',
  'media/looks/look-05/01.jpg',
  'media/looks/look-05/02.jpg',
  'media/looks/look-05/03.jpg',
  'media/looks/look-06/01.jpg',
  'media/looks/look-06/02.jpg',
  'media/looks/look-06/03.jpg',
  'media/looks/look-06/04.jpg',
  'media/looks/look-07/01.jpg',
  'media/looks/look-07/02.jpg',
  'media/looks/look-07/03.jpg',
  'media/looks/look-08/01.jpg',
  'media/looks/look-08/02.jpg',
  'media/looks/look-08/03.jpg',
  'media/looks/look-08/04.jpg',
  'media/looks/look-08/05.jpg',
  'media/looks/look-09/01.jpg',
  'media/looks/look-09/02.jpg',
  'media/looks/look-10/01.jpg',
  'media/looks/look-10/02.jpg',
  'media/looks/look-10/03.jpg',
  'media/looks/look-11/01.jpg',
  'media/looks/look-11/02.jpg',
  'media/looks/look-11/03.jpg',
  'media/looks/look-11/04.jpg',
  'media/looks/look-11/05.jpg',
  'media/looks/look-11/06.jpg',
  'media/looks/look-11/07.jpg',
  'media/looks/look-11/08.jpg',
  'media/looks/look-12/01.jpg',
  'media/looks/look-12/02.jpg',
  'media/looks/look-12/03.jpg',
  'media/looks/look-13/01.jpg',
  'media/looks/look-13/02.jpg',
  'media/looks/look-13/03.jpg',
  'media/looks/look-14/01.jpg',
  'media/looks/look-14/02.jpg',
  'media/looks/look-14/03.jpg',
  'media/looks/look-15/01.jpg',
  'media/looks/look-15/02.jpg',
  'media/looks/look-15/03.jpg',
  'media/looks/look-16/01.jpg',
  'media/looks/look-16/02.jpg',
  'media/looks/look-17/01.jpg',
  'media/looks/look-17/02.jpg',
  'media/looks/look-17/03.jpg',
  'media/looks/look-17/04.jpg',
  'media/looks/look-17/05.jpg',
  'media/looks/look-18/01.jpg',
  'media/looks/look-18/04.jpg',
  'media/looks/look-18/02.jpg',
  'media/looks/look-18/03.jpg',
  'media/looks/look-19/01.jpg',
  'media/looks/look-19/02.jpg',
  'media/looks/look-19/03.jpg',
  'media/looks/look-20/01.jpg',
  'media/looks/look-20/02.jpg',
  'media/looks/look-20/03.jpg',
  'media/looks/look-20/04.jpg',
  'media/looks/look-21/01.jpg',
  'media/looks/look-21/02.jpg',
  'media/looks/look-21/03.jpg'
];

function shuffle(arr) {
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
const HAS_DERIVATIVES = /^media\/(looks|home|products)\//;

function pictureHTML(src, opts) {
  opts = opts || {};
  const alt   = opts.alt || '';
  const cls   = opts.cls ? ` class="${opts.cls}"` : '';
  const sizes = opts.sizes || '100vw';
  const eager = !!opts.eager;
  const load  = eager ? 'eager' : 'lazy';
  const prio  = eager ? ' fetchpriority="high"' : '';
  const dims  = opts.width && opts.height
    ? ` width="${opts.width}" height="${opts.height}"` : '';
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
function pictureEl(src, opts) {
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
  img.alt = opts.alt || '';
  img.decoding = 'async';
  img.draggable = false;
  if (opts.eager) { img.loading = 'eager'; img.fetchPriority = 'high'; }
  else img.loading = 'lazy';
  img.src = src;
  pic.appendChild(img);
  return pic;
}

/* Foto di brand/editoriali senza un capo o un look specifico da nominare
   (mix di scatti studio in media/home/ e still dai look) → un alt
   generico ma reale (non decorativo: è il contenuto della Home). */
function homePhotoAlt(src) {
  const look = src.match(/look-(\d+)/);
  return look ? `TATO — Look ${parseInt(look[1], 10)}` : 'TATO — editorial photography';
}

function appendPhotos(feed, photos, isFirst) {
  photos.forEach((src, i) => {
    const fig = document.createElement('figure');
    const hero = isFirst && i === 0;
    fig.className = hero ? 'home-image-block home-hero' : 'home-image-block';
    fig.appendChild(pictureEl(src, {
      eager: hero,
      alt: homePhotoAlt(src),
      sizes: '(max-width: 768px) 100vw, min(700px, 36vw)',
    }));
    feed.appendChild(fig);
  });
}

function isDesktopViewport() {
  return !window.matchMedia('(max-width: 768px)').matches;
}

/* Hero Home: crea (o aggiorna sul posto) la prima figure del feed.
   Desktop → pool curato heroPhotosDesktop, ripescato a ogni chiamata
   (vedi showSection). Mobile → invariato: allHomePhotos, fissato al load. */
function renderHomeHero() {
  const feed = document.getElementById('home-feed');
  if (!feed) return;
  const desktop = isDesktopViewport();
  const pool = desktop ? heroPhotosDesktop : allHomePhotos;
  const src = pool[Math.floor(Math.random() * pool.length)];

  let fig = document.getElementById('home-hero-fig');
  if (!fig) {
    fig = document.createElement('figure');
    fig.id = 'home-hero-fig';
    fig.className = 'home-image-block home-hero';
    feed.insertBefore(fig, feed.firstChild);
  }
  fig.innerHTML = '';
  fig.appendChild(pictureEl(src, {
    eager: true,
    alt: homePhotoAlt(src),
    sizes: '100vw',   // hero sempre a tutto schermo, mobile e desktop
    // pool desktop = full-bleed su schermi grandi → derivati più
    // larghi/qualità più alta (vedi scripts/images.mjs, cartella hero/)
    widths: desktop ? [1600, 2400] : [900, 1440],
  }));
}

/* Sezione Women/Men sotto l'hero — due foto full-bleed affiancate,
   didascalia in basso a sx, come il blocco Uomo/Donna della home Dior.
   Desktop only (vedi .home-depts nella media query ≤768px). */
function renderHomeDepartments() {
  const wrap = document.createElement('div');
  wrap.className = 'home-depts';
  const depts = [
    { slug: 'men',   label: 'Men',   img: 'media/home/hero/05.jpg' },
    { slug: 'women', label: 'Women', img: 'media/home/hero/06.jpg' },
  ];
  depts.forEach(d => {
    const a = document.createElement('a');
    a.className = 'home-dept';
    a.href = `#shop/${d.slug}`;
    a.appendChild(pictureEl(d.img, {
      alt: `TATO — ${d.label}`,
      sizes: '50vw',
      widths: [1600, 2400],
    }));
    const cap = document.createElement('span');
    cap.className = 'home-dept-caption';
    cap.innerHTML = `<span class="home-dept-title">${d.label}</span><span class="home-dept-link">Discover</span>`;
    a.appendChild(cap);
    wrap.appendChild(a);
  });
  return wrap;
}

/* ═══════════════════════════════════════════
   GRIGLIA PRODOTTI condivisa (Shop + Home)
   Markup: .pgrid > a.pgrid-card
   ═══════════════════════════════════════════ */
/* Sorgente immagine di anteprima + se è un packshot flat (media/products/…) */
function productImgSrc(p) {
  const c = p.colors && p.colors[0];
  if (c && c.images && c.images.length) return { src: c.images[0], flat: true };
  const look = window.TATO_lookImages
    ? window.TATO_lookImages(p.lookRefs, { onePerLook: true, limit: 1 })[0]
    : null;
  return { src: look || '', flat: false };
}

/* colorIdx opzionale: card di una specifica variante colore
   (immagine + nome colore). Usata dalla Home per mostrare ogni colorway. */
function pgridCardHTML(p, colorIdx) {
  const col = (colorIdx != null && p.colors && p.colors[colorIdx]) ? p.colors[colorIdx] : null;
  let img;
  if (col && col.images && col.images.length) img = { src: col.images[0], flat: true };
  else img = productImgSrc(p);

  const media = img.src
    ? pictureHTML(img.src, { alt: col ? `${p.name} — ${col.name}` : p.name, sizes: '(max-width: 768px) 50vw, 25vw' })
    : '<span class="ph-block"></span>';
  const sh = window.TATO_shopify;
  const shReady = !!(sh && sh.ready);
  const sold = col
    ? (shReady && sh.availableColors(p.slug) && !sh.availableColors(p.slug)[col.name])
    : (p.status === 'sold-out' || (shReady && sh.soldOut(p.slug)));
  const pd = shReady ? sh.productData(p.slug) : null;
  const price = pd && pd.minPrice != null ? pd.minPrice : p.price;
  const cur = (pd && pd.currency) || p.currency || 'EUR';
  /* card di una singola colorway (Home) → nome del colore attivo;
     card del prodotto (Shop, Complete the look) → pallini di tutti i colori */
  const colorInfo = col
    ? `<span class="pgrid-colour">${col.name}</span>`
    : (p.colors && p.colors.length > 1
        ? `<span class="pgrid-swatches">${p.colors.map(c =>
            `<span class="pgrid-swatch" style="background:${c.hex}" aria-hidden="true"></span>`
          ).join('')}</span>`
        : '');
  return `
    <a class="pgrid-card${sold ? ' is-soldout' : ''}" href="#product/${p.slug}" data-slug="${p.slug}">
      <span class="pgrid-media${img.flat ? ' is-flat' : ''}">
        ${media}
        ${sold ? '<span class="pgrid-soldout">Sold out</span>' : ''}
      </span>
      <span class="pgrid-name">${p.name}</span>
      ${colorInfo}
      <span class="pgrid-price">${money(price, cur)}</span>
    </a>`;
}

function pgridHTML(list) {
  if (!list || !list.length) return '<p class="pgrid-empty">Coming soon.</p>';
  return list.map(p => pgridCardHTML(p)).join('');
}

/* Evita due card dello stesso prodotto adiacenti (best-effort) */
function declusterBySlug(arr) {
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

(function buildHomeFeed() {
  const feed = document.getElementById('home-feed');
  if (!feed) return;

  // Hero: una foto a tutto schermo, casuale a ogni load (vedi renderHomeHero)
  renderHomeHero();

  // Subito sotto l'hero: blocco Women/Men (due foto affiancate, come Dior)
  feed.appendChild(renderHomeDepartments());

  // Dopo l'hero: alterna un blocco di prodotti (≈2 righe) e una foto
  // di look — foto, 2 righe, foto, 2 righe, … Tutte le colorway,
  // mescolate a ogni load, senza due stessi prodotti vicini.
  let cards = [];
  (window.TATO_PRODUCTS || []).forEach(p => {
    (p.colors || []).forEach((c, ci) => cards.push({ p, ci }));
  });
  cards = declusterBySlug(shuffle(cards));

  // foto di look da intercalare (una diversa per ogni stacco)
  const lookShots = shuffle(
    Object.keys(window.TATO_LOOKS || {})
      .map(n => (window.TATO_lookImages
        ? window.TATO_lookImages([n], { onePerLook: true, limit: 1 })[0]
        : null))
      .filter(Boolean)
  );

  const PER_BLOCK = 8;   // 2 righe × 4 col su desktop (2 col × 4 righe su mobile)
  let shot = 0;
  const nextShot = () => lookShots[shot++ % lookShots.length];
  const lookFig = (src, sizes) => {
    const fig = document.createElement('figure');
    fig.className = 'home-look';
    fig.appendChild(pictureEl(src, { alt: homePhotoAlt(src), sizes }));
    return fig;
  };

  // quanti stacchi foto ci sono, e quali diventano una coppia (fianco a fianco)
  const slotCount = Math.max(0, Math.ceil(cards.length / PER_BLOCK) - 1);
  const pairSlots = new Set();
  if (lookShots.length > 1 && slotCount >= 1) {
    // almeno uno stacco è una coppia; gli altri lo diventano ~1 volta su 3
    pairSlots.add(Math.floor(Math.random() * slotCount));
    for (let s = 0; s < slotCount; s++) if (Math.random() < 0.33) pairSlots.add(s);
  }

  let slot = 0;
  for (let i = 0; i < cards.length; i += PER_BLOCK) {
    const grid = document.createElement('div');
    grid.className = 'pgrid home-pgrid';
    grid.innerHTML = cards.slice(i, i + PER_BLOCK)
      .map(({ p, ci }) => pgridCardHTML(p, ci)).join('');
    feed.appendChild(grid);

    if (i + PER_BLOCK < cards.length && lookShots.length) {
      if (pairSlots.has(slot)) {
        const pair = document.createElement('div');
        pair.className = 'home-look-pair';
        pair.appendChild(lookFig(nextShot(), '(max-width: 768px) 50vw, 38vw'));
        pair.appendChild(lookFig(nextShot(), '(max-width: 768px) 50vw, 38vw'));
        feed.appendChild(pair);
      } else {
        feed.appendChild(lookFig(nextShot(), '(max-width: 768px) 100vw, min(700px, 36vw)'));
      }
      slot++;
    }
  }
})();

/* Il layout di home-hero e caroselli (altezza = viewport, colonna
   verticale) è tutto in CSS: .home-hero / .look-carousel = 100svh in
   flusso normale. Niente più posizionamento in JS né handler di resize. */

/* ─── DOM refs ───────────────────────────── */
const splashBg          = document.getElementById('splash-bg');
const logo              = document.getElementById('logo');
const navToggle         = document.getElementById('nav-toggle');
const navLinks          = document.getElementById('nav-links');
const btnMonogram       = document.getElementById('btn-monogram');
const btnShop           = document.getElementById('btn-shop');
const fixedLookInfo     = document.getElementById('fixed-look-info');
const lookCarousels     = document.querySelectorAll('.look-carousel');
const siteNav           = document.querySelector('.site-nav');
const siteBreadcrumb    = document.getElementById('site-breadcrumb');

/* ─── Carrello ───────────────────────────────
   Righe unite per variante (slug|colore|taglia) con quantità.
   Persistito in localStorage; il carrello Shopify vero viene
   creato al checkout (cartCreate) dalle righe con variantId. */
const CART_KEY = 'tato-cart-v1';
let cart = loadCart();

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.filter(i => i && i.name && i.qty > 0) : [];
  } catch (_) { return []; }
}

function saveCart() {
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (_) {}
}

function lineKey(item) {
  return [item.slug || item.name, item.color || '', item.size || ''].join('|');
}

function addToCart(item) {
  const key = lineKey(item);
  const existing = cart.find(i => i.key === key);
  if (existing) existing.qty += (item.qty || 1);
  else cart.push({ key, qty: item.qty || 1, ...item });
  syncCart();
}

function setQty(key, qty) {
  const it = cart.find(i => i.key === key);
  if (!it) return;
  if (qty <= 0) cart = cart.filter(i => i.key !== key);
  else it.qty = qty;
  syncCart();
}

function removeFromCart(key) {
  cart = cart.filter(i => i.key !== key);
  syncCart();
}

function cartCount() {
  return cart.reduce((n, i) => n + i.qty, 0);
}

function syncCart() {
  saveCart();
  updateBadge();
  renderCart();
  document.dispatchEvent(new CustomEvent('tato:cart-change', { detail: { count: cartCount() } }));
}

function updateBadge() {
  const badge = document.getElementById('cart-badge');
  if (!badge) return;
  const n = cartCount();
  badge.textContent = n;
  badge.classList.toggle('hidden', n === 0);
}

function renderCart() {
  const body   = document.getElementById('cart-body');
  const footer = document.getElementById('cart-footer');
  if (!body || !footer) return;

  if (cart.length === 0) {
    body.innerHTML =
      '<p class="cart-empty">Your bag is empty.</p>' +
      '<button class="cart-continue" id="cart-continue" type="button">Continue shopping</button>';
    footer.classList.add('hidden');
    document.getElementById('cart-continue')
      ?.addEventListener('click', () => { closeCart(); location.hash = '#shop'; });
    return;
  }

  const total = cart.reduce((sum, i) => sum + (i.price || 0) * i.qty, 0);
  const cur = cart[0] && cart[0].currency ? cart[0].currency : 'EUR';

  body.innerHTML = cart.map(item => `
    <div class="cart-item-row" data-key="${item.key}">
      ${item.image
        ? `<span class="cart-item-thumb${item.imageFlat ? ' is-flat' : ''}">${pictureHTML(item.image, { alt: item.name, sizes: '56px' })}</span>`
        : '<span class="cart-item-thumb ph-block"></span>'}
      <div class="cart-item-info">
        <p class="cart-item-name">${item.name}</p>
        <p class="cart-item-meta">${item.color ? item.color + ' · ' : ''}${item.size || ''}</p>
        <div class="cart-qty" role="group" aria-label="Quantity">
          <button class="cart-qty-btn" data-act="dec" aria-label="Decrease quantity">−</button>
          <span class="cart-qty-val" aria-live="polite">${item.qty}</span>
          <button class="cart-qty-btn" data-act="inc" aria-label="Increase quantity">+</button>
        </div>
      </div>
      <div class="cart-item-right">
        <p class="cart-item-price">${money((item.price || 0) * item.qty, item.currency || cur)}</p>
        <button class="cart-remove-btn" data-act="rm" aria-label="Remove ${item.name}">×</button>
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

function openCart() {
  const drawer  = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-overlay');
  if (!drawer || !overlay) return;
  drawer.classList.add('open');
  overlay.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
}

function closeCart() {
  const drawer  = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-overlay');
  if (!drawer || !overlay) return;
  drawer.classList.remove('open');
  overlay.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
}

/* ═══════════════════════════════════════════
   SPLASH + ANIMAZIONE LOGO
   ─────────────────────────────────────────
   Il logo parte centrato (CSS default).
   Dopo 1.2s → aggiunge .logo--left → CSS
   transition lo porta a left: 3vw, top: 50%.
   Poi lo sfondo bianco fa fade-out.
   Il logo non sparisce mai.
   ═══════════════════════════════════════════ */
window.addEventListener('load', () => {

  setTimeout(() => {
    logo.classList.add('logo--left');

    setTimeout(() => {
      splashBg.classList.add('fade-out');

      setTimeout(() => {
        splashBg.style.display = 'none';
        window.dispatchEvent(new Event('tato:intro-done'));
      }, 580);

    }, 350);

  }, 1200);

});

/* ═══════════════════════════════════════════
   HEADER COMPATTO IN ALTO allo scroll
   Logo/MENU normalmente restano centrati in
   verticale (vedi .site-logo/.site-nav); scendendo
   si spostano negli angoli in alto (body.header-scrolled,
   regole in style.css). Ascolta sia window (desktop)
   che body (mobile, dove body stesso è lo scroll
   container — vedi media query ≤768px). */
(function () {
  const THRESHOLD = 80;
  let ticking = false;
  function currentScrollY() {
    return window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
  }
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      document.body.classList.toggle('header-scrolled', currentScrollY() > THRESHOLD);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  document.body.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ═══════════════════════════════════════════
   NAVIGAZIONE SEZIONI
   ═══════════════════════════════════════════ */
/* ─── Menu principale (home) ──────────────
   New Arrivals · Women▸ · Men▸ · Accessories
   · Collection · About
   Women/Men aprono il sottomenu categorie.     */
function navDeptSub(dept) {
  const cats = window.TATO_categoriesFor
    ? window.TATO_categoriesFor(dept)
    : (window.TATO_CATEGORIES || []);
  const items = [`<li><a href="#" data-nav="shop/${dept}">View All</a></li>`].concat(
    cats.map(c =>
      `<li><a href="#" data-nav="shop/${dept}/${c.slug}">${c.label}</a></li>`)
  );
  return `<ul class="nav-sub">${items.join('')}</ul>`;
}

function renderNavMenu() {
  navLinks.innerHTML = `
    <li><a href="#" data-nav="shop">New Arrivals</a></li>
    <li class="nav-group">
      <button type="button" class="nav-group-toggle" data-group="women">Women</button>
      ${navDeptSub('women')}
    </li>
    <li class="nav-group">
      <button type="button" class="nav-group-toggle" data-group="men">Men</button>
      ${navDeptSub('men')}
    </li>
    <li><a href="#" data-nav="shop/accessories">Accessories</a></li>
    <li class="nav-spacer" aria-hidden="true"></li>
    <li><a href="#" data-section="collection">Collection</a></li>
    <li><a href="#" data-section="about">About</a></li>
  `;

  navLinks.querySelectorAll('[data-nav]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      closeNav();
      const target = '#' + a.dataset.nav;
      if (location.hash === target) handleShopRoute();
      else location.hash = target;
    });
  });
  navLinks.querySelectorAll('[data-section]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      closeNav();
      navToSection(a.dataset.section);
    });
  });
  navLinks.querySelectorAll('.nav-group-toggle').forEach(btn => {
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', () => {
      const grp = btn.closest('.nav-group');
      const wasOpen = grp.classList.contains('open');
      navLinks.querySelectorAll('.nav-group').forEach(g => {
        g.classList.remove('open');
        g.querySelector('.nav-group-toggle')?.setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) { grp.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
    });
  });
}

function closeNav() {
  navLinks.classList.remove('open');
  navLinks.querySelectorAll('.nav-group').forEach(g => {
    g.classList.remove('open');
    g.querySelector('.nav-group-toggle')?.setAttribute('aria-expanded', 'false');
  });
  navToggle.setAttribute('aria-expanded', 'false');
}

function resetScroll() {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

function showSection(id) {
  // Reset scroll prima di tutto per evitare che l'IntersectionObserver
  // legga la posizione della home e mostri il look sbagliato su mobile
  resetScroll();

  // Nascondi tutte le sezioni
  document.querySelectorAll('.page').forEach(p => {
    p.style.display = 'none';
    p.classList.remove('active');
  });

  // Mostra la sezione target
  const target = document.getElementById(id);
  if (!target) return;
  target.style.display = id === 'about' ? 'flex' : 'block';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      target.classList.add('active');
      // Ri-forza lo scroll a 0: quando la navigazione avviene via
      // `location.hash = "#shop"` il browser prova a scrollare fino a
      // <section id="shop"> DOPO che l'abbiamo mostrata → su mobile la
      // pagina si apriva "dal fondo". Questo la riporta in cima.
      // (il deep-link ai look da "Seen in" scrolla a t+80ms, quindi vince).
      resetScroll();
    });
  });

  // Gestisci visibilità pannello look e breadcrumb
  if (id === 'collection') {
    fixedLookInfo.classList.add('panel-visible');
    siteBreadcrumb.classList.add('visible');
    siteNav.style.opacity       = '0';
    siteNav.style.pointerEvents = 'none';
    activeLook = null;
    renderLookPanel('1');
  } else if (id === 'about') {
    fixedLookInfo.classList.remove('panel-visible');
    siteBreadcrumb.classList.add('visible');
    siteNav.style.opacity       = '';
    siteNav.style.pointerEvents = '';
  } else if (id === 'shop' || id === 'product') {
    fixedLookInfo.classList.remove('panel-visible');
    siteBreadcrumb.classList.add('visible');
    siteNav.style.opacity       = '';
    siteNav.style.pointerEvents = '';
    if (id === 'shop') {
      if (!location.hash.startsWith('#shop')) {
        shopScope = 'new';
        shopCategory = 'all';
        history.replaceState(null, '', '#shop');
      }
      renderShop();
    }
  } else {
    fixedLookInfo.classList.remove('panel-visible');
    siteBreadcrumb.classList.remove('visible');
    siteNav.style.opacity       = '';
    siteNav.style.pointerEvents = '';
    // Home: nuova foto hero casuale ogni volta che si torna qui da
    // un'altra sezione. Solo desktop — su mobile l'hero non cambia.
    if (id === 'home' && isDesktopViewport()) renderHomeHero();
  }

  // Modalità header per shop / product
  document.body.classList.toggle('shop-mode', id === 'shop' || id === 'product');

  // Sincronizza l'hash con la sezione (replaceState = niente loop di hashchange)
  if (id === 'home') {
    if (location.hash) history.replaceState(null, '', location.pathname + location.search);
  } else if (id === 'collection' || id === 'about') {
    if (location.hash !== '#' + id) history.replaceState(null, '', '#' + id);
  }

  closeNav();
}

/* Naviga a una sezione creando una voce di cronologia (tasto Indietro).
   collection/about passano per l'hash; home lo pulisce; shop/product
   restano gestiti dalle proprie rotte. */
function navToSection(id) {
  if (id === 'collection' || id === 'about') {
    if (location.hash === '#' + id) showSection(id);
    else location.hash = '#' + id;
  } else if (id === 'home') {
    if (location.hash) history.pushState(null, '', location.pathname + location.search);
    showSection('home');
  } else {
    showSection(id);
  }
}

// Click su link breadcrumb / footer (statici nell'HTML)
document.querySelectorAll('[data-section]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    navToSection(link.dataset.section);
  });
});

// Click sul logo → home
logo.addEventListener('click', e => {
  e.preventDefault();
  showSection('home');
});

// Stato iniziale nav
renderNavMenu();

/* ─── Toggle menu ────────────────────────── */
navToggle.addEventListener('click', () => {
  if (navLinks.classList.contains('open')) closeNav();
  else { navLinks.classList.add('open'); navToggle.setAttribute('aria-expanded', 'true'); }
});

document.addEventListener('click', e => {
  if (!e.target.closest('.site-nav')) closeNav();
});

/* ═══════════════════════════════════════════
   NEWSLETTER POPUP
   ═══════════════════════════════════════════ */
(function () {
  const popup      = document.getElementById('dropPopup');
  const overlay    = document.getElementById('dropPopupOverlay');
  const closeBtn   = document.getElementById('closeDropPopup');
  const panel      = popup.querySelector('.drop-popup__panel');
  const form       = document.getElementById('realMailchimpForm');
  const status     = document.getElementById('mailchimpStatus');
  const errorText  = document.getElementById('mailchimpError');
  const emailInput = document.getElementById('mce-EMAIL');
  let submitted    = false;

  function openPopup() {
    if (localStorage.getItem('tato-nl-done')) return;
    popup.classList.add('is-open');
    popup.setAttribute('aria-hidden', 'false');
    form.style.display = 'block';
    status.classList.remove('is-visible');
    errorText.classList.remove('is-visible');
  }

  function closePopup() {
    popup.classList.remove('is-open');
    popup.setAttribute('aria-hidden', 'true');
  }

  // auto-apri dopo la fine dell'intro
  window.addEventListener('tato:intro-done', openPopup, { once: true });

  btnMonogram?.addEventListener('click', () => {
    if (popup.classList.contains('is-open')) closePopup();
    else openPopup();
  });
  closeBtn.addEventListener('click', closePopup);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePopup(); });

  emailInput.addEventListener('input', () => {
    errorText.classList.remove('is-visible');
  });

  form.addEventListener('submit', e => {
    if (!emailInput.value.trim() || !emailInput.checkValidity()) {
      e.preventDefault();
      errorText.classList.add('is-visible');
      return;
    }
    errorText.classList.remove('is-visible');
    submitted = true;
    localStorage.setItem('tato-nl-done', '1');
    form.style.display = 'none';
    status.classList.add('is-visible');
    setTimeout(closePopup, 2500);
  });
})();

/* ─── Newsletter nel footer (stesso endpoint Mailchimp) ─── */
(function () {
  const fy = document.getElementById('footer-year');
  if (fy) fy.textContent = new Date().getFullYear();

  const form   = document.getElementById('footerMailchimpForm');
  const status = document.getElementById('footerMailchimpStatus');
  if (!form || !status) return;
  const email = form.querySelector('#footer-EMAIL');
  form.addEventListener('submit', e => {
    if (!email.value.trim() || !email.checkValidity()) { e.preventDefault(); return; }
    form.style.display = 'none';
    status.classList.add('is-visible');
    try { localStorage.setItem('tato-nl-done', '1'); } catch (_) {}
  });
})();

/* ═══════════════════════════════════════════
   SHOP POPUP
   ═══════════════════════════════════════════ */
btnShop?.addEventListener('click', openCart);
document.getElementById('cart-close')?.addEventListener('click', closeCart);
document.getElementById('cart-overlay')?.addEventListener('click', closeCart);

/* ─── Checkout Shopify ───────────────────── */
(function initCheckout() {
  const btn  = document.getElementById('cart-checkout');
  const note = document.getElementById('cart-note');
  if (!btn) return;

  function syncNote() {
    const s = window.TATO_shopify;
    if (!note) return;
    if (s && s.ready)              note.textContent = 'Secure checkout on Shopify.';
    else if (s && s.state === 'loading') note.textContent = 'Connecting to checkout…';
    else if (s && s.state === 'error')   note.textContent = 'Checkout temporarily unavailable.';
    else                          note.textContent = 'Checkout unavailable.';
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
      if (note) note.textContent = 'No items linked to Shopify yet.';
      return;
    }
    if (lineItems.length !== cart.length && note) {
      note.textContent = 'Some items are not available for checkout.';
    }

    const original = btn.textContent;
    btn.textContent = 'Redirecting…';
    btn.disabled = true;
    btn.setAttribute('aria-busy', 'true');
    try {
      const url = await window.TATO_shopify.createCheckoutUrl(lineItems);
      if (url) { window.location.href = url; return; }
      throw new Error('no url');
    } catch (e) {
      console.warn('[TATO] checkout fallito:', e);
      if (note) note.textContent = 'Checkout error — please retry.';
      btn.textContent = original;
      btn.disabled = false;
      btn.removeAttribute('aria-busy');
    }
  });
})();

/* ═══════════════════════════════════════════
   CAROSELLI LOOK — crossfade
   ═══════════════════════════════════════════ */
lookCarousels.forEach(carousel => {
  const slideEls = Array.from(carousel.querySelectorAll('.carousel-slide'));
  const counter  = carousel.querySelector('.image-counter');
  const lookKey  = carousel.dataset.look;
  const total    = slideEls.length;
  let current    = 0;
  slideEls[0].classList.add('active');
  if (counter) counter.textContent = `1 / ${total}`;

  function goTo(index) {
    slideEls[current].classList.remove('active');
    current = (index + total) % total;
    slideEls[current].classList.add('active');
    if (counter) counter.textContent = `${current + 1} / ${total}`;
  }

  carousel.addEventListener('click', e => {
    if (window.matchMedia('(max-width: 768px)').matches) return;
    const x = e.clientX - carousel.getBoundingClientRect().left;
    goTo(x < carousel.getBoundingClientRect().width / 2 ? current - 1 : current + 1);
  });

  let touchStartX = 0;
  let touchStartY = 0;
  let swipeDir = null;

  carousel.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    swipeDir = null;
  }, { passive: true });

  carousel.addEventListener('touchmove', e => {
    if (swipeDir === null) {
      const dx = Math.abs(e.touches[0].clientX - touchStartX);
      const dy = Math.abs(e.touches[0].clientY - touchStartY);
      if (dx > 8 || dy > 8) swipeDir = dx > dy ? 'h' : 'v';
    }
    if (swipeDir === 'h') e.preventDefault();
  }, { passive: false });

  carousel.addEventListener('touchend', e => {
    if (swipeDir !== 'h') return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 30) goTo(dx < 0 ? current + 1 : current - 1);
  });
});

/* ═══════════════════════════════════════════
   INTERSECTIONOBSERVER — aggiorna .fixed-look-info
   Osserva i caroselli (non più i singoli blocchi)
   ═══════════════════════════════════════════ */

let activeLook = null;

/* Pannello Collection = "Shop the look".
   Elenca i capi del look; quello a catalogo è un link alla sua
   scheda prodotto (con prezzo), gli altri sono "Archive piece".
   L'acquisto avviene solo sulla PDP → un unico flusso carrello. */
function renderLookPanel(lookKey) {
  if (lookKey === activeLook) return;
  activeLook = lookKey;

  const data = window.TATO_resolveLook(lookKey);
  if (!data) return;

  fixedLookInfo.classList.add('panel-updating');

  setTimeout(() => {
    const itemsHTML = data.items.map(item => {
      const action = item.slug
        ? `<a class="panel-item-shop" href="#product/${item.slug}">${money(item.price, item.currency)} — Shop</a>`
        : `<p class="panel-item-archive">Archive piece</p>`;
      return `
        <div class="panel-item">
          <p class="panel-item-name">${item.name}</p>
          <p class="panel-item-info">${item.composition}</p>
          <p class="panel-item-info">Color: ${item.color}</p>
          ${action}
        </div>
      `;
    }).join('');

    fixedLookInfo.innerHTML = `
      <p class="panel-look-number">${data.number}</p>
      <div class="panel-look-items">${itemsHTML}</div>
    `;

    fixedLookInfo.classList.remove('panel-updating');
  }, 180);
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const lookKey = entry.target.dataset.look;
        activeLook = null;
        renderLookPanel(lookKey);
      }
    });
  },
  {
    root: null,
    rootMargin: '-30% 0px -30% 0px',
    threshold: 0
  }
);

lookCarousels.forEach(c => observer.observe(c));

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
const PRODUCTS    = window.TATO_PRODUCTS    || [];
const CATEGORIES  = window.TATO_CATEGORIES  || [];
const shopGrid    = document.getElementById('shop-grid');
const shopTitleEl = document.getElementById('shop-title');
const pdpEl       = document.getElementById('pdp');

let shopScope    = 'new';   // 'new' | 'women' | 'men' | 'accessories'
let shopCategory = 'all';   // 'all' | slug categoria
let pdpState     = { slug: null, colorIdx: 0, size: null };

/* Prefetch Shopify (no-op se manca il token) */
if (window.TATO_shopify) {
  window.TATO_shopify.init(PRODUCTS.map(p => p.slug));
}

function money(price, currency) {
  return (currency === 'EUR' ? '€' : '') + price;
}

/* ─── SHOP: titolo sezione ───────────────────
   Le categorie si scelgono dal menu (Women▸ / Men▸),
   non c'è più la barra filtri sulla pagina: il titolo
   riporta reparto + categoria attiva.               */
function renderShopHead() {
  if (!shopTitleEl) return;
  const scopeLabel =
    shopScope === 'women'         ? 'Women'
    : shopScope === 'men'         ? 'Men'
    : shopScope === 'accessories' ? 'Accessories'
    : 'New Arrivals';
  const cat = (shopCategory && shopCategory !== 'all')
    ? window.TATO_getCategoryLabel(shopCategory)
    : '';
  shopTitleEl.textContent = cat ? `${scopeLabel} / ${cat}` : scopeLabel;
}

function productThumb(p) {
  const c = p.colors[0];
  if (c && c.images && c.images.length) {
    return `<img class="product-card-img" src="${c.images[0]}" alt="${p.name}" loading="lazy">`;
  }
  const look = window.TATO_lookImages
    ? window.TATO_lookImages(p.lookRefs, { onePerLook: true, limit: 1 })[0]
    : null;
  if (look) {
    return `<img class="product-card-img" src="${look}" alt="${p.name}" loading="lazy">`;
  }
  return '<span class="ph-block"></span>';
}

/* ─── SHOP: griglia prodotti ─────────────── */
function shopFilteredProducts() {
  let list = PRODUCTS.slice();
  if (shopScope === 'accessories') {
    return list.filter(p => p.category === 'accessories');
  }
  list = list.filter(p => p.category !== 'accessories');
  if (shopScope === 'women' || shopScope === 'men') {
    list = list.filter(p => (p.genders || ['women', 'men']).includes(shopScope));
  }
  if (shopCategory !== 'all') {
    list = list.filter(p => p.category === shopCategory);
  }
  return list;
}

function renderShopGrid() {
  if (!shopGrid) return;
  shopGrid.className = 'pgrid';
  shopGrid.innerHTML = pgridHTML(shopFilteredProducts());
}

function renderShop() {
  renderShopHead();
  renderShopGrid();
}

/* ─── PDP: scheda prodotto ─────────────────
   Shopify (window.TATO_shopify) è fonte autorevole per prezzo,
   compare-at, disponibilità taglie e stato sold-out quando `ready`.
   In assenza (offline / prefetch non finito) si usa il catalogo locale. */
function renderPDP(slug) {
  const p = window.TATO_getProduct(slug);
  if (!p || !pdpEl) return false;

  if (pdpState.slug !== slug) pdpState = { slug, colorIdx: 0, size: null };
  const color = p.colors[pdpState.colorIdx] || p.colors[0];

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
    return `<button class="pdp-color${i === pdpState.colorIdx ? ' selected' : ''}${cSold ? ' is-soldout' : ''}" data-idx="${i}" style="background:${c.hex}" aria-label="${c.name}${cSold ? ' — sold out' : ''}"></button>`;
  }).join('');

  const sizes = color.sizes.map(s => {
    const avail = shReady ? sh.variantAvailable(slug, color.name, s.label) : (s.available !== false);
    return `<button class="pdp-size${s.label === pdpState.size ? ' selected' : ''}" data-size="${s.label}"${avail ? '' : ' disabled aria-disabled="true"'}>${s.label}</button>`;
  }).join('');
  const singleSize = color.sizes.length === 1 && /one size/i.test(color.sizes[0].label);

  /* Prezzo: variante selezionata → prezzo variante; altrimenti minimo prodotto */
  const vp = shReady && pdpState.size ? sh.variantPrice(slug, color.name, pdpState.size) : null;
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
      return `<option value="${s.label}"${s.label === pdpState.size ? ' selected' : ''}${avail ? '' : ' disabled'}>${s.label}${avail ? '' : ' — Sold out'}</option>`;
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
          <h1 class="pdp-name">${p.name}</h1>
        </div>
        <div class="pdp-subhead">
          <p class="pdp-material">${p.composition}</p>
          ${ref ? `<p class="pdp-ref">Ref. ${ref}</p>` : ''}
        </div>
        ${soldOut ? '<p class="pdp-soldout-tag">Sold out</p>' : ''}

        <p class="pdp-row-label">Colour</p>
        <div class="pdp-colors">${swatches}</div>
        <p class="pdp-color-name">${color.name}</p>

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
            <p>${p.description}</p>
            ${lookN ? `<p class="pdp-seenin">Seen in ${(p.lookRefs || []).map(n => `<a href="#" data-look-ref="${n}">Look ${n}</a>`).join(', ')}</p>` : ''}
          </div>
          <div class="pdp-tab-panel" data-panel="fit">
            <p>${p.fit ? p.fit : 'Fit information to be provided.'}</p>
            ${p.model && p.model.height && p.model.wears ? `<p>Model is ${p.model.height} and wears size ${p.model.wears}.</p>` : ''}
            <p><button class="pdp-inline-link" id="pdp-sizeguide-2" type="button">Open size guide</button></p>
          </div>
          <div class="pdp-tab-panel" data-panel="care">
            <p>${p.composition}<br>${p.care}</p>
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
      pdpState.colorIdx = parseInt(btn.dataset.idx);
      pdpState.size = null;
      renderPDP(slug);
    });
  });

  const priceEl = () => pdpEl.querySelector('.pdp-add-price');
  const sel = pdpEl.querySelector('#pdp-size-select');
  sel?.addEventListener('change', () => {
    pdpState.size = sel.value || null;
    const hint = document.getElementById('pdp-size-hint');
    if (hint) { hint.textContent = ''; hint.classList.remove('error'); }
    const vp2 = shReady && pdpState.size ? sh.variantPrice(slug, color.name, pdpState.size) : null;
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
    const chosenSize = singleSizeLabel || pdpState.size;
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

/* Ridisegna la PDP quando arrivano i dati Shopify (prezzo/disponibilità reali) */
document.addEventListener('tato:shopify-ready', () => {
  const prod = document.getElementById('product');
  if (prod && prod.classList.contains('active') && pdpState.slug) {
    renderPDP(pdpState.slug);
  }
  if (document.getElementById('shop')?.classList.contains('active')) renderShopGrid();
});

/* ═══════════════════════════════════════════
   PAGINE INFO / LEGALI
   ─────────────────────────────────────────
   Struttura pronta. I contenuti fattuali e legali NON sono
   inventati: dove servono dati reali c'è [DA FORNIRE: …].
   Aggiornare i campi `body` qui sotto.
   ═══════════════════════════════════════════ */
const FLAG = t => `<span class="info-flag">[DA FORNIRE: ${t}]</span>`;
const INFO_PAGES = {
  shipping: {
    title: 'Shipping',
    body: `
      <h1>Shipping</h1>
      <h2>Where we ship</h2><p>${FLAG('elenco dei paesi/zone di spedizione')}</p>
      <h2>Cost</h2><p>${FLAG('costo di spedizione o regola di calcolo per zona / soglia di spedizione gratuita')}</p>
      <h2>Delivery time</h2><p>${FLAG('tempi di consegna stimati per zona')}</p>
      <h2>Tracking</h2><p>${FLAG('corriere utilizzato e modalità di tracking')}</p>
      <h2>Duties &amp; taxes</h2><p>${FLAG('gestione dazi/IVA per spedizioni extra-UE')}</p>`,
  },
  returns: {
    title: 'Returns & Refunds',
    body: `
      <h1>Returns &amp; Refunds</h1>
      <h2>Return window</h2><p>${FLAG('numero di giorni dalla consegna per richiedere il reso')}</p>
      <h2>Conditions</h2><p>${FLAG('condizioni del capo per accettare il reso (etichette, non indossato, ecc.)')}</p>
      <h2>How to return</h2><p>${FLAG('procedura passo-passo: come avviare il reso, dove spedire, etichetta prepagata o meno')}</p>
      <h2>Return cost</h2><p>${FLAG('chi paga la spedizione di reso')}</p>
      <h2>Refund time</h2><p>${FLAG('tempi di rimborso una volta ricevuto il reso')}</p>
      <h2>Exchanges</h2><p>${FLAG('se sono possibili cambi taglia/colore e come')}</p>`,
  },
  faq: {
    title: 'FAQ',
    body: `<h1>FAQ</h1><p>${FLAG('domande e risposte frequenti')}</p>`,
  },
  privacy: {
    title: 'Privacy Policy',
    body: `<h1>Privacy Policy</h1><p>${FLAG('testo legale della privacy policy — deve essere fornito o revisionato da voi / da un legale. Titolare del trattamento, dati raccolti, finalità, base giuridica, conservazione, diritti dell\'interessato, contatti del DPO se previsto.')}</p>`,
  },
  cookies: {
    title: 'Cookie Policy',
    body: `<h1>Cookie Policy</h1><p>${FLAG('elenco dei cookie/tracker effettivamente usati e testo della cookie policy. Dipende da quali strumenti di analytics/marketing verranno attivati.')}</p>`,
  },
  terms: {
    title: 'Terms of Sale',
    body: `<h1>Terms of Sale</h1><p>${FLAG('condizioni generali di vendita — ragione sociale, P.IVA, sede legale, condizioni contrattuali, diritto di recesso, garanzia legale, foro competente. Da fornire o far revisionare a un legale.')}</p>`,
  },
};
const INFO_ROUTES = Object.keys(INFO_PAGES);

function showInfo(route) {
  const data = INFO_PAGES[route];
  const el = document.getElementById('info-body');
  if (!data || !el) return;
  el.innerHTML = `<article class="info-doc">${data.body}
    <p class="info-back"><a href="#shop">← Back to shop</a></p></article>`;
  showSection('info');
  document.getElementById('info')?.classList.add('active');
  setMeta({ title: data.title, description: `${data.title} — TATO.` });
}

/* ─── Meta per vista (title / description / canonical / OG) ──────
   Nota: essendo una SPA con hash routing su hosting statico, i
   crawler che NON eseguono JS vedono solo i meta di index.html.
   Questo aggiorna title/canonical per browser e crawler JS-capaci. */
const BASE_URL = 'https://www.tatorm.com/';
function setMeta({ title, description, canonicalHash, ogImage }) {
  document.title = title ? `${title} — TATO` : 'TATO — Independent Fashion. Designed in Rome, Made in Italy.';
  const set = (sel, attr, val) => { const n = document.head.querySelector(sel); if (n && val) n.setAttribute(attr, val); };
  if (description) {
    set('meta[name="description"]', 'content', description);
    set('meta[property="og:description"]', 'content', description);
    set('meta[name="twitter:description"]', 'content', description);
  }
  set('meta[property="og:title"]', 'content', document.title);
  set('meta[name="twitter:title"]', 'content', document.title);
  const url = BASE_URL + (canonicalHash ? '#' + canonicalHash : '');
  set('link[rel="canonical"]', 'href', url);
  set('meta[property="og:url"]', 'content', url);
  if (ogImage) {
    const abs = ogImage.startsWith('http') ? ogImage : BASE_URL + ogImage.replace(/^\//, '');
    set('meta[property="og:image"]', 'content', abs);
    set('meta[name="twitter:image"]', 'content', abs);
  }
}

/* JSON-LD Product per la PDP (rimosso quando si esce dalla PDP) */
function setProductJsonLd(p) {
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
      availability: avail, url: BASE_URL + '#product/' + p.slug,
    },
  };
  const s = document.createElement('script');
  s.type = 'application/ld+json';
  s.id = 'ld-product';
  s.textContent = JSON.stringify(data);
  document.head.appendChild(s);
}

/* ─── Routing hash ───────────────────────── */
function handleShopRoute() {
  const hash = location.hash.replace(/^#/, '');
  const parts = hash.split('/');
  const route = parts[0];
  const a = parts[1] || '';
  const b = parts[2] || '';

  if (!hash)               { setProductJsonLd(null); setMeta({}); showSection('home');       return; }
  if (route === 'collection') { setProductJsonLd(null); setMeta({ title: 'Collection', description: 'The TATO collection — 21 looks. Designed in Rome, made in Italy.', canonicalHash: 'collection' }); showSection('collection'); return; }
  if (route === 'about')      { setProductJsonLd(null); setMeta({ title: 'Contacts', description: 'Get in touch with TATO — general, press and sales enquiries.', canonicalHash: 'about' }); showSection('about'); return; }
  if (INFO_ROUTES.includes(route)) { setProductJsonLd(null); showInfo(route); return; }

  if (route === 'product' && a) {
    if (renderPDP(a)) {
      showSection('product');
      document.getElementById('product')?.classList.add('active');
      const p = window.TATO_getProduct(a);
      if (p) {
        const pd = window.TATO_shopify && window.TATO_shopify.ready ? window.TATO_shopify.productData(a) : null;
        const price = pd && pd.minPrice != null ? pd.minPrice : p.price;
        setMeta({
          title: p.name,
          description: `${p.name} — ${p.composition}. ${p.description}`.slice(0, 300),
          canonicalHash: 'product/' + a,
          ogImage: (pd && pd.images && pd.images[0]) || (window.TATO_lookImages ? window.TATO_lookImages(p.lookRefs, { onePerLook: true, limit: 1 })[0] : null),
        });
        setProductJsonLd(p);
      }
    }
    return;
  }

  if (route === 'shop') {
    const isCat = slug => CATEGORIES.some(c => c.slug === slug);
    if (a === 'women' || a === 'men') {
      shopScope    = a;
      shopCategory = isCat(b) ? b : 'all';
    } else if (a === 'accessories') {
      shopScope    = 'accessories';
      shopCategory = 'all';
    } else if (isCat(a)) {
      shopScope    = 'new';
      shopCategory = a;
    } else {
      shopScope    = 'new';
      shopCategory = 'all';
    }
    renderShop();
    showSection('shop');
    document.getElementById('shop')?.classList.add('active');
    setProductJsonLd(null);
    const label = shopTitleEl ? shopTitleEl.textContent : 'Shop';
    setMeta({
      title: label,
      description: `Shop ${label} — TATO. Independent fashion, designed in Rome, made in Italy.`,
      canonicalHash: hash,
    });
  }
}

window.addEventListener('hashchange', handleShopRoute);

/* Deep-link all'apertura */
(function initShopRoute() {
  renderShop();
  const h = location.hash.replace(/^#/, '');
  const first = h.split('/')[0];
  if (h === 'shop' || h.startsWith('shop/') || h.startsWith('product/') ||
      h === 'collection' || h === 'about' || INFO_ROUTES.includes(first)) {
    window.addEventListener('load', handleShopRoute, { once: true });
  }
})();

/* ═══════════════════════════════════════════
   PROTEZIONE IMMAGINI
   ═══════════════════════════════════════════ */
document.addEventListener('contextmenu', e => {
  if (e.target.tagName === 'IMG') e.preventDefault();
});
document.addEventListener('dragstart', e => {
  if (e.target.tagName === 'IMG') e.preventDefault();
});

/* ═══════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════ */
// Mostra home al caricamento (già .active nel HTML)
// Il pannello look parte nascosto (aggiunto da showSection)
fixedLookInfo.classList.remove('panel-visible');

// Ripristina il carrello salvato (localStorage) all'avvio
updateBadge();
renderCart();

// Sincronizza il carrello tra schede aperte
window.addEventListener('storage', e => {
  if (e.key === CART_KEY) { cart = loadCart(); updateBadge(); renderCart(); }
});

/* ═══════════════════════════════════════════
   DARK / LIGHT MODE TOGGLE
   ═══════════════════════════════════════════ */
const btnTheme = document.getElementById('btn-theme');

function applyTheme(dark) {
  document.body.classList.toggle('dark-mode', dark);
  btnTheme.setAttribute('aria-pressed', String(dark));
}

// Ripristina preferenza salvata
applyTheme(localStorage.getItem('tato-dark') === 'true');

function toggleTheme() {
  const isDark = !document.body.classList.contains('dark-mode');
  applyTheme(isDark);
  localStorage.setItem('tato-dark', isDark);
}
btnTheme.addEventListener('click', toggleTheme);
// role="button" su un <div>: la tastiera non lo attiva da sé.
btnTheme.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleTheme(); }
});
