/* ═══════════════════════════════════════════
   TATO — products.js
   ─────────────────────────────────────────
   Struttura del negozio (categorie) e
   contenuto editoriale (look della collezione).

   I PRODOTTI NON SI SCRIVONO QUI: arrivano da Shopify
   (vedi catalog-core.js). All'avvio si usa la copia
   inclusa nel sito (catalog-snapshot.js); shopify.js
   poi la aggiorna con i dati dal vivo.
   ═══════════════════════════════════════════ */

/* Categorie merceologiche (menu Shop, pill dello shop). Women / Men sono
   un filtro dello shop (?dept=), non categorie. Accessories a parte, vedi sotto. */
window.TATO_CATEGORIES = [
  { slug: 'tailoring', label: 'Tailoring' },   // tipo Shopify "Tailoring": giacche, cappotti, pantaloni sartoriali
  { slug: 'outerwear', label: 'Outerwear' },   // capispalla non sartoriali (oggi nessuno → voce nascosta)
  { slug: 'shirts',    label: 'Shirts' },
  { slug: 'jersey',    label: 'Jersey' },      // jersey / maglieria (tipo Shopify Jersey o Knitwear)
  { slug: 'pants',     label: 'Pants' },
  { slug: 'skirts',    label: 'Skirts' },
];

/* Etichette di tutte le categorie, accessories inclusa */
window.TATO_ALL_CATEGORY_LABELS = Object.assign(
  { accessories: 'Accessories' },
  ...window.TATO_CATEGORIES.map(c => ({ [c.slug]: c.label }))
);

/* ═══════════════════════════════════════════
   FOTO LOOK — n° di foto "pulite" per look nella
   cartella `media/looks/look-NN/` (01.jpg, 02.jpg…).
   Usata come fallback per le foto prodotto finché
   non arrivano i packshot: il front-end mostra le
   foto dei look in cui il capo compare (`lookRefs`).
   NB: eventuali frame editoriali (crop Instagram)
   sono numerati per ultimi e restano esclusi dal
   conteggio qui sotto.
   ═══════════════════════════════════════════ */
window.TATO_LOOK_PHOTO_COUNT = {
  1: 2,  2: 5,  3: 2,  4: 3,  5: 3,  6: 4,  7: 3,  8: 5,  9: 2, 10: 3,
  11: 8, 12: 3, 13: 3, 14: 3, 15: 3, 16: 2, 17: 4, 18: 4, 19: 3, 20: 4, 21: 3,
};

/* Restituisce gli URL delle foto dei look indicati
   (della collezione corrente, vedi TATO_LOOK_PHOTOS sotto).
   opts.onePerLook → solo la 1ª foto di ogni look
   opts.limit      → massimo N URL                     */
window.TATO_lookImages = function (lookRefs, opts) {
  opts = opts || {};
  const out = [];
  (lookRefs || []).forEach(function (n) {
    const photos = window.TATO_LOOK_PHOTOS[String(n)] || [];
    out.push.apply(out, opts.onePerLook ? photos.slice(0, 1) : photos);
  });
  return opts.limit ? out.slice(0, opts.limit) : out;
};

/* ─── Helpers ────────────────────────────── */
window.TATO_getProduct = function (slug) {
  return window.TATO_PRODUCTS.find(p => p.slug === slug) || null;
};

window.TATO_getCategoryLabel = function (slug) {
  return window.TATO_ALL_CATEGORY_LABELS[slug] || slug;
};

/* Il capo sta nella categoria? I pantaloni sartoriali (tipo Shopify Tailoring)
   compaiono anche in Pants. */
window.TATO_inCategory = function (p, slug) {
  return p.category === slug ||
    (slug === 'pants' && p.category === 'tailoring' && /\b(pants|trousers)\b/i.test(p.name));
};

/* ═══════════════════════════════════════════
   LOOKS LOCALI — riserva finché la collezione non è
   su Shopify (metaoggetti, vedi content-core.js e
   docs/guide/shopify-contenuti.md). Quando su Shopify c'è
   almeno una collezione, questi dati non si usano più.
   ─────────────────────────────────────────
   Ogni capo è { name, comp, color }. Se il nome coincide
   con il titolo di un prodotto Shopify, nel pannello
   Collection diventa un link alla PDP; altrimenti è un
   capo da lookbook ("Archive piece").
   ═══════════════════════════════════════════ */
const i = (name, comp, color) => ({ name, comp, color });

