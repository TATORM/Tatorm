/* ═══════════════════════════════════════════
   TATO — data/products.js
   ─────────────────────────────────────────
   Catalogo prodotti singoli, derivato dai capi
   della collezione (21 look).

   FOTO: ogni colore punta al packshot (flat
   tecnico su bianco) in
     media/products/<slug>/<colore-slug>/01.png
   Fallback se `images` è vuoto → foto dei look
   in cui il capo compare (vedi TATO_lookImages).

   MODELLO: un prodotto per capo, con varianti
   colore selezionabili. Ogni colore ha le sue
   taglie e le sue foto.
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

const NUM_SIZES_5 = ['1', '2', '3', '4', '5'];
const NUM_SIZES_3 = ['1', '2', '3'];
const NUM_SIZES_2 = ['1', '2'];
const ONE_SIZE    = ['One Size'];

/* Packshot di un colore: media/products/<slug>/<colore-slug>/01.png */
function pshot(slug, colorSlug) {
  return ['media/products/' + slug + '/' + colorSlug + '/01.png'];
}

/* Helper variante colore. `images` opzionale (array di URL);
   se omesso → fallback alle foto dei look. */
function tatoColor(name, hex, sizes, images) {
  return {
    name,
    hex,
    images: images || [],
    sizes: (sizes || NUM_SIZES_3).map(s => ({ label: s, available: true })),
  };
}

