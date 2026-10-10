/* ═══════════════════════════════════════════
   VISTI DI RECENTE — ultime schede prodotto aperte
   ─────────────────────────────────────────
   Salvati nel browser (localStorage), dal più recente.
   In fondo alla PDP: fino a 4 capi, escluso quello aperto.
   ═══════════════════════════════════════════ */
import { pgridCardHTML } from './grid.js';

const KEY = 'tato-recent-v1';
const MAX = 8;

function load() {
  try {
    const arr = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(arr) ? arr.filter(s => typeof s === 'string' && /^[a-z0-9-]+$/.test(s)) : [];
  } catch (_) { return []; }
}

export function addRecent(slug) {
  const list = [slug].concat(load().filter(s => s !== slug)).slice(0, MAX);
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (_) {}
}

/* Sezione "Recently viewed" (vuota se non c'è altro da mostrare) */
export function recentHTML(exceptSlug) {
  const items = load()
    .filter(s => s !== exceptSlug)
    .map(s => window.TATO_getProduct(s))
    .filter(Boolean)
    .slice(0, 4);
  if (!items.length) return '';
  return `
    <section class="pdp-recent">
      <p class="pdp-complete-title">Recently viewed</p>
      <div class="pgrid pdp-recent-items" style="--n:${items.length}">${items.map(p => pgridCardHTML(p)).join('')}</div>
    </section>`;
}
