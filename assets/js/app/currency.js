/* ═══════════════════════════════════════════
   VALUTA — selettore EUR / USD / GBP / JPY nel footer
   ─────────────────────────────────────────
   Le valute vengono dai mercati attivi su Shopify (shopify.js:
   CURRENCIES, currencies, currency). Con il solo euro il selettore
   non c'è e il footer dice "Italy · EUR €".
   Scelta → localStorage `tato-currency` + ricarica: catalogo, prezzi
   e checkout arrivano da Shopify nella valuta di quel mercato.
   ═══════════════════════════════════════════ */
const KEY = 'tato-currency';
const SYMBOL = { EUR: '€', USD: '$', GBP: '£', JPY: '¥' };

function setCurrency(code) {
  try { localStorage.setItem(KEY, code); } catch (_) {}
  location.reload();
}

function render() {
  const sh = window.TATO_shopify;
  const region = document.querySelector('.footer-region');
  if (!sh || !region) return;
  const list = sh.currencies || ['EUR'];
  region.querySelector('.currency-switch')?.remove();
  if (list.length < 2) return;
  const html = `<span class="currency-switch lang-switch">${list.map(c =>
    `<button type="button" class="lang-btn${c === sh.currency ? ' is-on' : ''}" data-currency="${c}" aria-pressed="${c === sh.currency}" aria-label="${c}">${c} ${SYMBOL[c] || ''}</button>`
  ).join('<span aria-hidden="true">/</span>')}</span>`;
  // al posto di "Italy · EUR €"
  const label = region.querySelector('.footer-region-label');
  if (label) label.hidden = true;
  region.insertAdjacentHTML('afterbegin', html);
}

export function initCurrency() {
  document.addEventListener('tato:shopify-ready', render);
  document.addEventListener('tato:currencies', render);
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-currency]');
    if (b && b.dataset.currency !== (window.TATO_shopify || {}).currency) setCurrency(b.dataset.currency);
  });
}
