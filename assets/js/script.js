/* ═══════════════════════════════════════════
   TATO — script.js
   ═══════════════════════════════════════════ */

history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

/* ─── Catalogo prezzi ────────────────────── */
const itemPrices = {
  '2 BUTTON WINDBREAKER':       280,
  'BACK SHIRT':                 180,
  'TOBI PANTS':                 220,
  'CROPPED TAILORED JACKET':    390,
  '2 BUTTON TAILORED PANTS':    280,
  'CARDIGAN V NECK':            320,
  '2 BUTTON SHIRT DRESS':       260,
  'TAILORED PANTS':             280,
  'TINY CREWNECK':              160,
  '2 BUTTON SHIRT':             180,
  'RIB BOMBER':                 360,
  '2 BUTTON MIDI SKIRT':        240,
  'TAILORED JACKET':            390,
  'SIDE WAY VEST':              220,
  'SIDE WAY ZIP-UP':            280,
  'HOODIE':                     200,
  '3/4 ZIP-UP':                 260,
  'INSIDE OUT SELVEDGE DENIM':  320,
  'TATO CAP':                    80,
  'TATO TAILORING CAP':          90,
  'SMOCK LONGSLEEVE':            180,
  'TRIPLE BREASTED COAT':        520,
  '2 BUTTON LONG SKIRT':         240,
  'TRIPLE BREASTED BOMBER':      450,
};

/* ─── Home feed — ordine casuale + scroll infinito ─ */
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
    const s = document.createElement('source');
    s.type = 'image/avif';
    s.srcset = `${base}-900.avif 900w, ${base}-1440.avif 1440w`;
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