window.TATO_LOOKS_LOCAL = {
  '1':  { number: 'LOOK #1',  items: [ i('2 BUTTON WINDBREAKER','100% Cotton','White'), i('BACK SHIRT','100% Cotton','White'), i('TOBI PANTS','100% Cotton','White') ] },
  '2':  { number: 'LOOK #2',  items: [ i('CROPPED TAILORED JACKET','100% Wool','Anthracite'), i('BACK SHIRT','100% Cotton','Black'), i('2 BUTTON TAILORED PANTS','100% Wool','Anthracite') ] },
  '3':  { number: 'LOOK #3',  items: [ i('CARDIGAN V NECK','100% Wool','Chocolate'), i('BACK SHIRT','100% Cotton','White'), i('2 BUTTON TAILORED PANTS','100% Wool','Anthracite') ] },
  '4':  { number: 'LOOK #4',  items: [ i('2 BUTTON SHIRT DRESS','100% Cotton','Baby Blue'), i('TAILORED PANTS','100% Wool','Anthracite') ] },
  '5':  { number: 'LOOK #5',  items: [ i('CARDIGAN V NECK','100% Wool','Lilac'), i('TINY CREWNECK','100% Cotton','Baby Blue'), i('2 BUTTON SHIRT','100% Cotton','White'), i('TOBI PANTS','100% Cotton','Black') ] },
  '6':  { number: 'LOOK #6',  items: [ i('RIB BOMBER','100% Nylon','Green / Chocolate'), i('CARDIGAN V NECK','100% Wool','Baby Green'), i('2 BUTTON SHIRT','100% Cotton','Baby Pink'), i('2 BUTTON MIDI SKIRT','100% Wool','Anthracite') ] },
  '7':  { number: 'LOOK #7',  items: [ i('TAILORED JACKET','100% Wool','Anthracite'), i('BACK SHIRT','100% Cotton','White'), i('TAILORED PANTS','100% Wool','Anthracite') ] },
  '8':  { number: 'LOOK #8',  items: [ i('CARDIGAN V NECK','100% Wool','Cherry'), i('SIDE WAY VEST','100% Cotton','Burgundy'), i('2 BUTTON SHIRT','100% Cotton','Baby Pink'), i('TOBI PANTS','100% Cotton','Baby Pink') ] },
  '9':  { number: 'LOOK #9',  items: [ i('SIDE WAY ZIP-UP','100% Cotton','Dark Navy'), i('HOODIE','100% Cotton','Dark Navy'), i('3/4 ZIP-UP','100% Cotton','Dark Navy'), i('INSIDE OUT SELVEDGE DENIM','100% Cotton','Black Denim'), i('TATO CAP','100% Cotton','Green') ] },
  '10': { number: 'LOOK #10', items: [ i('CROPPED TAILORED JACKET','100% Wool','Anthracite'), i('SMOCK LONGSLEEVE','100% Cotton','White'), i('TOBI PANTS','100% Cotton','Black') ] },
  '11': { number: 'LOOK #11', items: [ i('TRIPLE BREASTED COAT','100% Wool','Dark Blue'), i('CROPPED TAILORED JACKET','100% Wool','Anthracite'), i('BACK SHIRT','100% Cotton','White'), i('2 BUTTON LONG SKIRT','100% Wool','Anthracite') ] },
  '12': { number: 'LOOK #12', items: [ i('BACK SHIRT','100% Cotton','White'), i('2 BUTTON LONG SKIRT','100% Cotton','Shiny White') ] },
  '13': { number: 'LOOK #13', items: [ i('CROPPED TAILORED JACKET','100% Wool','Anthracite'), i('2 BUTTON SHIRT','100% Cotton','White'), i('2 BUTTON TAILORED PANTS','100% Wool','Anthracite') ] },
  '14': { number: 'LOOK #14', items: [ i('TRIPLE BREASTED COAT','100% Wool','Dark Blue'), i('BACK SHIRT','100% Cotton','White'), i('TAILORED PANTS','100% Wool','Anthracite') ] },
  '15': { number: 'LOOK #15', items: [ i('RIB BOMBER','100% Nylon','Green / Chocolate'), i('2 BUTTON WINDBREAKER','100% Cotton','Grey'), i('2 BUTTON SHIRT','100% Cotton','Baby Blue'), i('2 BUTTON TAILORED PANTS','100% Wool','Anthracite') ] },
  '16': { number: 'LOOK #16', items: [ i('RIB BOMBER','100% Nylon','Dark Navy / Black'), i('2 BUTTON WINDBREAKER','100% Cotton','White'), i('TOBI PANTS','100% Cotton','White') ] },
  '17': { number: 'LOOK #17', items: [ i('TAILORED JACKET','100% Wool','Anthracite'), i('SMOCK LONGSLEEVE','100% Cotton','Baby Pink'), i('2 BUTTON MIDI SKIRT','100% Wool','Anthracite'), i('2 BUTTON LONG SKIRT','100% Wool','Black') ] },
  '18': { number: 'LOOK #18', items: [ i('BACK SHIRT','100% Cotton','Black'), i('2 BUTTON LONG SKIRT','100% Cotton','Black') ] },
  '19': { number: 'LOOK #19', items: [ i('CARDIGAN V NECK','100% Wool','Lilac'), i('2 BUTTON WINDBREAKER','100% Cotton','Baby Blue / Oriental Blue'), i('BACK SHIRT','100% Cotton','White'), i('TAILORED PANTS','100% Wool','Anthracite') ] },
  '20': { number: 'LOOK #20', items: [ i('TRIPLE BREASTED BOMBER','100% Wool','Dark Blue'), i('SMOCK LONGSLEEVE','100% Cotton','Navy / Bordeaux'), i('TOBI PANTS','100% Cotton','Navy'), i('TATO TAILORING CAP','100% Cotton','Washed Black') ] },
  '21': { number: 'LOOK #21', items: [ i('2 BUTTON SHIRT DRESS','100% Cotton','White'), i('2 BUTTON LONG SKIRT','100% Cotton','Shiny White') ] },
};

