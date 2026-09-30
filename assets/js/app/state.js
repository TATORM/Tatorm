/* Stato condiviso tra i moduli (prima: variabili globali di script.js) */

export const state = {
  shopScope: 'all',      // 'all' | 'new' | 'accessories' | 'wishlist'
  shopCategory: 'all',   // 'all' | slug categoria
  pdp: { slug: null, colorIdx: 0, size: null },
  activeLook: null,      // look mostrato nel pannello Collection
};
