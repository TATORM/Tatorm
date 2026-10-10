import { translateStatic } from './i18n.js';
import { setMeta } from './meta.js';
import { showSection } from './nav.js';
import { esc } from './utils.js';

/* ═══════════════════════════════════════════
   PAGINE INFO / LEGALI · ABOUT · ARCHIVIO
   ─────────────────────────────────────────
   Il testo arriva dalle Pagine Shopify con lo stesso handle
   (about, shipping, returns, faq, privacy, cookies, terms),
   vedi TATO_CONTENT.pages (content-core.js). Se una pagina
   su Shopify non c'è, resta il segnaposto qui sotto: i
   contenuti fattuali e legali NON sono inventati, dove
   servono dati reali c'è [DA FORNIRE: …].
   ═══════════════════════════════════════════ */
export const FLAG = t => `<span class="info-flag">[DA FORNIRE: ${t}]</span>`;
export const INFO_PAGES = {
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
export const INFO_ROUTES = Object.keys(INFO_PAGES);

/* Testo da Shopify (HTML dell'editor delle Pagine) → solo tag di
   testo e link, nessun attributo tranne href. Niente script/stili. */
const KEEP = new Set(['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'UL', 'OL', 'LI', 'A', 'STRONG', 'EM', 'B', 'I', 'U',
  'BR', 'BLOCKQUOTE', 'TABLE', 'THEAD', 'TBODY', 'TR', 'TH', 'TD']);
const DROP = new Set(['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'TEMPLATE', 'NOSCRIPT', 'SVG', 'MATH',
  'FORM', 'INPUT', 'BUTTON', 'SELECT', 'TEXTAREA', 'IMG', 'VIDEO', 'AUDIO', 'LINK', 'META']);
export function safeHTML(html) {
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html');
  const clean = node => {
    Array.from(node.childNodes).forEach(ch => {
      if (ch.nodeType === 3) return;                       // testo
      if (ch.nodeType !== 1 || DROP.has(ch.tagName)) { ch.remove(); return; }
      clean(ch);
      if (!KEEP.has(ch.tagName)) { ch.replaceWith(...ch.childNodes); return; }   // div/span → solo il contenuto
      const href = ch.tagName === 'A' ? (ch.getAttribute('href') || '').trim() : '';
      Array.from(ch.attributes).forEach(a => ch.removeAttribute(a.name));
      if (href && /^(https?:|mailto:|tel:|\/)/i.test(href)) {
        ch.setAttribute('href', href);
        if (/^https?:/i.test(href) && new URL(href).origin !== location.origin) {
          ch.setAttribute('target', '_blank');
          ch.setAttribute('rel', 'noopener');
        }
      }
    });
  };
  clean(doc.body);
  return doc.body.innerHTML;
}

const shopPage = handle => (window.TATO_CONTENT && window.TATO_CONTENT.pages[handle]) || null;

function renderDoc(html) {
  const el = document.getElementById('info-body');
  if (!el) return false;
  el.innerHTML = `<article class="info-doc">${html}
    <p class="info-back"><a href="/shop/">← Back to shop</a></p></article>`;
  translateStatic(el);   // titoli e sottotitoli fissi (i18n.js)
  showSection('info');
  document.getElementById('info')?.classList.add('active');
  return true;
}

export function showInfo(route) {
  const data = INFO_PAGES[route];
  if (!data) return;
  const sp = shopPage(route);
  const title = (sp && sp.title) || data.title;
  const body = sp
    ? (/<h1[\s>]/i.test(sp.body) ? '' : `<h1>${esc(title)}</h1>`) + safeHTML(sp.body)
    : data.body;
  if (renderDoc(body)) setMeta({ title, description: `${title} · TATO.`, canonicalPath: route });
}

/* About: testo della Pagina Shopify "about" sopra i contatti */
export function showAbout() {
  const sp = shopPage('about');
  const el = document.getElementById('about-text');
  if (el) {
    el.innerHTML = sp ? safeHTML(sp.body) : '';
    el.hidden = !sp;
  }
  showSection('about');
  setMeta(sp
    ? { title: sp.title || 'About', description: (el ? el.textContent : '').replace(/\s+/g, ' ').trim().slice(0, 300) || 'About TATO.', canonicalPath: 'about' }
    : { title: 'Contacts', description: 'Get in touch with TATO for general, press and sales enquiries.', canonicalPath: 'about' });
}

/* Archivio: elenco delle collezioni passate → /collection/<handle>/ */
export function showArchive() {
  const list = (window.TATO_CONTENT && window.TATO_CONTENT.archive) || [];
  const items = list.map(c =>
    `<li><a href="/collection/${encodeURIComponent(c.handle)}/">${c.season ? `<span class="archive-season">${esc(c.season)}</span> ` : ''}${esc(c.title)}</a></li>`
  ).join('');
  if (renderDoc(`<h1>Archive</h1>${items ? `<ul class="archive-list">${items}</ul>` : '<p>No past collections yet.</p>'}`)) {
    setMeta({ title: 'Archive', description: 'Past TATO collections. Designed in Rome, made in Italy.', canonicalPath: 'archive' });
  }
}
