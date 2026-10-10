/* ═══════════════════════════════════════════
   I18N — sito in inglese (base) e italiano
   ─────────────────────────────────────────
   · La lingua si sceglie da EN / IT nel footer: resta salvata nel
     browser e la pagina si ricarica. Prima visita: sempre inglese.
   · t('Testo inglese') → traduzione italiana se esiste, altrimenti il
     testo inglese. {nome} nel testo = valore da vars.
   · L'HTML fisso di index.html si traduce all'avvio (translateStatic):
     ogni testo/attributo che coincide con una chiave del dizionario.
   · Colori, composizioni e istruzioni di lavaggio da Shopify passano
     da tColor / tComposition / tCare. Descrizioni dei prodotti, testi
     delle collezioni e pagine restano come scritti su Shopify.
   · Gli indirizzi (/shop/pants/…) restano uguali nelle due lingue.
   ═══════════════════════════════════════════ */
const KEY = 'tato-lang';
export const LANGS = ['en', 'it'];

function detect() {
  try {
    const saved = localStorage.getItem(KEY);
    if (LANGS.includes(saved)) return saved;
  } catch (_) {}
  return 'en';   // sempre inglese finché non si sceglie IT
}
export const LANG = detect();

export function setLang(l) {
  if (!LANGS.includes(l) || l === LANG) return;
  try { localStorage.setItem(KEY, l); } catch (_) {}
  location.reload();
}

