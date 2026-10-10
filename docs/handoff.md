# TATO — Handoff

**Aggiornato:** 2026-10-10 · branch `ecommerce-dev` (su GitHub, push ok con account TATORM) · live `main` invariato.
Mappa del codice e regole: `CLAUDE.md`. Storico sessioni: `docs/archive/handoff-storico.md`.

## Ripartire da qui
Fine sessione 10/10: tutto committato e pushato su `origin/ecommerce-dev`, server locale su :8777.
Prossimi passi possibili: guida Shopify Markets (USA/UK/JP) · Formspree per il pre-ordine ·
descrizioni prodotto in italiano · passaggio a Cloudflare (al lancio). Chiedere all'utente da cosa partire.

## Stato
Sito completo lato codice: home, collection (da Shopify), shop con filtri, scheda prodotto (zoom,
visti di recente, guida taglie), bag + checkout Shopify, wishlist, pre-ordine (mailto), account
(monogramma → pagina account Shopify), EN/IT, valute (attive quando Shopify ha i mercati),
404, accessibilità AA, Lighthouse mobile ~84 / 100 / 96 / 100.

## Prima del lancio (bloccanti)
1. **Cloudflare Pages** al posto di GitHub Pages + DNS da Aruba (posta!): checklist nella memoria "PROMEMORIA lancio".
2. **Shopify**: stock reale; pagamenti (Shopify Payments); **mercati USA/UK/Giappone** + spedizioni/dazi
   + canale Headless nei mercati; branding account/checkout (logo `docs/guide/shopify-logo.jpg`).
3. **Testi** (li scrive l'utente): pagine About, Spedizioni, Resi, FAQ, Privacy, Cookie, Condizioni
   (Shopify › Pagine); nella PDP "Delivery estimate" e "Order by phone"; misure guida taglie.
4. **Redirect negozio Shopify**: in theme.liquid cambiare `nuovo_sito = false` → `true` al lancio.

## Aperto / da decidere
- Pre-order via Formspree (oggi mailto: info@tatorm.com) → `ENDPOINT` in `app/preorder.js` + CSP connect-src.
- Descrizioni prodotto in italiano (oggi inglese anche con IT).
- 6 colori senza foto del look all'hover (Cap Black/Navy/Red, Smock Black/Dark Grey, Tiny Crewneck Black,
  2 Button Shirt Light Grey/White).
- Refuso "baloon" nella descrizione Tobi Pants (Shopify).
- Testi < 12px su mobile (Lighthouse li segnala; scelta di stile, non toccati).
- Popup newsletter: non ricorda la chiusura (l'utente ha detto di lasciarlo così).
- Ricerca prodotti: rimandata.

## Ultima sessione (10/10)
Menu sopra le foto in home/Collection · una card per colore · tailored pants in Pants · via trattini lunghi ·
zoom + visti di recente · motion · account (monogramma) · EN/IT · valute · header a scomparsa su desktop ·
menu chiuso da scroll del visitatore · Collection ▸ collezioni nel menu · Bag al posto di Cart · 404 ·
accessibilità (grigio #767676, inert) · CLS 0 · redirect del negozio Shopify attivo (tutto → home) ·
pulizia codice e riorganizzazione docs (questa mappa) · primo push di `ecommerce-dev` su GitHub.
