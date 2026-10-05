/* ═══════════════════════════════════════════
   TATO — entry del bundle di produzione
   ─────────────────────────────────────────
   In SVILUPPO index.html carica questo file come modulo
   (<script type="module">) e il browser segue gli import.
   In PRODUZIONE scripts/build.mjs bundla questo file
   con esbuild in assets/dist/app-[hash].js.

   L'ordine degli import replica quello dei <script>:
   catalog-core.js (config + trasformazione Shopify) →
   catalog-snapshot.js (copia del catalogo, generata) →
   content-core.js + content-snapshot.js (collezioni, look,
   pagine da Shopify, generata) →
   products.js (reparti, look, TATO_PRODUCTS) →
   shopify.js (dati dal vivo) → app.js (UI, moduli in app/).
   ═══════════════════════════════════════════ */
import './catalog-core.js';
import './catalog-snapshot.js';
import './content-core.js';
import './content-snapshot.js';
import './products.js';
import './shopify.js';
import './app.js';