/* ─── Dizionario: inglese → italiano ─────── */
const IT = {
  // menu, header, breadcrumb
  'Shop': 'Shop', 'All': 'Tutto', 'New arrivals': 'Novità', 'New Arrivals': 'Novità',
  'Collection': 'Collezione', 'Archive': 'Archivio', 'About': 'Chi siamo', 'Account': 'Account',
  'HOME': 'HOME', 'SHOP': 'SHOP', 'COLLECTION': 'COLLEZIONE', 'CONTACTS': 'CONTATTI', 'ABOUT': 'CHI SIAMO', 'Breadcrumb': 'Percorso',
  'Main menu': 'Menu principale', 'Toggle dark mode': 'Modalità scura', 'Close': 'Chiudi',
  'Shop categories': 'Categorie dello shop', 'Wishlist': 'Wishlist',

  // reparti e categorie
  'Women': 'Donna', 'Men': 'Uomo',
  'Tailoring': 'Sartoria', 'Outerwear': 'Capispalla', 'Shirts': 'Camicie', 'Jersey': 'Jersey',
  'Pants': 'Pantaloni', 'Skirts': 'Gonne', 'Accessories': 'Accessori',

  // shop e filtri
  'Your wishlist is empty.': 'La tua wishlist è vuota.',
  'Discover the collection': 'Scopri la collezione',
  'No products match these filters.': 'Nessun capo corrisponde a questi filtri.',
  '1 product': '1 capo', '{n} products': '{n} capi',
  'Filter & sort': 'Filtra e ordina', 'Filter & sort ({n})': 'Filtra e ordina ({n})',
  'Filter and sort': 'Filtra e ordina', 'Close filters': 'Chiudi i filtri',
  'Newest': 'Più recenti', 'Price: low to high': 'Prezzo crescente', 'Price: high to low': 'Prezzo decrescente',
  'Under €200': 'Fino a €200', 'Over €500': 'Oltre €500',
  'Sort by': 'Ordina per', 'Department': 'Reparto', 'Size': 'Taglia', 'Colour': 'Colore',
  'Availability': 'Disponibilità', 'In stock only': 'Solo disponibili', 'Price': 'Prezzo',
  'Show 1 product': 'Mostra 1 capo', 'Show {n} products': 'Mostra {n} capi', 'Clear all': 'Azzera tutto',
  'Sold out': 'Esaurito', 'Coming soon.': 'In arrivo.',
  'Remove from wishlist': 'Rimuovi dalla wishlist', 'Add to wishlist': 'Aggiungi alla wishlist',

  // scheda prodotto
  'Select a size': 'Seleziona una taglia', ' (Sold out)': ' (Esaurito)',
  'Add to bag': 'Aggiungi alla shopping bag', 'Added': 'Aggiunto',
  'Complete the look': 'Completa il look', 'Recently viewed': 'Visti di recente',
  '← Shop': '← Shop', 'Ref.': 'Rif.', 'Select the size': 'Seleziona la taglia',
  'Size guide': 'Guida alle taglie', 'Size guide · {name}': 'Guida alle taglie · {name}',
  'Express checkout': 'Pagamento rapido', 'PayPal · Apple Pay · Card': 'PayPal · Apple Pay · Carta',
  'Delivery estimate: to be configured': 'Consegna stimata: da configurare',
  'Order by phone: number to be provided': 'Ordini per telefono: numero da fornire',
  'Description': 'Descrizione', 'Size & fit': 'Taglia e vestibilità',
  'Composition & care': 'Composizione e cura', 'Shipping & returns': 'Spedizioni e resi',
  'Seen in': 'Visto in', 'Fit information to be provided.': 'Informazioni sulla vestibilità in arrivo.',
  'Model is {h} and wears size {s}.': 'Il modello è alto {h} e indossa la taglia {s}.',
  'Open size guide': 'Apri la guida alle taglie',
  'Shipping information': 'Informazioni sulle spedizioni', 'Returns & refunds': 'Resi e rimborsi',
  'This option is not available': 'Questa opzione non è disponibile',
  'Checkout unavailable right now': 'Il pagamento al momento non è disponibile',
  'This piece is no longer available.': 'Questo capo non è più disponibile.',
  'No longer available': 'Non più disponibile',
  'You may also like': 'Potrebbe piacerti anche',
  'Product images': 'Immagini del prodotto',
  'Close size guide': 'Chiudi la guida alle taglie',
  'Measurements are garment measurements in centimetres, taken flat.': 'Misure del capo in centimetri, rilevate in piano.',
  'Chest': 'Torace', 'Waist': 'Vita', 'Length': 'Lunghezza', 'Shoulder': 'Spalle', 'Sleeve': 'Manica',
  'One size.': 'Taglia unica.',
  'Garment measurements for this category are not available yet.': 'Le misure dei capi di questa categoria non sono ancora disponibili.',

  // carrello
  'Bag': 'Shopping bag', 'Close bag': 'Chiudi la shopping bag',
  'Your bag is empty.': 'La tua shopping bag è vuota.',
  'Continue shopping': 'Continua lo shopping', 'Total': 'Totale', 'Checkout': 'Vai al pagamento',
  'Payment integration coming soon.': 'Il pagamento sarà disponibile a breve.',
  'Secure checkout on Shopify.': 'Pagamento sicuro su Shopify.',
  'Connecting to checkout…': 'Collegamento al pagamento…',
  'Checkout temporarily unavailable.': 'Il pagamento è momentaneamente non disponibile.',
  'Checkout unavailable.': 'Pagamento non disponibile.',
  'No items linked to Shopify yet.': 'Nessun articolo ancora collegato a Shopify.',
  'Some items are not available for checkout.': 'Alcuni articoli non possono essere acquistati al momento.',
  'Redirecting…': 'Reindirizzamento…',
  'Something went wrong at checkout. Please try again.': 'Si è verificato un problema con il pagamento. Ti preghiamo di riprovare.',
  'An item in your bag is no longer available and has been removed.': 'Un articolo nella shopping bag non è più disponibile ed è stato rimosso.',
  '{n} items in your bag are no longer available and have been removed.': '{n} articoli nella shopping bag non sono più disponibili e sono stati rimossi.',
  'Quantity': 'Quantità', 'Decrease quantity': 'Diminuisci la quantità', 'Increase quantity': 'Aumenta la quantità',
  'Remove {name}': 'Rimuovi {name}',

  // collection e pre-order
  'Campaign': 'Campagna', 'Pre-order': 'Pre-ordine', 'Pre-order / {name}': 'Pre-ordine / {name}',
  'Colour: {c}': 'Colore: {c}', 'Close pre-order': 'Chiudi il pre-ordine',
  'Each piece is made to order, in small quantities. Leave your details and we will be in touch with price, timing and payment. Nothing is charged at this stage.':
    'Ogni capo è realizzato su ordinazione, in piccole quantità. Lasciaci i tuoi dati: ti contatteremo noi per prezzo, tempi e pagamento. In questa fase non viene addebitato nulla.',
  'Size *': 'Taglia *', 'Name *': 'Nome *', 'Email *': 'Email *', 'Phone': 'Telefono',
  'Country *': 'Paese *', 'Notes': 'Note', 'Send request': 'Invia la richiesta',
  'Select': 'Seleziona', 'Not sure': 'Non so',
  'I agree that TATO may use these details to reply to my request': 'Acconsento all’uso di questi dati da parte di TATO per rispondere alla mia richiesta',
  'Please tick the box to continue.': 'Ti preghiamo di spuntare la casella per continuare.',
  'Please check your email address.': 'Ti preghiamo di controllare l’indirizzo email.',
  'Please fill in the fields marked *.': 'Ti preghiamo di compilare i campi contrassegnati da *.',
  'Thank you. We have received your request and will be in touch by email.':
    'Grazie. Abbiamo ricevuto la tua richiesta e ti risponderemo via email.',
  'Your request could not be sent. Please try again, or write to us at {email}.':
    'Non è stato possibile inviare la richiesta. Ti preghiamo di riprovare, oppure di scriverci a {email}.',
  "Thank you. Your email app will open with your request ready to send. If it doesn't, you can write to us at {email}.":
    'Grazie. Si aprirà la tua app di posta con la richiesta pronta da inviare. Se non dovesse aprirsi, puoi scriverci a {email}.',

  // notify me (taglia esaurita)
  'Notify me when available': 'Avvisami quando torna disponibile',
  'We will only write to you about this piece.': 'Ti scriveremo solo per questo capo.',
  'Any size': 'Qualsiasi taglia',
  'Thank you. We will write to you as soon as it is back.': 'Grazie. Ti scriveremo appena tornerà disponibile.',
  '{name} in {color}, size {size}, is sold out. Leave your email and we will let you know when it is back.':
    '{name} in {color}, taglia {size}, è esaurito. Lasciaci la tua email e ti avviseremo quando tornerà disponibile.',
  '{name} in {color} is sold out. Leave your email and we will let you know when it is back.':
    '{name} in {color} è esaurito. Lasciaci la tua email e ti avviseremo quando tornerà disponibile.',

  // newsletter
  'Join the newsletter': 'Iscriviti alla newsletter',
  'Sign up for updates, releases and occasional news.': 'Aggiornamenti, nuove uscite e qualche notizia, di tanto in tanto.',
  'Enter a valid email.': 'Inserisci un indirizzo email valido.',
  'Notify me': 'Avvisami', 'Subscribe': 'Iscriviti',
  "You've been added to the newsletter.": 'Grazie, la tua iscrizione alla newsletter è confermata.',

  // footer, contatti
  'Customer Care': 'Assistenza clienti', 'Contact': 'Contatti', 'Contacts': 'Contatti',
  'Shipping': 'Spedizioni', 'Returns & Refunds': 'Resi e rimborsi', 'FAQ': 'FAQ',
  'Press': 'Stampa', 'Legal': 'Note legali', 'Terms of Sale': 'Condizioni di vendita',
  'Follow': 'Seguici', 'General': 'Generale', 'Sales': 'Vendite',
  'Designed in Rome, Made in Italy': 'Disegnato a Roma, prodotto in Italia',
  'Italy · EUR €': 'Italia · EUR €',

  // pagine info
  'Where we ship': 'Dove spediamo', 'Cost': 'Costi', 'Delivery time': 'Tempi di consegna',
  'Tracking': 'Tracciamento', 'Duties & taxes': 'Dazi e tasse',
  'Return window': 'Termini per il reso', 'Conditions': 'Condizioni', 'How to return': 'Come effettuare un reso',
  'Return cost': 'Costo del reso', 'Refund time': 'Tempi di rimborso', 'Exchanges': 'Cambi',
  'No past collections yet.': 'Non ci sono ancora collezioni passate.',
  'Page not found': 'Pagina non trovata',
  '← Back to shop': '← Torna allo shop',
  'TATO · Independent Fashion. Designed in Rome, Made in Italy.': 'TATO · Moda indipendente. Disegnata a Roma, prodotta in Italia.',
};

