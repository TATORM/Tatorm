/* ═══════════════════════════════════════════
   TATO — data/products.js
   ─────────────────────────────────────────
   Catalogo prodotti singoli, derivato dai capi
   della collezione (21 look).

   FOTO: per ora `images: []` → il front-end
   mostra blocchi grigi placeholder.
   Quando arrivano i packshot, popolare così:
     images: [
       'FOTO PRODOTTI/<slug>/<colore-slug>/01.jpg',
       'FOTO PRODOTTI/<slug>/<colore-slug>/02.jpg'
     ]

   MODELLO: un prodotto per capo, con varianti
   colore selezionabili. Ogni colore ha le sue
   taglie e (in futuro) le sue foto.
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
  { slug: 'outerwear', label: 'Outerwear' },
  { slug: 'tailoring', label: 'Tailoring' },
  { slug: 'shirts',    label: 'Shirts' },
  { slug: 'dresses',   label: 'Dresses' },
  { slug: 'jersey',    label: 'Jersey' },
  { slug: 'pants',     label: 'Pants' },
  { slug: 'skirts',    label: 'Skirts' },
  { slug: 'knit',      label: 'Knit' },
  { slug: 'vquarto',   label: 'V° Quarto' },
];

/* Etichette di tutte le categorie, accessories inclusa */
window.TATO_ALL_CATEGORY_LABELS = Object.assign(
  { accessories: 'Accessories' },
  ...window.TATO_CATEGORIES.map(c => ({ [c.slug]: c.label }))
);

const APPAREL_SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const ONE_SIZE      = ['One Size'];

/* Helper variante colore */
function tatoColor(name, hex, sizes) {
  return {
    name,
    hex,
    images: [],   // vuoto → placeholder grigio
    sizes: (sizes || APPAREL_SIZES).map(s => ({ label: s, available: true })),
  };
}