function appendPhotos(feed, photos, isFirst) {
  photos.forEach((src, i) => {
    const fig = document.createElement('figure');
    const hero = isFirst && i === 0;
    fig.className = hero ? 'home-image-block home-hero' : 'home-image-block';
    fig.appendChild(pictureEl(src, {
      eager: hero,
      sizes: '(max-width: 768px) 100vw, min(700px, 36vw)',
    }));
    feed.appendChild(fig);
  });
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

function pgridCardHTML(p, showTag) {
  const img   = productImgSrc(p);
  const media = img.src
    ? pictureHTML(img.src, { alt: p.name, sizes: '(max-width: 768px) 50vw, 25vw' })
    : '<span class="ph-block"></span>';
  const tag = showTag
    ? `<span class="pgrid-tag">${window.TATO_getCategoryLabel ? window.TATO_getCategoryLabel(p.category) : p.category}</span>`
    : '';
  const sold = p.status === 'sold-out';
  return `
    <a class="pgrid-card${sold ? ' is-soldout' : ''}" href="#product/${p.slug}" data-slug="${p.slug}">
      <span class="pgrid-media${img.flat ? ' is-flat' : ''}">
        ${media}
        ${tag}
      </span>
      <span class="pgrid-name">${p.name}</span>
      <span class="pgrid-price">${sold ? 'Sold out' : money(p.price, p.currency)}</span>
    </a>`;
}

/* showTag: pill categoria mostrata solo in Home e in New Arrivals
   (nascosta quando si sta filtrando per una categoria o un reparto) */
function pgridHTML(list, showTag) {
  if (!list || !list.length) return '<p class="pgrid-empty">Coming soon.</p>';
  return list.map(p => pgridCardHTML(p, showTag)).join('');
}

(function buildHomeFeed() {
  const feed = document.getElementById('home-feed');
  if (!feed) return;

  const photos = shuffle(allHomePhotos);
  appendPhotos(feed, photos.slice(0, 1), true);          // hero
  const grid = document.createElement('div');
  grid.className = 'pgrid home-pgrid';
  grid.innerHTML = pgridHTML((window.TATO_PRODUCTS || []).slice(0, 4), true);  // 1 sola riga
  feed.appendChild(grid);

  // Sotto la riga: il cappello come singolo prodotto in evidenza
  const cap = window.TATO_getProduct && window.TATO_getProduct('tato-cap');
  if (cap) {
    const feature = document.createElement('div');
    feature.className = 'home-feature';
    feature.innerHTML = pgridCardHTML(cap, true);
    feed.appendChild(feature);
  }

  layoutHome();
})();

/* ─── Look data ──────────────────────────── */
const lookData = {
  '1': {
    number: 'LOOK #1',
    items: [
      { name: '2 BUTTON WINDBREAKER', info: ['100% Cotton', 'Color: White'] },
      { name: 'BACK SHIRT',           info: ['100% Cotton', 'Color: White'] },
      { name: 'TOBI PANTS',           info: ['100% Cotton', 'Color: White'] }
    ]
  },
  '2': {
    number: 'LOOK #2',
    items: [
      { name: 'CROPPED TAILORED JACKET', info: ['100% Wool',   'Color: Anthracite'] },
      { name: 'BACK SHIRT',              info: ['100% Cotton', 'Color: Black'] },
      { name: '2 BUTTON TAILORED PANTS', info: ['100% Wool',   'Color: Anthracite'] }
    ]
  },
  '3': {
    number: 'LOOK #3',
    items: [
      { name: 'CARDIGAN V NECK',         info: ['100% Wool',   'Color: Chocolate'] },
      { name: 'BACK SHIRT',              info: ['100% Cotton', 'Color: White'] },
      { name: '2 BUTTON TAILORED PANTS', info: ['100% Wool',   'Color: Anthracite'] }
    ]
  },
  '4': {
    number: 'LOOK #4',
    items: [
      { name: '2 BUTTON SHIRT DRESS', info: ['100% Cotton', 'Color: Baby Blue'] },
      { name: 'TAILORED PANTS',       info: ['100% Wool',   'Color: Anthracite'] }
    ]
  },
  '5': {
    number: 'LOOK #5',
    items: [
      { name: 'CARDIGAN V NECK',  info: ['100% Wool',   'Color: Lilac'] },
      { name: 'TINY CREWNECK',    info: ['100% Cotton', 'Color: Baby Blue'] },
      { name: '2 BUTTON SHIRT',   info: ['100% Cotton', 'Color: White'] },
      { name: 'TOBI PANTS',       info: ['100% Cotton', 'Color: Black'] }
    ]
  },
  '6': {
    number: 'LOOK #6',
    items: [
      { name: 'RIB BOMBER',        info: ['100% Nylon',  'Color: Green / Chocolate'] },
      { name: 'CARDIGAN V NECK',   info: ['100% Wool',   'Color: Baby Green'] },
      { name: '2 BUTTON SHIRT',    info: ['100% Cotton', 'Color: Baby Pink'] },
      { name: '2 BUTTON MIDI SKIRT', info: ['100% Wool', 'Color: Anthracite'] }
    ]
  },
  '7': {
    number: 'LOOK #7',
    items: [
      { name: 'TAILORED JACKET', info: ['100% Wool',   'Color: Anthracite'] },
      { name: 'BACK SHIRT',      info: ['100% Cotton', 'Color: White'] },
      { name: 'TAILORED PANTS',  info: ['100% Wool',   'Color: Anthracite'] }
    ]
  },
  '8': {
    number: 'LOOK #8',
    items: [
      { name: 'CARDIGAN V NECK',  info: ['100% Wool',   'Color: Cherry'] },
      { name: 'SIDE WAY VEST',    info: ['100% Cotton', 'Color: Burgundy'] },
      { name: '2 BUTTON SHIRT',   info: ['100% Cotton', 'Color: Baby Pink'] },
      { name: 'TOBI PANTS',       info: ['100% Cotton', 'Color: Baby Pink'] }
    ]
  },
  '9': {
    number: 'LOOK #9',
    items: [
      { name: 'SIDE WAY ZIP-UP',           info: ['100% Cotton', 'Color: Dark Navy'] },
      { name: 'HOODIE',                    info: ['100% Cotton', 'Color: Dark Navy'] },
      { name: '3/4 ZIP-UP',               info: ['100% Cotton', 'Color: Dark Navy'] },
      { name: 'INSIDE OUT SELVEDGE DENIM', info: ['100% Cotton', 'Color: Black Denim'] },
      { name: 'TATO CAP',                  info: ['100% Cotton', 'Color: Green'] }
    ]
  },
  '10': {
    number: 'LOOK #10',
    items: [
      { name: 'CROPPED TAILORED JACKET', info: ['100% Wool',   'Color: Anthracite'] },
      { name: 'SMOCK LONGSLEEVE',        info: ['100% Cotton', 'Color: White'] },
      { name: 'TOBI PANTS',              info: ['100% Cotton', 'Color: Black'] }
    ]
  },
  '11': {
    number: 'LOOK #11',
    items: [
      { name: 'TRIPLE BREASTED COAT',    info: ['100% Wool',   'Color: Dark Blue'] },
      { name: 'CROPPED TAILORED JACKET', info: ['100% Wool',   'Color: Anthracite'] },
      { name: 'BACK SHIRT',              info: ['100% Cotton', 'Color: White'] },
      { name: '2 BUTTON LONG SKIRT',     info: ['100% Wool',   'Color: Anthracite'] }
    ]
  },
  '12': {
    number: 'LOOK #12',
    items: [
      { name: 'BACK SHIRT',          info: ['100% Cotton', 'Color: White'] },
      { name: '2 BUTTON LONG SKIRT', info: ['100% Cotton', 'Color: Shiny White'] }
    ]
  },
  '13': {
    number: 'LOOK #13',
    items: [
      { name: 'CROPPED TAILORED JACKET', info: ['100% Wool',   'Color: Anthracite'] },
      { name: '2 BUTTON SHIRT',          info: ['100% Cotton', 'Color: White'] },
      { name: '2 BUTTON TAILORED PANTS', info: ['100% Wool',   'Color: Anthracite'] }
    ]
  },
  '14': {
    number: 'LOOK #14',
    items: [
      { name: 'TRIPLE BREASTED COAT', info: ['100% Wool',   'Color: Dark Blue'] },
      { name: 'BACK SHIRT',           info: ['100% Cotton', 'Color: White'] },
      { name: 'TAILORED PANTS',       info: ['100% Wool',   'Color: Anthracite'] }
    ]
  },
  '15': {
    number: 'LOOK #15',
    items: [
      { name: 'RIB BOMBER',             info: ['100% Nylon',  'Color: Green / Chocolate'] },
      { name: '2 BUTTON WINDBREAKER',   info: ['100% Cotton', 'Color: Grey'] },
      { name: '2 BUTTON SHIRT',         info: ['100% Cotton', 'Color: Baby Blue'] },
      { name: '2 BUTTON TAILORED PANTS', info: ['100% Wool',  'Color: Anthracite'] }
    ]
  },
  '16': {
    number: 'LOOK #16',
    items: [
      { name: 'RIB BOMBER',           info: ['100% Nylon',  'Color: Dark Navy / Black'] },
      { name: '2 BUTTON WINDBREAKER', info: ['100% Cotton', 'Color: White'] },
      { name: 'TOBI PANTS',           info: ['100% Cotton', 'Color: White'] }
    ]
  },
  '17': {
    number: 'LOOK #17',
    items: [
      { name: 'TAILORED JACKET',     info: ['100% Wool',   'Color: Anthracite'] },
      { name: 'SMOCK LONGSLEEVE',    info: ['100% Cotton', 'Color: Baby Pink'] },
      { name: '2 BUTTON MIDI SKIRT', info: ['100% Wool',   'Color: Anthracite'] },
      { name: '2 BUTTON LONG SKIRT', info: ['100% Wool',   'Color: Black'] }
    ]
  },
  '18': {
    number: 'LOOK #18',
    items: [
      { name: 'BACK SHIRT',          info: ['100% Cotton', 'Color: Black'] },
      { name: '2 BUTTON LONG SKIRT', info: ['100% Cotton', 'Color: Black'] }
    ]
  },
  '19': {
    number: 'LOOK #19',
    items: [
      { name: 'CARDIGAN V NECK',      info: ['100% Wool',   'Color: Lilac'] },
      { name: '2 BUTTON WINDBREAKER', info: ['100% Cotton', 'Color: Baby Blue / Oriental Blue'] },
      { name: 'BACK SHIRT',           info: ['100% Cotton', 'Color: White'] },
      { name: 'TAILORED PANTS',       info: ['100% Wool',   'Color: Anthracite'] }
    ]
  },
  '20': {
    number: 'LOOK #20',
    items: [
      { name: 'TRIPLE BREASTED BOMBER', info: ['100% Wool',   'Color: Dark Blue'] },
      { name: 'SMOCK LONGSLEEVE',       info: ['100% Cotton', 'Color: Navy / Bordeaux'] },
      { name: 'TOBI PANTS',             info: ['100% Cotton', 'Color: Navy'] },
      { name: 'TATO TAILORING CAP',     info: ['100% Cotton', 'Color: Washed Black'] }
    ]
  },
  '21': {
    number: 'LOOK #21',
    items: [
      { name: '2 BUTTON SHIRT DRESS', info: ['100% Cotton', 'Color: White'] },
      { name: '2 BUTTON LONG SKIRT',  info: ['100% Cotton', 'Color: Shiny White'] }
    ]
  }
};

/* ═══════════════════════════════════════════
   LAYOUT CAROSELLI — posizionamento forzato
   Usa window.innerHeight in px, zero catene CSS
   ═══════════════════════════════════════════ */
function layoutCarousels() {
  const vh = window.innerHeight;
  const vc = document.querySelector('.visual-column');
  const carousels = document.querySelectorAll('.look-carousel');
  if (!vc || !carousels.length) return;

  vc.style.height   = (carousels.length * vh) + 'px';
  vc.style.position = 'relative';

  carousels.forEach((c, i) => {
    c.style.position = 'absolute';
    c.style.top      = (i * vh) + 'px';
    c.style.height   = vh + 'px';
    const track = c.querySelector('.carousel-track');
    if (track) track.style.height = vh + 'px';

  });
}

layoutCarousels();

function layoutHome() {
  const vh = window.innerHeight;
  const hero = document.querySelector('.home-hero');
  if (!hero) return;
  hero.style.height = vh + 'px';
  const img = hero.querySelector('img');
  if (img) img.style.height = vh + 'px';
}
layoutHome();

window.addEventListener('resize', () => {
  layoutCarousels();
  layoutHome();
});

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

/* ─── Carrello ──────────────────────────── */
let cart = [];
let cartNextId = 0;

function addToCart(item) {
  cart.push({ id: cartNextId++, ...item });
  updateBadge();
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateBadge();
  renderCart();
}

function updateBadge() {
  const badge = document.getElementById('cart-badge');
  if (!badge) return;
  badge.textContent = cart.length;
  badge.classList.toggle('hidden', cart.length === 0);
}

function renderCart() {
  const body   = document.getElementById('cart-body');
  const footer = document.getElementById('cart-footer');
  if (!body || !footer) return;

  if (cart.length === 0) {
    body.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
    footer.classList.add('hidden');
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  body.innerHTML = cart.map(item => `
    <div class="cart-item-row">
      <div class="cart-item-info">
        <p class="cart-item-name">${item.name}</p>
        <p class="cart-item-meta">${item.size}${item.color ? ' · ' + item.color : ''}</p>
        <p class="cart-item-look">${item.look}</p>
      </div>
      <div class="cart-item-right">
        <p class="cart-item-price">€${item.price}</p>
        <button class="cart-remove-btn" data-id="${item.id}" aria-label="Remove">×</button>
      </div>
    </div>
  `).join('');

  footer.classList.remove('hidden');
  document.getElementById('cart-total').textContent = `€${total}`;

  body.querySelectorAll('.cart-remove-btn').forEach(btn => {
    btn.addEventListener('click', () => removeFromCart(parseInt(btn.dataset.id)));
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
      showSection(a.dataset.section);
    });
  });
  navLinks.querySelectorAll('.nav-group-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const grp = btn.closest('.nav-group');
      const wasOpen = grp.classList.contains('open');
      navLinks.querySelectorAll('.nav-group').forEach(g => g.classList.remove('open'));
      if (!wasOpen) grp.classList.add('open');
    });
  });
}

