/* Stato condiviso tra i moduli (prima: variabili globali di script.js) */

export const state = {
  shopScope: 'new',      // 'new' | 'women' | 'men' | 'accessories'
  shopCategory: 'all',   // 'all' | slug categoria
  pdp: { slug: null, colorIdx: 0, size: null },
  activeLook: null,      // look mostrato nel pannello Collection
};