export function t(s, vars) {
  let out = (LANG === 'it' && Object.prototype.hasOwnProperty.call(IT, s)) ? IT[s] : s;
  if (vars) out = out.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
  return out;
}

/* ─── Dati da Shopify ────────────────────── */
const COLORS = {
  'black': 'Nero', 'white': 'Bianco', 'navy': 'Blu navy', 'dark navy': 'Blu notte', 'dark blue': 'Blu scuro',
  'baby blue': 'Azzurro', 'baby pink': 'Rosa cipria', 'anthracite': 'Antracite', 'grey': 'Grigio',
  'light grey': 'Grigio chiaro', 'dark grey': 'Grigio scuro', 'burgundy': 'Bordeaux', 'red': 'Rosso',
  'green': 'Verde', 'chocolate': 'Cioccolato', 'lilac': 'Lilla', 'cherry': 'Ciliegia',
  'baby green': 'Verde pastello', 'washed black': 'Nero slavato',
};
/* "Burgundy / Navy" → "Bordeaux / Blu navy"; colori sconosciuti restano come sono */
export function tColor(name) {
  if (LANG !== 'it' || !name) return name;
  return String(name).split(' / ').map(p => COLORS[p.trim().toLowerCase()] || p).join(' / ');
}

const FIBRES = [
  [/\bfine wool\b/gi, 'lana fine'], [/\bwool\b/gi, 'lana'], [/\bcotton\b/gi, 'cotone'],
  [/\blinen\b/gi, 'lino'], [/\bsilk\b/gi, 'seta'], [/\bpolyester\b/gi, 'poliestere'],
  [/\bviscose\b/gi, 'viscosa'], [/\belastane\b/gi, 'elastan'], [/\bpolyamide\b|\bnylon\b/gi, 'poliammide'],
  [/\bcashmere\b/gi, 'cashmere'],
];
/* "100% Fine wool" → "100% Lana fine" */
export function tComposition(s) {
  if (LANG !== 'it' || !s) return s;
  let out = String(s);
  FIBRES.forEach(([re, it]) => { out = out.replace(re, it); });
  return out.replace(/(^|[%,]\s*)([a-zà-ù])/g, (m, pre, ch) => pre + ch.toUpperCase());
}

