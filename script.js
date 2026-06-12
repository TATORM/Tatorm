/* ═══════════════════════════════════════════
   TATO — script.js
   ═══════════════════════════════════════════ */

history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

/* ─── Home feed — ordine casuale + scroll infinito ─ */
const allHomePhotos = [
  'EXTRA%20HOME%20PAGE/CROP%20STORIA%20INSTAGRAM-73.jpg',
  'EXTRA%20HOME%20PAGE/QS4A0029.jpg',
  'EXTRA%20HOME%20PAGE/QS4A0271.jpg',
  'EXTRA%20HOME%20PAGE/QS4A0314.jpg',
  'EXTRA%20HOME%20PAGE/QS4A0486.jpg',
  'EXTRA%20HOME%20PAGE/QS4A0494.jpg',
  'EXTRA%20HOME%20PAGE/QS4A0495.jpg',
  'EXTRA%20HOME%20PAGE/QS4A0882.jpg',
  'EXTRA%20HOME%20PAGE/QS4A1012.jpg',
  'EXTRA%20HOME%20PAGE/QS4A1124.jpg',
  'EXTRA%20HOME%20PAGE/QS4A1440.jpg',
  'EXTRA%20HOME%20PAGE/QS4A1669.jpg',
  'EXTRA%20HOME%20PAGE/QS4A1737.jpg',
  'EXTRA%20HOME%20PAGE/QS4A1880.jpg',
  'EXTRA%20HOME%20PAGE/QS4A1948.jpg',
  'EXTRA%20HOME%20PAGE/QS4A9479.jpg',
  'EXTRA%20HOME%20PAGE/QS4A9696.jpg',
  'EXTRA%20HOME%20PAGE/foto-01.jpg',
  'EXTRA%20HOME%20PAGE/foto-015.jpg',
  'EXTRA%20HOME%20PAGE/foto-08.png',
  'EXTRA%20HOME%20PAGE/foto-09.png',
  'FOTO%20LOOK/LOOK%201/LOOK%201_PHOTO1.jpg',
  'FOTO%20LOOK/LOOK%201/LOOK%201_PHOTO2.jpg',
  'FOTO%20LOOK/LOOK%202/LOOK%202_PHOTO1.jpg',
  'FOTO%20LOOK/LOOK%202/LOOK%202_PHOTO2.jpg',
  'FOTO%20LOOK/LOOK%202/LOOK%202_PHOTO3.jpg',
  'FOTO%20LOOK/LOOK%202/LOOK%202_PHOTO4.jpg',
  'FOTO%20LOOK/LOOK%202/LOOK%202_PHOTO5.jpg',
  'FOTO%20LOOK/LOOK%203/LOOK%203_PHOTO1.jpg',
  'FOTO%20LOOK/LOOK%203/LOOK%203_PHOTO2.jpg',
  'FOTO%20LOOK/LOOK%204/LOOK%204_PHOTO1.jpg',
  'FOTO%20LOOK/LOOK%204/LOOK%204_PHOTO2.jpg',
  'FOTO%20LOOK/LOOK%204/LOOK%204_PHOTO3.jpg',
  'FOTO%20LOOK/LOOK%204/CROP%20STORIA%20INSTAGRAM-29.jpg',
  'FOTO%20LOOK/LOOK%205/LOOK%205_PHOTO1.jpg',
  'FOTO%20LOOK/LOOK%205/LOOK%205_PHOTO2.jpg',
  'FOTO%20LOOK/LOOK%205/LOOK%205_PHOTO3.jpg',
  'FOTO%20LOOK/LOOK%206/LOOK%206_PHOTO1.jpg',
  'FOTO%20LOOK/LOOK%206/LOOK%206_PHOTO2.jpg',
  'FOTO%20LOOK/LOOK%206/LOOK%206_PHOTO3.jpg',
  'FOTO%20LOOK/LOOK%206/LOOK%206_PHOTO4.jpg',
  'FOTO%20LOOK/LOOK%207/LOOK%207_PHOTO1.jpg',
  'FOTO%20LOOK/LOOK%207/LOOK%207_PHOTO2.jpg',
  'FOTO%20LOOK/LOOK%207/LOOK%207_PHOTO3.jpg',
  'FOTO%20LOOK/LOOK%208/LOOK%208_PHOTO1.jpg',
  'FOTO%20LOOK/LOOK%208/LOOK%208_PHOTO2.jpg',
  'FOTO%20LOOK/LOOK%208/LOOK%208_PHOTO3.jpg',
  'FOTO%20LOOK/LOOK%208/LOOK%208_PHOTO4.jpg',
  'FOTO%20LOOK/LOOK%208/LOOK%208_PHOTO5.jpg',
  'FOTO%20LOOK/LOOK%209/LOOK%209_PHOTO1.jpg',
  'FOTO%20LOOK/LOOK%209/LOOK%209_PHOTO2.jpg',
  'FOTO%20LOOK/LOOK%2010/LOOK%2010_PHOTO1.jpg',
  'FOTO%20LOOK/LOOK%2010/LOOK%2010_PHOTO2.jpg',
  'FOTO%20LOOK/LOOK%2010/LOOK%2010_PHOTO3.jpg',
  'FOTO%20LOOK/LOOK%2011/LOOK%2011_PHOTO1.jpg',
  'FOTO%20LOOK/LOOK%2011/LOOK%2011_PHOTO2.jpg',
  'FOTO%20LOOK/LOOK%2011/LOOK%2011_PHOTO3.jpg',
  'FOTO%20LOOK/LOOK%2011/LOOK%2011_PHOTO4.jpg',
  'FOTO%20LOOK/LOOK%2011/LOOK%2011_PHOTO5.jpg',
  'FOTO%20LOOK/LOOK%2011/LOOK%2011_PHOTO6.jpg',
  'FOTO%20LOOK/LOOK%2011/LOOK%2011_PHOTO7.jpg',
  'FOTO%20LOOK/LOOK%2011/LOOK%2011_PHOTO8.jpg',
  'FOTO%20LOOK/LOOK%2012/LOOK%2012_PHOTO1.jpg',
  'FOTO%20LOOK/LOOK%2012/LOOK%2012_PHOTO2.jpg',
  'FOTO%20LOOK/LOOK%2012/LOOK%2012_PHOTO3.jpg',
  'FOTO%20LOOK/LOOK%2013/LOOK%2013_PHOTO1.jpg',
  'FOTO%20LOOK/LOOK%2013/LOOK%2013_PHOTO2.jpg',
  'FOTO%20LOOK/LOOK%2013/LOOK%2013_PHOTO3.jpg',
  'FOTO%20LOOK/LOOK%2014/LOOK%2014_PHOTO1.jpg',
  'FOTO%20LOOK/LOOK%2014/LOOK%2014_PHOTO2.jpg',
  'FOTO%20LOOK/LOOK%2014/LOOK%2014_PHOTO3.jpg',
  'FOTO%20LOOK/LOOK%2015/LOOK%2015_PHOTO1.jpg',
  'FOTO%20LOOK/LOOK%2015/LOOK%2015_PHOTO2.jpg',
  'FOTO%20LOOK/LOOK%2015/LOOK%2015_PHOTO3.jpg',
  'FOTO%20LOOK/LOOK%2016/LOOK%2016_PHOTO1.jpg',
  'FOTO%20LOOK/LOOK%2016/LOOK%2016_PHOTO2.jpg',
  'FOTO%20LOOK/LOOK%2017/LOOK%2017_PHOTO1.jpg',
  'FOTO%20LOOK/LOOK%2017/LOOK%2017_PHOTO2.jpg',
  'FOTO%20LOOK/LOOK%2017/LOOK%2017_PHOTO3.jpg',
  'FOTO%20LOOK/LOOK%2017/LOOK%2017_PHOTO4.jpg',
  'FOTO%20LOOK/LOOK%2017/LOOK%2017_PHOTO5.jpg',
  'FOTO%20LOOK/LOOK%2017/CROP%20STORIA%20INSTAGRAM-62.jpg',
  'FOTO%20LOOK/LOOK%2018/LOOK%2018_PHOTO1.jpg',
  'FOTO%20LOOK/LOOK%2018/LOOK%2017_PHOTO2.jpg',
  'FOTO%20LOOK/LOOK%2018/LOOK%2017_PHOTO3.jpg',
  'FOTO%20LOOK/LOOK%2018/LOOK%2017_PHOTO4.jpg',
  'FOTO%20LOOK/LOOK%2019/LOOK%2019_PHOTO1.jpg',
  'FOTO%20LOOK/LOOK%2019/LOOK%2019_PHOTO2.jpg',
  'FOTO%20LOOK/LOOK%2019/LOOK%2019_PHOTO3.jpg',
  'FOTO%20LOOK/LOOK%2020/LOOK%2020_PHOTO1.jpg',
  'FOTO%20LOOK/LOOK%2020/LOOK%2020_PHOTO2.jpg',
  'FOTO%20LOOK/LOOK%2020/LOOK%2020_PHOTO3.jpg',
  'FOTO%20LOOK/LOOK%2020/LOOK%2020_PHOTO4.jpg',
  'FOTO%20LOOK/LOOK%2021/LOOK%2021_PHOTO1.jpg',
  'FOTO%20LOOK/LOOK%2021/LOOK%2021_PHOTO2.jpg',
  'FOTO%20LOOK/LOOK%2021/LOOK%2021_PHOTO3.jpg'
];

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function appendPhotos(feed, photos, isFirst) {
  photos.forEach((src, i) => {
    const fig = document.createElement('figure');
    fig.className = (isFirst && i === 0) ? 'home-image-block home-hero' : 'home-image-block';
    const img = document.createElement('img');
    img.src = src;
    img.alt = '';
    img.draggable = false;
    img.loading = isFirst && i === 0 ? 'eager' : 'lazy';
    fig.appendChild(img);
    feed.appendChild(fig);
  });
}

