import { fixedLookInfo } from './dom.js';
import { showSection } from './nav.js';
import { openPreorder } from './preorder.js';
import { state } from './state.js';
import { esc, money, pictureHTML } from './utils.js';

/* ═══════════════════════════════════════════
   COLLECTION
   ─────────────────────────────────────────
   I caroselli si costruiscono dai dati (TATO_CONTENT,
   vedi content-core.js): collezione corrente su
   /collection/, quelle d'archivio su /collection/<handle>/.
   Ordine: [campagna] → look 1…N. Il pannello fisso mostra
   il testo della campagna o i capi del look a schermo.
   ═══════════════════════════════════════════ */

const SIZES = '(max-width: 768px) 100vw, min(700px, 36vw)';
let shown = null;        // collezione disegnata ora
let observer = null;

export function collectionShown() { return shown; }

function carouselHTML(key, images, label) {
  const slides = images.map((src, j) =>
    `<div class="carousel-slide">${pictureHTML(src, { alt: `TATO ${label}, view ${j + 1} of ${images.length}`, sizes: SIZES })}</div>`
  ).join('');
  return `
        <div class="look-carousel" data-look="${esc(key)}">
          <div class="carousel-track"><div class="carousel-slides">${slides}</div></div>
          <p class="image-counter">1 / —</p>
        </div>`;
}

export function renderCollection(col) {
  const column = document.querySelector('#collection .visual-column');
  if (!column || !col) return;
  shown = col;
  state.activeLook = null;
  const intro = col.intro.length && !col.campaign.length
    ? `<div class="collection-intro" data-look="intro">
         ${col.season ? `<p class="collection-intro-season">${esc(col.season)}</p>` : ''}
         <p class="collection-intro-title">${esc(col.title)}</p>
         ${col.intro.map(t => `<p class="collection-intro-text">${esc(t)}</p>`).join('')}
       </div>`
    : '';
  const campaign = col.campaign.length ? carouselHTML('campaign', col.campaign, `${col.title} campaign`) : '';
  column.innerHTML = intro + campaign + col.looks.map(l => carouselHTML(l.key, l.images, `Look ${l.number}`)).join('');

  if (observer) observer.disconnect();
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          state.activeLook = null;
          renderLookPanel(entry.target.dataset.look);
        }
      });
    },
    { root: null, rootMargin: '-30% 0px -30% 0px', threshold: 0 }
  );
  column.querySelectorAll('.look-carousel').forEach(c => { bindCarousel(c); observer.observe(c); });
  column.querySelectorAll('.collection-intro').forEach(c => observer.observe(c));
}

/* Mostra una collezione (default: la corrente), ridisegnandola se serve */
export function showCollection(handle) {
  const col = window.TATO_getCollection(handle);
  if (col !== shown) renderCollection(col);
  showSection('collection');
  return col;
}

/* Prima voce del pannello all'apertura della Collection */
export function firstCollectionKey() {
  const el = document.querySelector('#collection .visual-column [data-look]');
  return el ? el.dataset.look : '1';
}

export function renderLookPanel(lookKey) {
  if (lookKey === state.activeLook) return;
  state.activeLook = lookKey;

  const col = shown || window.TATO_getCollection();
  if (lookKey === 'intro') { fixedLookInfo.innerHTML = ''; return; }
  const data = lookKey === 'campaign' ? null : window.TATO_resolveLook(lookKey, col);
  if (!data && lookKey !== 'campaign') return;

  fixedLookInfo.classList.add('panel-updating');

  setTimeout(() => {
    if (!data) {
      // blocco campagna: stagione, titolo e testo della collezione
      fixedLookInfo.innerHTML = `
        <p class="panel-look-number">${esc(col.season || 'Campaign')}</p>
        <div class="panel-look-items"><div class="panel-item">
          <p class="panel-item-name">${esc(col.title)}</p>
          ${col.intro.map(t => `<p class="panel-item-info">${esc(t)}</p>`).join('')}
        </div></div>`;
      fixedLookInfo.classList.remove('panel-updating');
      return;
    }
    const itemsHTML = data.items.map(item => {
      const action = item.slug
        ? `<a class="panel-item-shop" href="/product/${item.slug}/">${money(item.price, item.currency)} · Shop</a>`
        : `<button type="button" class="panel-item-shop panel-item-preorder" data-name="${esc(item.name)}" data-color="${esc(item.color)}">Pre-order</button>`;
      return `
        <div class="panel-item">
          <p class="panel-item-name">${esc(item.name)}</p>
          ${item.composition ? `<p class="panel-item-info">${esc(item.composition)}</p>` : ''}
          ${item.color ? `<p class="panel-item-info">Color: ${esc(item.color)}</p>` : ''}
          ${action}
        </div>
      `;
    }).join('');

    fixedLookInfo.innerHTML = `
      <p class="panel-look-number">${esc(data.number)}</p>
      <div class="panel-look-items">${itemsHTML}</div>
    `;

    fixedLookInfo.classList.remove('panel-updating');
  }, 180);
}

/* CAROSELLI — crossfade, click (desktop) e swipe (mobile) */
function bindCarousel(carousel) {
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
}

export function initCollection() {
  renderCollection(window.TATO_getCollection());
  // capi non in vendita → form di pre-order (app/preorder.js)
  fixedLookInfo.addEventListener('click', e => {
    const b = e.target.closest('.panel-item-preorder');
    if (b) openPreorder({ name: b.dataset.name, color: b.dataset.color });
  });
  // Il pannello look parte nascosto (aggiunto da showSection)
  fixedLookInfo.classList.remove('panel-visible');
}