const CARE = {
  'spot clean': 'Smacchiare localmente', 'machine wash cold': 'Lavaggio in lavatrice a freddo',
  'hand wash cold': 'Lavaggio a mano a freddo', 'dry clean only': 'Solo lavaggio a secco',
  'garment dyed': 'Tinto in capo', 'gentle cycle': 'Ciclo delicato',
  'wash with similar colors': 'Lavare con colori simili', 'do not bleach': 'Non candeggiare',
  'do not tumble dry': 'Non asciugare in asciugatrice', 'warm iron': 'Stirare a temperatura media',
  'inside out': 'Lavare al rovescio',
};
export function tCare(line) {
  if (LANG !== 'it' || !line) return line;
  return CARE[String(line).trim().toLowerCase()] || line;
}

/* ─── HTML fisso (index.html) ────────────── */
const ATTRS = ['aria-label', 'placeholder', 'title'];
export function translateStatic(root = document.body) {
  document.documentElement.lang = LANG;
  if (LANG === 'en') return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: n => (n.parentElement && /^(SCRIPT|STYLE)$/.test(n.parentElement.tagName))
      ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT,
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(n => {
    const key = n.nodeValue.trim();
    if (key && Object.prototype.hasOwnProperty.call(IT, key)) n.nodeValue = n.nodeValue.replace(key, IT[key]);
  });
  root.querySelectorAll(ATTRS.map(a => `[${a}]`).join(',')).forEach(el => {
    ATTRS.forEach(a => {
      const v = el.getAttribute(a);
      if (v && Object.prototype.hasOwnProperty.call(IT, v)) el.setAttribute(a, IT[v]);
    });
  });
}

/* Selettore EN / IT (footer) */
export function langSwitchHTML() {
  return `<span class="lang-switch">${LANGS.map(l =>
    `<button type="button" class="lang-btn${l === LANG ? ' is-on' : ''}" data-lang="${l}" aria-pressed="${l === LANG}" lang="${l}">${l.toUpperCase()}</button>`
  ).join('<span aria-hidden="true">/</span>')}</span>`;
}

export function initI18n() {
  translateStatic();
  // pagina account Shopify nella stessa lingua
  const acc = document.getElementById('btn-account');
  if (acc) acc.href = acc.href.replace(/([?&]locale=)\w+/, `$1${LANG}`);
  // selettore nel footer
  const region = document.querySelector('.footer-region');
  if (region && !region.querySelector('.lang-switch')) region.insertAdjacentHTML('beforeend', ` &nbsp;·&nbsp; ${langSwitchHTML()}`);
  document.addEventListener('click', e => {
    const b = e.target.closest('.lang-btn');
    if (b) setLang(b.dataset.lang);
  });
}