(function buildHomeFeed() {
  const feed = document.getElementById('home-feed');
  if (!feed) return;

  appendPhotos(feed, shuffle(allHomePhotos), true);
  layoutHome();

  // Sentinel per scroll infinito
  const sentinel = document.createElement('div');
  sentinel.id = 'home-sentinel';
  feed.appendChild(sentinel);

  const infiniteObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      appendPhotos(feed, shuffle(allHomePhotos), false);
      feed.appendChild(sentinel);
    }
  }, { rootMargin: '400px' });

  infiniteObs.observe(sentinel);
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
      { name: 'TOBI PANTS',             info: ['100% Cotton', 'Color: Navy'] }
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
const shopPopup         = document.getElementById('shop-popup');
const shopOverlay       = document.getElementById('shop-overlay');
const fixedLookInfo     = document.getElementById('fixed-look-info');
const lookCarousels     = document.querySelectorAll('.look-carousel');
const siteNav           = document.querySelector('.site-nav');
const siteBreadcrumb    = document.getElementById('site-breadcrumb');

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
      }, 580);

    }, 350);

  }, 1200);

});

/* ═══════════════════════════════════════════
   NAVIGAZIONE SEZIONI
   ═══════════════════════════════════════════ */
const NAV_PAGES = [
  { section: 'home',       label: 'Home' },
  { section: 'collection', label: 'Collection' },
  { section: 'about',      label: 'Contacts' }
];