/* Foto dei caroselli locali: tutte quelle in media/looks/look-NN/
   (le prime TATO_LOOK_PHOTO_COUNT sono le "pulite", usate anche
   come foto prodotto; le altre sono crop editoriali). */
const LOCAL_SLIDES = { 4: 4, 17: 5 };

function localCollection() {
  const nn = n => String(n).padStart(2, '0');
  return {
    handle: 'current', title: 'Collection', season: '', intro: [], campaign: [], current: true,
    looks: Object.keys(window.TATO_LOOKS_LOCAL).map(function (k) {
      const n = Number(k);
      const slides = LOCAL_SLIDES[n] || window.TATO_LOOK_PHOTO_COUNT[n] || 0;
      const images = [];
      for (let j = 1; j <= slides; j++) images.push('media/looks/look-' + nn(n) + '/' + nn(j) + '.jpg');
      return {
        key: k, number: n, label: window.TATO_LOOKS_LOCAL[k].number,
        images, photos: images.slice(0, window.TATO_LOOK_PHOTO_COUNT[n] || images.length),
        items: window.TATO_LOOKS_LOCAL[k].items,
      };
    }),
  };
}

/* ─── Contenuti: Shopify se c'è, altrimenti i look locali ───
   TATO_CONTENT = { source, collections, current, archive, pages }
   TATO_LOOKS   = look della collezione corrente (stesso formato
                  di sempre: lo usano catalogo, Home, PDP)       */
window.TATO_CONTENT = window.TATO_contentCore.buildContent(
  window.TATO_CONTENT_SNAPSHOT || {}, localCollection()
);
window.TATO_LOOKS = window.TATO_contentCore.lookMap(window.TATO_CONTENT.current);
window.TATO_LOOK_PHOTOS = {};
((window.TATO_CONTENT.current || {}).looks || []).forEach(function (l) {
  window.TATO_LOOK_PHOTOS[l.key] = l.photos;
});

window.TATO_getCollection = function (handle) {
  const c = window.TATO_CONTENT;
  return (handle && c.collections.find(x => x.handle === handle)) || c.current;
};

/* Look "risolto" per il pannello Collection: unisce i dati del look
   al prezzo/valuta del prodotto reale quando il capo è a catalogo.
   col = collezione (default: la corrente). */
window.TATO_resolveLook = function (n, col) {
  const look = ((col || window.TATO_CONTENT.current || {}).looks || []).find(l => l.key === String(n));
  if (!look) return null;
  return {
    number: look.label,
    items: look.items.map(function (it) {
      const p = window.TATO_PRODUCTS.find(x => x.name === String(it.name).toUpperCase()) || null;
      return {
        name: it.name,
        composition: it.comp || (p ? p.composition : ''),
        color: it.color,
        slug: p ? p.slug : null,
        price: p ? p.price : null,
        currency: p ? p.currency : 'EUR',
      };
    }),
  };
};

/* ─── Prodotti: dalla copia del catalogo Shopify ───
   L'array resta lo stesso oggetto per tutta la vita della
   pagina: shopify.js lo riempie di nuovo con i dati dal vivo. */
window.TATO_PRODUCTS = window.TATO_catalogCore.buildCatalog(
  (window.TATO_CATALOG_SNAPSHOT || {}).nodes || [],
  window.TATO_LOOKS
);