window.TATO_PRODUCTS = [
  {
    id: 'p01', slug: 'tobi-pants', name: 'TOBI PANTS',
    category: 'pants', price: 295, currency: 'EUR',
    composition: '100% Cotton', care: 'Dyed garment. Machine wash cold, inside out.',
    description: 'Dyed-garment cotton twill trouser. Single pleat, hook-and-bar closure at the hem, double fit (relaxed / baloon). Designed in Rome, made in Italy.',
    colors: [
      tatoColor('Black',     '#141414', NUM_SIZES_5, pshot('tobi-pants', 'black')),
      tatoColor('Navy',      '#232b3a', NUM_SIZES_5, pshot('tobi-pants', 'navy')),
      tatoColor('Baby Pink', '#e9cdd2', NUM_SIZES_5, pshot('tobi-pants', 'baby-pink')),
    ],
    genders: ['women', 'men'],
    lookRefs: [1, 5, 8, 10, 16, 20], status: 'available',
  },
  {
    id: 'p02', slug: '2-button-shirt', name: '2 BUTTON SHIRT',
    category: 'shirts', price: 230, currency: 'EUR',
    composition: '100% Cotton', care: 'Machine wash cold',
    description: 'Poplin shirt with a two-button collar stand and regular fit. Designed in Rome, made in Italy.',
    colors: [
      tatoColor('White',              '#f4f4f0', NUM_SIZES_3, pshot('2-button-shirt', 'white')),
      tatoColor('Light Grey / White', '#d9d9d6', NUM_SIZES_3, pshot('2-button-shirt', 'light-grey-white')),
      tatoColor('Baby Blue',          '#bcd3e6', NUM_SIZES_3, pshot('2-button-shirt', 'baby-blue')),
    ],
    genders: ['women', 'men'],
    lookRefs: [5, 6, 8, 13, 15], status: 'available',
  },
  {
    id: 'p03', slug: '2-button-long-skirt', name: '2 BUTTON LONG SKIRT',
    category: 'skirts', price: 380, currency: 'EUR',
    composition: '100% Fine wool', care: 'Dry clean only',
    description: 'Column-length wool skirt, tailoring construction. Two-button closure flap, pockets hidden under the front flap, straight fit, raw-cut finishing. Designed in Rome, made in Italy.',
    colors: [
      tatoColor('Anthracite', '#3a3a3d', NUM_SIZES_3, pshot('2-button-long-skirt', 'anthracite')),
    ],
    genders: ['women'],
    lookRefs: [11, 12, 17, 18, 21], status: 'available',
  },
  {
    id: 'p04', slug: 'triple-breasted-coat', name: 'TRIPLE BREASTED COAT',
    category: 'outerwear', price: 950, currency: 'EUR',
    composition: '100% Fine wool', care: 'Dry clean only',
    description: 'Full-length wool coat, tailoring construction. Triple-breasted closure with multiple ways to close and wear the piece, inside pocket.',
    colors: [
      tatoColor('Dark Blue', '#22304a', NUM_SIZES_2, pshot('triple-breasted-coat', 'dark-blue')),
    ],
    genders: ['women', 'men'],
    lookRefs: [11, 14], status: 'available',
  },
  {
    id: 'p05', slug: 'cropped-tailored-jacket', name: 'CROPPED TAILORED JACKET',
    category: 'outerwear', price: 680, currency: 'EUR',
    composition: '100% Fine wool', care: 'Dry clean only',
    description: 'Cropped wool jacket, tailoring construction. Modular button closure, splint on the back for freedom of movement, standing collar with hook-and-bar closure, multiple ways to wear.',
    colors: [
      tatoColor('Anthracite', '#3a3a3d', NUM_SIZES_3, pshot('cropped-tailored-jacket', 'anthracite')),
    ],
    genders: ['women', 'men'],
    lookRefs: [2, 10, 11, 13], status: 'available',
  },
  {
    id: 'p06', slug: 'tailored-pants', name: 'TAILORED PANTS',
    category: 'pants', price: 490, currency: 'EUR',
    composition: '100% Fine wool', care: 'Dry clean only',
    description: 'Wool tailoring trouser with a double pleat and relaxed fit.',
    colors: [
      tatoColor('Anthracite', '#3a3a3d', NUM_SIZES_3, pshot('tailored-pants', 'anthracite')),
    ],
    genders: ['women', 'men'],
    lookRefs: [4, 7, 14, 19], status: 'available',
  },
  {
    id: 'p07', slug: '2-button-tailored-pants', name: '2 BUTTON TAILORED PANTS',
    category: 'pants', price: 425, currency: 'EUR',
    composition: '100% Fine wool', care: 'Dry clean only',
    description: 'Wool tailoring trouser with a two-button closure flap, pockets hidden under the front flap, straight fit.',
    colors: [
      tatoColor('Anthracite', '#3a3a3d', NUM_SIZES_3, pshot('2-button-tailored-pants', 'anthracite')),
    ],
    genders: ['women', 'men'],
    lookRefs: [2, 3, 13, 15], status: 'available',
  },
  {
    id: 'p08', slug: 'tiny-crewneck', name: 'TINY CREWNECK',
    category: 'knitwear', price: 180, currency: 'EUR',
    composition: '100% Cotton', care: 'Hand wash cold',
    description: 'Dyed-garment cotton crewneck. Horizontal-rib raglan sleeve, straight-cut neck construction, cropped fit, faded wrist. Designed in Rome, made in Italy.',
    colors: [
      tatoColor('Black',     '#141414', NUM_SIZES_3, pshot('tiny-crewneck', 'black')),
      tatoColor('Baby Blue', '#bcd3e6', NUM_SIZES_3, pshot('tiny-crewneck', 'baby-blue')),
    ],
    genders: ['women', 'men'],
    lookRefs: [5], status: 'available',
  },
  {
    id: 'p09', slug: 'smock-longsleeve', name: 'SMOCK LONGSLEEVE',
    category: 'knitwear', price: 100, currency: 'EUR',
    composition: '100% Cotton', care: 'Machine wash cold',
    description: 'Horizontal-cut cotton jersey longsleeve with a smock neck construction and straight fit. Designed in Rome, made in Italy.',
    colors: [
      tatoColor('White',             '#f4f4f0', NUM_SIZES_3, pshot('smock-longsleeve', 'white')),
      tatoColor('Burgundy / Navy',   '#4a2230', NUM_SIZES_3, pshot('smock-longsleeve', 'burgundy-navy')),
      tatoColor('Black / Dark Grey', '#2b2b2e', NUM_SIZES_3, pshot('smock-longsleeve', 'black-dark-grey')),
    ],
    genders: ['women', 'men'],
    lookRefs: [10, 17, 20], status: 'available',
  },
  {
    id: 'p10', slug: 'tato-cap', name: 'TATO CAP',
    category: 'accessories', price: 70, currency: 'EUR',
    composition: '100% Cotton', care: 'Spot clean',
    description: 'Six-panel cotton twill cap. Faded visor with sticker shadow, TATO embroidery. Designed in Rome, made in Italy.',
    colors: [
      tatoColor('Black', '#141414', ONE_SIZE, pshot('tato-cap', 'black')),
      tatoColor('Navy',  '#232b3a', ONE_SIZE, pshot('tato-cap', 'navy')),
      tatoColor('Red',   '#7c1f2b', ONE_SIZE, pshot('tato-cap', 'red')),
      tatoColor('Green', '#3f4a2e', ONE_SIZE, pshot('tato-cap', 'green')),
    ],
    genders: ['women', 'men'],
    lookRefs: [9], status: 'available',
  },
];

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
   Ogni capo è { name, comp, color } + eventuale `slug`
   se corrisponde a un prodotto a catalogo (→ link alla PDP).
   Senza `slug` è un capo da lookbook, non in vendita
   ("Archive piece"). Sorgente unica: qui non ci sono più
   prezzi scritti a mano, li prende da TATO_PRODUCTS.
   ═══════════════════════════════════════════ */
const TATO_LOOK_SLUG = {
  'TOBI PANTS':               'tobi-pants',
  '2 BUTTON SHIRT':           '2-button-shirt',
  '2 BUTTON LONG SKIRT':      '2-button-long-skirt',
  'TRIPLE BREASTED COAT':     'triple-breasted-coat',
  'CROPPED TAILORED JACKET':  'cropped-tailored-jacket',
  'TAILORED PANTS':           'tailored-pants',
  '2 BUTTON TAILORED PANTS':  '2-button-tailored-pants',
  'TINY CREWNECK':            'tiny-crewneck',
  'SMOCK LONGSLEEVE':         'smock-longsleeve',
  'TATO CAP':                 'tato-cap',
};

/* i(name, comp, color) → oggetto capo, con slug se a catalogo */
function i(name, comp, color) {
  const slug = TATO_LOOK_SLUG[name];
  const item = { name, comp, color };
  if (slug) item.slug = slug;
  return item;
}

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
      const p = it.slug ? window.TATO_getProduct(it.slug) : null;
      return {
        name: it.name,
        composition: it.comp,
        color: it.color,
        slug: p ? it.slug : null,
        price: p ? p.price : null,
        currency: p ? p.currency : 'EUR',
      };
    }),
  };
};
