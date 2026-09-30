import { fixedLookInfo, lookCarousels } from './dom.js';
import { state } from './state.js';
import { esc, money } from './utils.js';

/* ═══════════════════════════════════════════
   INTERSECTIONOBSERVER — aggiorna .fixed-look-info
   Osserva i caroselli (non più i singoli blocchi)
   ═══════════════════════════════════════════ */


/* Pannello Collection = "Shop the look".
   Elenca i capi del look; quello a catalogo è un link alla sua
   scheda prodotto (con prezzo), gli altri sono "Archive piece".
   L'acquisto avviene solo sulla PDP → un unico flusso carrello. */
export function renderLookPanel(lookKey) {
  if (lookKey === state.activeLook) return;
  state.activeLook = lookKey;

  const data = window.TATO_resolveLook(lookKey);
  if (!data) return;

  fixedLookInfo.classList.add('panel-updating');

  setTimeout(() => {
    const itemsHTML = data.items.map(item => {
      const action = item.slug
        ? `<a class="panel-item-shop" href="/product/${item.slug}/">${money(item.price, item.currency)} — Shop</a>`
        : `<p class="panel-item-archive">Archive piece</p>`;
      return `
        <div class="panel-item">
          <p class="panel-item-name">${esc(item.name)}</p>
          <p class="panel-item-info">${esc(item.composition)}</p>
          <p class="panel-item-info">Color: ${esc(item.color)}</p>
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

export function initCollection() {
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

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const lookKey = entry.target.dataset.look;
        state.activeLook = null;
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

// Mostra home al caricamento (già .active nel HTML)
// Il pannello look parte nascosto (aggiunto da showSection)
fixedLookInfo.classList.remove('panel-visible');
}
