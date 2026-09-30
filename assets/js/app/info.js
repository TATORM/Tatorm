import { setMeta } from './meta.js';
import { showSection } from './nav.js';

/* ═══════════════════════════════════════════
   PAGINE INFO / LEGALI
   ─────────────────────────────────────────
   Struttura pronta. I contenuti fattuali e legali NON sono
   inventati: dove servono dati reali c'è [DA FORNIRE: …].
   Aggiornare i campi `body` qui sotto.
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

export function showInfo(route) {
  const data = INFO_PAGES[route];
  const el = document.getElementById('info-body');
  if (!data || !el) return;
  el.innerHTML = `<article class="info-doc">${data.body}
    <p class="info-back"><a href="/shop/">← Back to shop</a></p></article>`;
  showSection('info');
  document.getElementById('info')?.classList.add('active');
  setMeta({ title: data.title, description: `${data.title} — TATO.` });
}