function updateNavLinks(currentId) {
  navLinks.innerHTML = NAV_PAGES
    .filter(p => p.section !== currentId)
    .map(p => `<li><a href="#" data-section="${p.section}">${p.label}</a></li>`)
    .join('');
  navLinks.querySelectorAll('[data-section]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      showSection(link.dataset.section);
    });
  });
}

function showSection(id) {
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
  } else {
    fixedLookInfo.classList.remove('panel-visible');
    siteBreadcrumb.classList.remove('visible');
    siteNav.style.opacity       = '';
    siteNav.style.pointerEvents = '';
  }

  updateNavLinks(id);
  window.scrollTo({ top: 0, behavior: 'instant' });
  navLinks.classList.remove('open');
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

// Stato iniziale nav: siamo su home
updateNavLinks('home');

/* ─── Toggle menu ────────────────────────── */
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

document.addEventListener('click', e => {
  if (!e.target.closest('.site-nav')) {
    navLinks.classList.remove('open');
  }
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
    popup.classList.add('is-open');
    popup.setAttribute('aria-hidden', 'false');
    if (submitted) {
      form.style.display = 'none';
      status.classList.add('is-visible');
    } else {
      form.style.display = 'block';
      status.classList.remove('is-visible');
      errorText.classList.remove('is-visible');
    }
  }

  function closePopup() {
    popup.classList.remove('is-open');
    popup.setAttribute('aria-hidden', 'true');
  }

  btnMonogram?.addEventListener('click', openPopup);
  closeBtn.addEventListener('click', closePopup);
  overlay.addEventListener('click', closePopup);
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
    form.style.display = 'none';
    status.classList.add('is-visible');
  });
})();

