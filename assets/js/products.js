/* ═══════════════════════════════════════════
   TATO — products.js
   ─────────────────────────────────────────
   Struttura del negozio (reparti, categorie) e
   contenuto editoriale (look della collezione).

   I PRODOTTI NON SI SCRIVONO QUI: arrivano da Shopify
   (vedi catalog-core.js). All'avvio si usa la copia
   inclusa nel sito (catalog-snapshot.js); shopify.js
   poi la aggiorna con i dati dal vivo.
   ═══════════════════════════════════════════ */

/* Reparti (menu WOMEN / MEN). ACCESSORIES è una
   voce di menu a sé, non filtrata per genere. */
window.TATO_DEPARTMENTS = [
  { slug: 'women', label: 'Women' },
  { slug: 'men',   label: 'Men' },
];

/* Categorie merceologiche — sottomenu di WOMEN / MEN.
   (accessories è gestita separatamente, vedi sotto) */
window.TATO_CATEGORIES = [
  { slug: 'outerwear', label: 'Outerwear' },   // cappotti + giacche tailoring
  { slug: 'shirts',    label: 'Shirts' },
  { slug: 'knitwear',  label: 'Knitwear' },    // jersey / maglieria
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

/* Restituisce gli URL delle foto dei look indicati.
   opts.onePerLook → solo la 1ª foto di ogni look
   opts.limit      → massimo N URL                     */
window.TATO_lookImages = function (lookRefs, opts) {
  opts = opts || {};
  const out = [];
  (lookRefs || []).forEach(function (n) {
    const count = window.TATO_LOOK_PHOTO_COUNT[n] || 0;
    const nn = String(n).padStart(2, '0');
    const max = opts.onePerLook ? Math.min(1, count) : count;
    for (let i = 1; i <= max; i++) {
      out.push('media/looks/look-' + nn + '/' + String(i).padStart(2, '0') + '.jpg');
    }
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

window.TATO_getDepartmentLabel = function (slug) {
  const d = window.TATO_DEPARTMENTS.find(d => d.slug === slug);
  return d ? d.label : slug;
};

/* Categorie che hanno almeno 1 capo nel reparto dato — per non
   mostrare voci vuote nei sottomenu (es. Skirts sotto Men). */
window.TATO_categoriesFor = function (dept) {
  return window.TATO_CATEGORIES.filter(c =>
    window.TATO_PRODUCTS.some(p =>
      p.category === c.slug &&
      (p.genders || ['women', 'men']).includes(dept)
    )
  );
};

/* ═══════════════════════════════════════════
   LOOKS — composizione dei 21 look della collezione.
   ─────────────────────────────────────────
   Ogni capo è { name, comp, color }. Se il nome coincide
   con il titolo di un prodotto Shopify, nel pannello
   Collection diventa un link alla PDP; altrimenti è un
   capo da lookbook ("Archive piece").
   ═══════════════════════════════════════════ */
const i = (name, comp, color) => ({ name, comp, color });

window.TATO_LOOKS = {
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

/* Look "risolto" per il pannello Collection: unisce i dati del look
   al prezzo/valuta del prodotto reale quando il capo è a catalogo. */
window.TATO_resolveLook = function (n) {
  const look = window.TATO_LOOKS[String(n)];
  if (!look) return null;
  return {
    number: look.number,
    items: look.items.map(function (it) {
      const p = window.TATO_PRODUCTS.find(x => x.name === String(it.name).toUpperCase()) || null;
      return {
        name: it.name,
        composition: it.comp,
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
