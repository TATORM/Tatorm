/* Home: hero, reparti, feed prodotti + foto */

import { declusterBySlug, pgridCardHTML } from './grid.js';
import { isDesktopViewport, pictureEl, shuffle } from './utils.js';

/* ─── Hero Home (desktop) — pool curato, foto post-prodotte per il libro.
   Casuale a ogni load E ogni volta che si torna alla Home da un'altra
   sezione (vedi renderHomeHero / showSection). Solo desktop: su mobile
   l'hero resta quello di sempre, pescato da allHomePhotos qui sotto. */
export const heroPhotosDesktop = [
  'media/home/hero/02.jpg',
  'media/home/hero/04.jpg',
  'media/home/hero/05.jpg',
  'media/home/hero/06.jpg',
  'media/home/hero/08.jpg',
];
/* 01/03/07 escluse: dettagli ravvicinati (piedi/pantaloni) senza volto
   o busto — a tutto schermo restano tagliate a metà comunque le si
   inquadri, il soggetto è già al bordo dello scatto originale. */

/* Foto orizzontali per gli stacchi a tutta larghezza su mobile (al posto
   delle coppie). Esclusi hero 05/06 (già in Men/Women) e 01/03/07
   (dettagli ravvicinati). `widths` = derivati AVIF disponibili. */
export const WIDE_PHOTOS_MOBILE = [
  { src: 'media/home/11.jpg',      widths: [900, 1440] },
  { src: 'media/home/13.jpg',      widths: [900, 1440] },
  { src: 'media/home/hero/02.jpg', widths: [1600, 2400] },
  { src: 'media/home/hero/04.jpg', widths: [1600, 2400] },
  { src: 'media/home/hero/08.jpg', widths: [1600, 2400] },
];

/* ─── Home feed — ordine casuale + scroll infinito.
   Su mobile questo pool serve anche per l'hero (invariato). ─ */
export const allHomePhotos = [
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

/* Foto di brand/editoriali senza un capo o un look specifico da nominare
   (mix di scatti studio in media/home/ e still dai look) → un alt
   generico ma reale (non decorativo: è il contenuto della Home). */
export function homePhotoAlt(src) {
  const look = src.match(/look-(\d+)/);
  return look ? `TATO — Look ${parseInt(look[1], 10)}` : 'TATO — editorial photography';
}

export function appendPhotos(feed, photos, isFirst) {
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

/* Hero Home: crea (o aggiorna sul posto) la prima figure del feed.
   Desktop → pool curato heroPhotosDesktop, ripescato a ogni chiamata
   (vedi showSection). Mobile → invariato: allHomePhotos, fissato al load. */
export function renderHomeHero() {
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
export function renderHomeDepartments() {
  const wrap = document.createElement('div');
  wrap.className = 'home-depts';
  /* head = centro della testa nella foto originale (frazioni 0–1) e zoom
     sul mobile: così nei riquadri verticali le due teste cadono alla
     stessa altezza e hanno grandezza simile (vedi .home-dept img in home.css).
     Cambiando foto vanno rimisurati. */
  const depts = [
    { slug: 'men',   label: 'Men',   img: 'media/home/hero/05.jpg', head: [0.523, 0.164], zoom: 1.02 },
    { slug: 'women', label: 'Women', img: 'media/home/hero/06.jpg', head: [0.514, 0.278], zoom: 1.18 },
  ];
  depts.forEach(d => {
    const a = document.createElement('a');
    a.className = 'home-dept';
    a.href = `/shop/?dept=${d.slug}`;
    a.style.setProperty('--hx', d.head[0]);
    a.style.setProperty('--hy', d.head[1]);
    a.style.setProperty('--zoom', d.zoom);
    a.appendChild(pictureEl(d.img, {
      alt: `TATO — ${d.label}`,
      sizes: '50vw',
      widths: [1600, 2400],
    }));
    const cap = document.createElement('span');
    cap.className = 'home-dept-caption';
    cap.innerHTML = `<span class="home-dept-title">${d.label}</span>`;
    a.appendChild(cap);
    wrap.appendChild(a);
  });
  return wrap;
}

export function initHome() {
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

  /* Mobile: al posto della coppia di foto affiancate (troppo piccole su
     telefono) una sola foto orizzontale a tutta larghezza. */
  const wideShots = shuffle(WIDE_PHOTOS_MOBILE);
  let wide = 0;
  const wideFig = () => {
    const w = wideShots[wide++ % wideShots.length];
    const fig = document.createElement('figure');
    fig.className = 'home-look home-look--wide';
    fig.appendChild(pictureEl(w.src, { alt: homePhotoAlt(w.src), sizes: '100vw', widths: w.widths }));
    return fig;
  };
  const mobile = !isDesktopViewport();

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
      if (pairSlots.has(slot) && mobile && wideShots.length) {
        feed.appendChild(wideFig());
      } else if (pairSlots.has(slot)) {
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
}