/* ═══════════════════════════════════════════
   SHOP POPUP
   ═══════════════════════════════════════════ */
btnShop?.addEventListener('click', () => {
  shopPopup.classList.toggle('hidden');
  shopOverlay.classList.toggle('hidden');
});
shopOverlay?.addEventListener('click', () => {
  shopPopup.classList.add('hidden');
  shopOverlay.classList.add('hidden');
});

/* ═══════════════════════════════════════════
   CAROSELLI LOOK — crossfade
   ═══════════════════════════════════════════ */
lookCarousels.forEach(carousel => {
  const slideEls = Array.from(carousel.querySelectorAll('.carousel-slide'));
  const counter  = carousel.querySelector('.image-counter');
  const lookKey  = carousel.dataset.look;
  const total    = slideEls.length;
  let current    = 0;
  function pad(n) { return String(n).padStart(2, '0'); }

  slideEls[0].classList.add('active');

  function goTo(index) {
    slideEls[current].classList.remove('active');
    current = (index + total) % total;
    slideEls[current].classList.add('active');
    if (counter) counter.textContent = `img. [${pad(current + 1)}]`;
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
    const itemsHTML = data.items.map(item => `
      <div class="panel-item">
        <p class="panel-item-name">${item.name}</p>
        ${item.info.map(i => `<p class="panel-item-info">${i}</p>`).join('')}
      </div>
    `).join('');

    fixedLookInfo.innerHTML = `
      <p class="panel-look-number">${data.number}</p>
      <div class="panel-look-items">${itemsHTML}</div>
      <button class="panel-details-link" id="panel-details-btn">DETAILS</button>
      <div class="panel-footer panel-footer--hidden" id="panel-footer">
        <p class="panel-footer-line">Designed in Rome, Made in Italy</p>
        <p class="panel-footer-line">For infos or inquiries contact us on <a href="mailto:info@tatorm.com">info@tatorm.com</a></p>
      </div>
    `;

    fixedLookInfo.classList.remove('panel-updating');

    document.getElementById('panel-details-btn').addEventListener('click', () => {
      const footer = document.getElementById('panel-footer');
      const btn    = document.getElementById('panel-details-btn');
      const open   = footer.classList.toggle('panel-footer--open');
      footer.classList.toggle('panel-footer--hidden', !open);
      btn.textContent = open ? 'CLOSE' : 'DETAILS';
    });
  }, 180);
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const lookKey = entry.target.dataset.look;
        activeLook = null; // forza aggiornamento
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
