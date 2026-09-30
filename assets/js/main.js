/* ═══════════════════════════════════════════
   TATO — entry del bundle di produzione
   ─────────────────────────────────────────
   In SVILUPPO i tre file sono caricati singolarmente
   dai <script> in index.html (tra i marker build:js).
   In PRODUZIONE scripts/build.mjs bundla questo file
   con esbuild in assets/dist/app-[hash].js.

   L'ordine degli import replica quello dei <script>:
   catalog-core.js (config + trasformazione Shopify) →
   catalog-snapshot.js (copia del catalogo, generata) →
   products.js (reparti, look, TATO_PRODUCTS) →
   shopify.js (dati dal vivo) → script.js (UI).
   ═══════════════════════════════════════════ */
import './catalog-core.js';
import './catalog-snapshot.js';
import './products.js';
import './shopify.js';
import './script.js';
