/* ═══════════════════════════════════════════
   ZOOM — foto della scheda prodotto a schermo intero
   ─────────────────────────────────────────
   Click su una foto della PDP → tutte le foto una sotto l'altra,
   partendo da quella cliccata. Desktop: click sulla foto la ingrandisce
   2× e l'ingrandimento segue il mouse; un altro click torna indietro.
   Touch: pinch nativo del browser. Chiusura: ×, Esc.
   ═══════════════════════════════════════════ */
import { IS_SHOPIFY_CDN, cdnUrl, esc, isDesktopViewport } from './utils.js';

const SCALE = 2;
let el, track, closeBtn, lastFocus = null;

/* immagine grande: dalla CDN Shopify a 2048px, le locali sono già ≤1800px */
const bigSrc = src => (IS_SHOPIFY_CDN.test(src) ? cdnUrl(src, 2048) : src);

function build() {
  el = document.createElement('div');
  el.className = 'zoom';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  el.setAttribute('aria-label', 'Product images');
  el.hidden = true;
  el.innerHTML = `
    <button class="zoom-close" type="button" aria-label="Close">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg>
    </button>
    <div class="zoom-track"></div>`;
  document.body.appendChild(el);
  track = el.querySelector('.zoom-track');
  closeBtn = el.querySelector('.zoom-close');
  closeBtn.addEventListener('click', closeZoom);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !el.hidden) closeZoom(); });

  /* desktop: ingrandimento che segue il mouse */
  track.addEventListener('click', e => {
    const img = e.target.closest('.zoom-img');
    if (!img || !isDesktopViewport()) return;
    const on = !img.classList.contains('is-zoomed');
    track.querySelectorAll('.zoom-img.is-zoomed').forEach(i => i.classList.remove('is-zoomed'));
    if (on) { follow(img, e); img.classList.add('is-zoomed'); }
  });
  track.addEventListener('mousemove', e => {
    const img = e.target.closest('.zoom-img.is-zoomed');
    if (img) follow(img, e);
  });
}

function follow(img, e) {
  const r = img.getBoundingClientRect();
  const x = Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100));
  const y = Math.min(100, Math.max(0, ((e.clientY - r.top) / r.height) * 100));
  img.style.transformOrigin = `${x}% ${y}%`;
}

export function openZoom(srcs, start, alt, flat) {
  if (!srcs || !srcs.length) return;
  if (!el) build();
  lastFocus = document.activeElement;
  el.classList.toggle('is-flat', !!flat);
  el.style.setProperty('--zoom-scale', SCALE);
  track.innerHTML = srcs.map((src, i) =>
    `<div class="zoom-slide"><img class="zoom-img" src="${esc(bigSrc(src))}" alt="${esc(alt)}${srcs.length > 1 ? `, view ${i + 1}` : ''}" decoding="async" draggable="false"></div>`
  ).join('');
  el.hidden = false;
  document.documentElement.classList.add('zoom-open');
  requestAnimationFrame(() => {
    el.classList.add('is-open');
    const slide = track.children[start] || track.children[0];
    track.scrollTop = slide.offsetTop;
    closeBtn.focus({ preventScroll: true });
  });
}

export function closeZoom() {
  if (!el || el.hidden) return;
  el.classList.remove('is-open');
  document.documentElement.classList.remove('zoom-open');
  el.hidden = true;
  track.innerHTML = '';
  if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
}
