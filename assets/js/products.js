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

const NUM_SIZES_5 = ['1', '2', '3', '4', '5'];
const NUM_SIZES_3 = ['1', '2', '3'];
const NUM_SIZES_2 = ['1', '2'];
const ONE_SIZE    = ['One Size'];

/* Helper variante colore */
function tatoColor(name, hex, sizes) {
  return {
    name,
    hex,
    images: [],   // vuoto → placeholder grigio
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
      tatoColor('Black',     '#141414', NUM_SIZES_5),
      tatoColor('Navy',      '#232b3a', NUM_SIZES_5),
      tatoColor('Baby Pink', '#e9cdd2', NUM_SIZES_5),
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
      tatoColor('White',              '#f4f4f0', NUM_SIZES_3),
      tatoColor('Light Grey / White', '#d9d9d6', NUM_SIZES_3),
      tatoColor('Baby Blue',          '#bcd3e6', NUM_SIZES_3),
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
      tatoColor('Anthracite', '#3a3a3d', NUM_SIZES_3),
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
      tatoColor('Dark Blue', '#22304a', NUM_SIZES_2),
    ],
    genders: ['women', 'men'],
    lookRefs: [11, 14], status: 'available',
  },
  {
    id: 'p05', slug: 'cropped-tailored-jacket', name: 'CROPPED TAILORED JACKET',
    category: 'tailoring', price: 680, currency: 'EUR',
    composition: '100% Fine wool', care: 'Dry clean only',
    description: 'Cropped wool jacket, tailoring construction. Modular button closure, splint on the back for freedom of movement, standing collar with hook-and-bar closure, multiple ways to wear.',
    colors: [
      tatoColor('Anthracite', '#3a3a3d', NUM_SIZES_3),
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
      tatoColor('Anthracite', '#3a3a3d', NUM_SIZES_3),
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
      tatoColor('Anthracite', '#3a3a3d', NUM_SIZES_3),
    ],
    genders: ['women', 'men'],
    lookRefs: [2, 3, 13, 15], status: 'available',
  },
  {
    id: 'p08', slug: 'tiny-crewneck', name: 'TINY CREWNECK',
    category: 'jersey', price: 180, currency: 'EUR',
    composition: '100% Cotton', care: 'Hand wash cold',
    description: 'Dyed-garment cotton crewneck. Horizontal-rib raglan sleeve, straight-cut neck construction, cropped fit, faded wrist. Designed in Rome, made in Italy.',
    colors: [
      tatoColor('Black',     '#141414', NUM_SIZES_3),
      tatoColor('Baby Blue', '#bcd3e6', NUM_SIZES_3),
    ],
    genders: ['women', 'men'],
    lookRefs: [5], status: 'available',
  },
  {
    id: 'p09', slug: 'smock-longsleeve', name: 'SMOCK LONGSLEEVE',
    category: 'jersey', price: 100, currency: 'EUR',
    composition: '100% Cotton', care: 'Machine wash cold',
    description: 'Horizontal-cut cotton jersey longsleeve with a smock neck construction and straight fit. Designed in Rome, made in Italy.',
    colors: [
      tatoColor('White',             '#f4f4f0', NUM_SIZES_3),
      tatoColor('Burgundy / Navy',   '#4a2230', NUM_SIZES_3),
      tatoColor('Black / Dark Grey', '#2b2b2e', NUM_SIZES_3),
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
      tatoColor('Black', '#141414', ONE_SIZE),
      tatoColor('Navy',  '#232b3a', ONE_SIZE),
      tatoColor('Red',   '#7c1f2b', ONE_SIZE),
      tatoColor('Green', '#3f4a2e', ONE_SIZE),
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