window.TATO_PRODUCTS = [
  {
    id: 'p01', slug: '2-button-windbreaker', name: '2 BUTTON WINDBREAKER',
    category: 'outerwear', price: 280, currency: 'EUR',
    composition: '100% Cotton', care: 'Dry clean only',
    description: 'Lightweight two-button windbreaker with a clean A-line silhouette and concealed placket.',
    colors: [
      tatoColor('White',     '#f4f4f0'),
      tatoColor('Grey',      '#9a9a9a'),
      tatoColor('Baby Blue', '#bcd3e6'),
    ],
    genders: ['women', 'men'],
    lookRefs: [1, 15, 16, 19], status: 'available',
  },
  {
    id: 'p02', slug: 'back-shirt', name: 'BACK SHIRT',
    category: 'shirts', price: 180, currency: 'EUR',
    composition: '100% Cotton', care: 'Machine wash cold',
    description: 'Poplin shirt with an inverted back yoke and a relaxed collar.',
    colors: [
      tatoColor('White', '#f4f4f0'),
      tatoColor('Black', '#111111'),
    ],
    genders: ['women', 'men'],
    lookRefs: [1, 2, 3, 7, 11, 12, 14, 18, 19], status: 'available',
  },
  {
    id: 'p03', slug: 'tobi-pants', name: 'TOBI PANTS',
    category: 'pants', price: 220, currency: 'EUR',
    composition: '100% Cotton', care: 'Machine wash cold',
    description: 'Wide straight-leg trouser with a single pleat and side adjusters.',
    colors: [
      tatoColor('White',     '#f4f4f0'),
      tatoColor('Black',     '#111111'),
      tatoColor('Baby Pink', '#e9cdd2'),
      tatoColor('Navy',      '#232b3a'),
    ],
    genders: ['women', 'men'],
    lookRefs: [1, 5, 8, 10, 16, 20], status: 'available',
  },
  {
    id: 'p04', slug: 'cropped-tailored-jacket', name: 'CROPPED TAILORED JACKET',
    category: 'tailoring', price: 390, currency: 'EUR',
    composition: '100% Wool', care: 'Dry clean only',
    description: 'Cropped single-breasted jacket, fully canvassed, with soft shoulder.',
    colors: [
      tatoColor('Anthracite', '#3a3a3d'),
    ],
    genders: ['women', 'men'],
    lookRefs: [2, 10, 11, 13], status: 'available',
  },
  {
    id: 'p05', slug: '2-button-tailored-pants', name: '2 BUTTON TAILORED PANTS',
    category: 'pants', price: 280, currency: 'EUR',
    composition: '100% Wool', care: 'Dry clean only',
    description: 'Tailored trouser with a two-button extended waistband and clean front.',
    colors: [
      tatoColor('Anthracite', '#3a3a3d'),
    ],
    genders: ['women', 'men'],
    lookRefs: [2, 3, 13, 15], status: 'available',
  },
  {
    id: 'p06', slug: 'cardigan-v-neck', name: 'CARDIGAN V NECK',
    category: 'knit', price: 320, currency: 'EUR',
    composition: '100% Wool', care: 'Hand wash cold',
    description: 'Fine-gauge V-neck cardigan with tonal buttons and ribbed trims.',
    colors: [
      tatoColor('Chocolate',  '#4b3621'),
      tatoColor('Lilac',      '#c9b6d4'),
      tatoColor('Baby Green', '#bcd9bf'),
      tatoColor('Cherry',     '#7c1f2b'),
    ],
    genders: ['women', 'men'],
    lookRefs: [3, 5, 6, 8, 19], status: 'available',
  },
  {
    id: 'p07', slug: '2-button-shirt-dress', name: '2 BUTTON SHIRT DRESS',
    category: 'dresses', price: 260, currency: 'EUR',
    composition: '100% Cotton', care: 'Machine wash cold',
    description: 'Midi shirt dress with a two-button placket and dropped shoulder.',
    colors: [
      tatoColor('Baby Blue', '#bcd3e6'),
      tatoColor('White',     '#f4f4f0'),
    ],
    genders: ['women'],
    lookRefs: [4, 21], status: 'available',
  },
  {
    id: 'p08', slug: 'tailored-pants', name: 'TAILORED PANTS',
    category: 'pants', price: 280, currency: 'EUR',
    composition: '100% Wool', care: 'Dry clean only',
    description: 'Straight tailored trouser with a single button closure and pressed crease.',
    colors: [
      tatoColor('Anthracite', '#3a3a3d'),
    ],
    genders: ['women', 'men'],
    lookRefs: [4, 7, 14, 19], status: 'available',
  },
  {
    id: 'p09', slug: 'tiny-crewneck', name: 'TINY CREWNECK',
    category: 'jersey', price: 160, currency: 'EUR',
    composition: '100% Cotton', care: 'Hand wash cold',
    description: 'Shrunken crewneck knit with a high ribbed collar.',
    colors: [
      tatoColor('Baby Blue', '#bcd3e6'),
    ],
    genders: ['women', 'men'],
    lookRefs: [5], status: 'available',
  },
  {
    id: 'p10', slug: '2-button-shirt', name: '2 BUTTON SHIRT',
    category: 'shirts', price: 180, currency: 'EUR',
    composition: '100% Cotton', care: 'Machine wash cold',
    description: 'Boxy poplin shirt with a two-button collar stand.',
    colors: [
      tatoColor('White',     '#f4f4f0'),
      tatoColor('Baby Pink', '#e9cdd2'),
      tatoColor('Baby Blue', '#bcd3e6'),
    ],
    genders: ['women', 'men'],
    lookRefs: [5, 6, 8, 13, 15], status: 'available',
  },
  {
    id: 'p11', slug: 'rib-bomber', name: 'RIB BOMBER',
    category: 'outerwear', price: 360, currency: 'EUR',
    composition: '100% Nylon', care: 'Wipe clean',
    description: 'Padded bomber in ripstop nylon with contrast rib collar, cuffs and hem.',
    colors: [
      tatoColor('Green / Chocolate',   '#3f4a2e'),
      tatoColor('Dark Navy / Black',   '#1c2230'),
    ],
    genders: ['women', 'men'],
    lookRefs: [6, 15, 16], status: 'available',
  },
  {
    id: 'p12', slug: '2-button-midi-skirt', name: '2 BUTTON MIDI SKIRT',
    category: 'skirts', price: 240, currency: 'EUR',
    composition: '100% Wool', care: 'Dry clean only',
    description: 'A-line midi skirt with a two-button front and back vent.',
    colors: [
      tatoColor('Anthracite', '#3a3a3d'),
    ],
    genders: ['women'],
    lookRefs: [6, 17], status: 'available',
  },
  {
    id: 'p13', slug: 'tailored-jacket', name: 'TAILORED JACKET',
    category: 'tailoring', price: 390, currency: 'EUR',
    composition: '100% Wool', care: 'Dry clean only',
    description: 'Full-length single-breasted tailored jacket with natural shoulder line.',
    colors: [
      tatoColor('Anthracite', '#3a3a3d'),
    ],
    genders: ['women', 'men'],
    lookRefs: [7, 17], status: 'available',
  },
  {
    id: 'p14', slug: 'side-way-vest', name: 'SIDE WAY VEST',
    category: 'knit', price: 220, currency: 'EUR',
    composition: '100% Cotton', care: 'Hand wash cold',
    description: 'Asymmetric knitted vest with a side-fastening panel.',
    colors: [
      tatoColor('Burgundy', '#5b2333'),
    ],
    genders: ['women', 'men'],
    lookRefs: [8], status: 'available',
  },
  {
    id: 'p15', slug: 'side-way-zip-up', name: 'SIDE WAY ZIP-UP',
    category: 'jersey', price: 280, currency: 'EUR',
    composition: '100% Cotton', care: 'Hand wash cold',
    description: 'Heavy cotton zip-up with an off-centre closure.',
    colors: [
      tatoColor('Dark Navy', '#1c2230'),
    ],
    genders: ['women', 'men'],
    lookRefs: [9], status: 'available',
  },
  {
    id: 'p16', slug: 'hoodie', name: 'HOODIE',
    category: 'jersey', price: 200, currency: 'EUR',
    composition: '100% Cotton', care: 'Machine wash cold',
    description: 'Loopback cotton hoodie with a double-layer hood.',
    colors: [
      tatoColor('Dark Navy', '#1c2230'),
    ],
    genders: ['women', 'men'],
    lookRefs: [9], status: 'available',
  },
  {
    id: 'p17', slug: 'three-quarter-zip-up', name: '3/4 ZIP-UP',
    category: 'jersey', price: 260, currency: 'EUR',
    composition: '100% Cotton', care: 'Machine wash cold',
    description: 'Half-placket pullover with a long three-quarter zip.',
    colors: [
      tatoColor('Dark Navy', '#1c2230'),
    ],
    genders: ['women', 'men'],
    lookRefs: [9], status: 'available',
  },
  {
    id: 'p18', slug: 'inside-out-selvedge-denim', name: 'INSIDE OUT SELVEDGE DENIM',
    category: 'pants', price: 320, currency: 'EUR',
    composition: '100% Cotton', care: 'Machine wash cold, inside out',
    description: 'Selvedge denim trouser constructed inside-out to expose the seams.',
    colors: [
      tatoColor('Black Denim', '#1a1a1c'),
    ],
    genders: ['women', 'men'],
    lookRefs: [9], status: 'available',
  },
  {
    id: 'p19', slug: 'tato-cap', name: 'TATO CAP',
    category: 'accessories', price: 80, currency: 'EUR',
    composition: '100% Cotton', care: 'Spot clean',
    description: 'Six-panel cotton twill cap with a tonal embroidered mark.',
    colors: [
      tatoColor('Green', '#3f4a2e', ONE_SIZE),
    ],
    genders: ['women', 'men'],
    lookRefs: [9], status: 'available',
  },
  {
    id: 'p20', slug: 'tato-tailoring-cap', name: 'TATO TAILORING CAP',
    category: 'accessories', price: 90, currency: 'EUR',
    composition: '100% Cotton', care: 'Spot clean',
    description: 'Unstructured cap cut from tailoring cloth with a self-fabric strap.',
    colors: [
      tatoColor('Washed Black', '#2e2e2e', ONE_SIZE),
    ],
    genders: ['women', 'men'],
    lookRefs: [20], status: 'available',
  },
  {
    id: 'p21', slug: 'smock-longsleeve', name: 'SMOCK LONGSLEEVE',
    category: 'shirts', price: 180, currency: 'EUR',
    composition: '100% Cotton', care: 'Machine wash cold',
    description: 'Long-sleeve cotton smock with a gathered yoke and side slits.',
    colors: [
      tatoColor('White',            '#f4f4f0'),
      tatoColor('Baby Pink',        '#e9cdd2'),
      tatoColor('Navy / Bordeaux',  '#2b2f45'),
    ],
    genders: ['women', 'men'],
    lookRefs: [10, 17, 20], status: 'available',
  },
  {
    id: 'p22', slug: 'triple-breasted-coat', name: 'TRIPLE BREASTED COAT',
    category: 'outerwear', price: 520, currency: 'EUR',
    composition: '100% Wool', care: 'Dry clean only',
    description: 'Full-length coat with a triple-breasted front and wide notch lapel.',
    colors: [
      tatoColor('Dark Blue', '#22304a'),
    ],
    genders: ['women', 'men'],
    lookRefs: [11, 14], status: 'available',
  },
  {
    id: 'p23', slug: '2-button-long-skirt', name: '2 BUTTON LONG SKIRT',
    category: 'skirts', price: 240, currency: 'EUR',
    composition: '100% Wool', care: 'Dry clean only',
    description: 'Column-length skirt with a two-button waist and centre-back split.',
    colors: [
      tatoColor('Anthracite',  '#3a3a3d'),
      tatoColor('Shiny White', '#eae7df'),
      tatoColor('Black',       '#111111'),
    ],
    genders: ['women'],
    lookRefs: [11, 12, 17, 18, 21], status: 'available',
  },
  {
    id: 'p24', slug: 'triple-breasted-bomber', name: 'TRIPLE BREASTED BOMBER',
    category: 'outerwear', price: 450, currency: 'EUR',
    composition: '100% Wool', care: 'Dry clean only',
    description: 'Bomber-length jacket with a triple-breasted wool front and ribbed hem.',
    colors: [
      tatoColor('Dark Blue', '#22304a'),
    ],
    genders: ['women', 'men'],
    lookRefs: [20], status: 'available',
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