function closeNav() {
  navLinks.classList.remove('open');
  navLinks.querySelectorAll('.nav-group').forEach(g => g.classList.remove('open'));
}

function showSection(id) {
  // Reset scroll prima di tutto per evitare che l'IntersectionObserver
  // legga la posizione della home e mostri il look sbagliato su mobile
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

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
    });
  });

  // Gestisci visibilità pannello look e breadcrumb
  if (id === 'collection') {
    fixedLookInfo.classList.add('panel-visible');
    siteBreadcrumb.classList.add('visible');
    siteNav.style.opacity       = '0';
    siteNav.style.pointerEvents = 'none';
    layoutCarousels();
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
  }

  // Modalità header per shop / product
  document.body.classList.toggle('shop-mode', id === 'shop' || id === 'product');

  // Pulisci l'hash quando si torna a una sezione non-shop
  if (id === 'home' || id === 'collection' || id === 'about') {
    if (location.hash) history.replaceState(null, '', location.pathname + location.search);
  }

  closeNav();
}

// Click su link breadcrumb (statici nell'HTML)
document.querySelectorAll('[data-section]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    showSection(link.dataset.section);
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
  else navLinks.classList.add('open');
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
    const on = window.TATO_shopify && window.TATO_shopify.ready;
    if (note) note.textContent = on
      ? 'Secure checkout on Shopify.'
      : 'Payment integration coming soon.';
  }
  document.addEventListener('tato:shopify-ready', syncNote);
  syncNote();

  btn.addEventListener('click', async () => {
    if (!window.TATO_shopify || !window.TATO_shopify.ready) return;

    const lineItems = cart
      .filter(i => i.shopifyVariantId)
      .map(i => ({ variantId: i.shopifyVariantId, quantity: 1 }));

    if (!lineItems.length) {
      if (note) note.textContent = 'Nothing linkable to checkout yet.';
      return;
    }

    const original = btn.textContent;
    btn.textContent = 'Redirecting…';
    btn.disabled = true;
    try {
      const url = await window.TATO_shopify.createCheckoutUrl(lineItems);
      if (url) { window.location.href = url; return; }
      throw new Error('no url');
    } catch (e) {
      console.warn('[TATO] checkout fallito:', e);
      if (note) note.textContent = 'Checkout error — retry.';
      btn.textContent = original;
      btn.disabled = false;
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

function renderLookPanel(lookKey) {
  if (lookKey === activeLook) return;
  activeLook = lookKey;

  const data = lookData[lookKey];
  if (!data) return;

  fixedLookInfo.classList.add('panel-updating');

  setTimeout(() => {
    const itemsHTML = data.items.map((item, idx) => {
      const price     = itemPrices[item.name] || 0;
      const colorInfo = item.info.find(i => i.startsWith('Color:')) || '';
      return `
        <div class="panel-item">
          <p class="panel-item-name">${item.name}</p>
          ${item.info.map(i => `<p class="panel-item-info">${i}</p>`).join('')}
          <p class="panel-item-price">€${price}</p>
          <div class="panel-size-row" data-item-idx="${idx}">
            ${['XS','S','M','L','XL'].map(s => `<button class="size-btn" data-size="${s}">${s}</button>`).join('')}
          </div>
          <button class="panel-add-btn"
            data-name="${item.name}"
            data-price="${price}"
            data-look="${data.number}"
            data-color="${colorInfo}"
            data-item-idx="${idx}">ADD TO CART</button>
        </div>
      `;
    }).join('');

    fixedLookInfo.innerHTML = `
      <p class="panel-look-number">${data.number}</p>
      <div class="panel-look-items">${itemsHTML}</div>
    `;

    fixedLookInfo.classList.remove('panel-updating');

    fixedLookInfo.querySelectorAll('.panel-size-row').forEach(row => {
      row.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          row.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
        });
      });
    });

    fixedLookInfo.querySelectorAll('.panel-add-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx      = btn.dataset.itemIdx;
        const sizeRow  = fixedLookInfo.querySelector(`.panel-size-row[data-item-idx="${idx}"]`);
        const selected = sizeRow?.querySelector('.size-btn.selected');
        if (!selected) {
          sizeRow?.classList.add('size-required');
          setTimeout(() => sizeRow?.classList.remove('size-required'), 600);
          return;
        }
        addToCart({
          name:  btn.dataset.name,
          price: parseInt(btn.dataset.price),
          look:  btn.dataset.look,
          color: btn.dataset.color,
          size:  selected.dataset.size,
        });
        btn.textContent = 'ADDED';
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = 'ADD TO CART';
          btn.disabled = false;
        }, 1600);
      });
    });
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
  const showTag = shopScope === 'new' && shopCategory === 'all';   // solo New Arrivals
  shopGrid.innerHTML = pgridHTML(shopFilteredProducts(), showTag);
}

