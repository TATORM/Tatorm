/* ═══════════════════════════════════════════
   TATO — entry del bundle di produzione
   ─────────────────────────────────────────
   In SVILUPPO i tre file sono caricati singolarmente
   dai <script> in index.html (tra i marker build:js).
   In PRODUZIONE scripts/build.mjs bundla questo file
   con esbuild in assets/dist/app-[hash].js.

   L'ordine degli import replica quello dei <script>:
   products.js definisce window.TATO_* → shopify.js li
   usa → script.js consuma entrambi via window.
   ═══════════════════════════════════════════ */
import './products.js';
import './shopify.js';
import './script.js';