function renderShop() {
  renderShopHead();
  renderShopGrid();
}

/* ─── PDP: scheda prodotto ───────────────── */
function renderPDP(slug) {
  const p = window.TATO_getProduct(slug);
  if (!p || !pdpEl) return false;

  if (pdpState.slug !== slug) pdpState = { slug, colorIdx: 0, size: null };
  const color = p.colors[pdpState.colorIdx] || p.colors[0];

  let galleryImgs = (color.images && color.images.length) ? color.images.slice() : [];
  const galleryFlat = galleryImgs.length > 0;   // packshot flat vs foto dei look
  if (!galleryImgs.length && window.TATO_lookImages) {
    galleryImgs = window.TATO_lookImages(p.lookRefs, { onePerLook: true, limit: 8 });
  }
  const gallery = galleryImgs.length
    ? galleryImgs.map((src, i) => pictureHTML(src, {
        alt: p.name,
        cls: 'pdp-gallery-img',
        eager: i === 0,
        sizes: '(max-width: 768px) 50vw, min(900px, 60vw)',
      })).join('')
    : Array.from({ length: 3 }, () => '<span class="ph-block"></span>').join('');

  const swatches = p.colors.map((c, i) =>
    `<button class="pdp-color${i === pdpState.colorIdx ? ' selected' : ''}" data-idx="${i}" style="background:${c.hex}" aria-label="${c.name}"></button>`
  ).join('');

  const sizes = color.sizes.map(s =>
    `<button class="pdp-size${s.label === pdpState.size ? ' selected' : ''}" data-size="${s.label}"${s.available ? '' : ' disabled'}>${s.label}</button>`
  ).join('');

  const lookLinks = (p.lookRefs || []).map(n => `<a href="#" data-look-ref="${n}">Look ${n}</a>`).join(', ');

  pdpEl.innerHTML = `
    <div class="pdp-gallery${galleryFlat ? ' is-flat' : ''}">${gallery}</div>
    <div class="pdp-info">
      <button class="pdp-back" id="pdp-back">← Shop</button>
      <h1 class="pdp-name">${p.name}</h1>
      <p class="pdp-price">${money(p.price, p.currency)}</p>

      <p class="pdp-row-label">Colour</p>
      <div class="pdp-colors">${swatches}</div>
      <p class="pdp-color-name">${color.name}</p>

      <p class="pdp-row-label">Size</p>
      <div class="pdp-sizes">${sizes}</div>
      <p class="pdp-size-hint" id="pdp-size-hint"></p>

      <button class="pdp-add-btn" id="pdp-add">Add to bag</button>

      <div class="pdp-accordion">
        <div class="pdp-acc-item open">
          <button class="pdp-acc-head">Description <span class="pdp-acc-sign">–</span></button>
          <div class="pdp-acc-body">${p.description}</div>
        </div>
        <div class="pdp-acc-item">
          <button class="pdp-acc-head">Composition &amp; Care <span class="pdp-acc-sign">+</span></button>
          <div class="pdp-acc-body">${p.composition}<br>${p.care}</div>
        </div>
        <div class="pdp-acc-item">
          <button class="pdp-acc-head">Shipping &amp; Returns <span class="pdp-acc-sign">+</span></button>
          <div class="pdp-acc-body">Free shipping within the EU. Returns accepted within 14 days of delivery.</div>
        </div>
        ${lookLinks ? `<div class="pdp-acc-item open">
          <button class="pdp-acc-head">Seen in <span class="pdp-acc-sign">–</span></button>
          <div class="pdp-acc-body pdp-lookrefs">${lookLinks}</div>
        </div>` : ''}
      </div>
    </div>
  `;

  pdpEl.querySelectorAll('.pdp-color').forEach(btn => {
    btn.addEventListener('click', () => {
      pdpState.colorIdx = parseInt(btn.dataset.idx);
      pdpState.size = null;
      renderPDP(slug);
    });
  });

  pdpEl.querySelectorAll('.pdp-size').forEach(btn => {
    if (btn.disabled) return;
    btn.addEventListener('click', () => {
      pdpEl.querySelectorAll('.pdp-size').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      pdpState.size = btn.dataset.size;
      const hint = document.getElementById('pdp-size-hint');
      if (hint) { hint.textContent = ''; hint.classList.remove('error'); }
    });
  });

  pdpEl.querySelectorAll('.pdp-acc-head').forEach(head => {
    head.addEventListener('click', () => {
      const item = head.closest('.pdp-acc-item');
      item.classList.toggle('open');
      const sign = head.querySelector('.pdp-acc-sign');
      if (sign) sign.textContent = item.classList.contains('open') ? '–' : '+';
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

  document.getElementById('pdp-add')?.addEventListener('click', () => {
    if (!pdpState.size) {
      const hint = document.getElementById('pdp-size-hint');
      if (hint) { hint.textContent = 'Select a size'; hint.classList.add('error'); }
      return;
    }
    addToCart({
      name:  p.name,
      price: p.price,
      look:  window.TATO_getCategoryLabel(p.category),
      color: color.name,
      size:  pdpState.size,
      shopifyVariantId: window.TATO_shopify
        ? window.TATO_shopify.variantId(p.slug, color.name, pdpState.size)
        : null,
    });
    const btn = document.getElementById('pdp-add');
    btn.textContent = 'Added';
    btn.disabled = true;
    openCart();
    setTimeout(() => { btn.textContent = 'Add to bag'; btn.disabled = false; }, 1600);
  });

  return true;
}

/* ─── Routing hash ───────────────────────── */
function handleShopRoute() {
  const hash = location.hash.replace(/^#/, '');
  if (!hash) return;
  const parts = hash.split('/');
  const route = parts[0];
  const a = parts[1] || '';
  const b = parts[2] || '';

  if (route === 'product' && a) {
    if (renderPDP(a)) {
      showSection('product');
      document.getElementById('product')?.classList.add('active');
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
  }
}

window.addEventListener('hashchange', handleShopRoute);

/* Deep-link all'apertura: #shop o #product/<slug> */
(function initShopRoute() {
  renderShop();
  const h = location.hash.replace(/^#/, '');
  if (h === 'shop' || h.startsWith('shop/') || h.startsWith('product/')) {
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

/* ═══════════════════════════════════════════
   DARK / LIGHT MODE TOGGLE
   ═══════════════════════════════════════════ */
const btnTheme = document.getElementById('btn-theme');

function applyTheme(dark) {
  document.body.classList.toggle('dark-mode', dark);
}

// Ripristina preferenza salvata
applyTheme(localStorage.getItem('tato-dark') === 'true');

btnTheme.addEventListener('click', () => {
  const isDark = !document.body.classList.contains('dark-mode');
  applyTheme(isDark);
  localStorage.setItem('tato-dark', isDark);
});
