# TATO — Handoff

**Aggiornato:** 2026-11-25 · branch `ecommerce-dev` (su GitHub, push ok con account TATORM) · live `main` invariato.
Mappa del codice e regole: `CLAUDE.md`. Storico sessioni: `docs/archive/handoff-storico.md`.

## Ripartire da qui
Fine sessione 25/11: tutto committato e pushato su `origin/ecommerce-dev` (About fatto, vedi sotto).
Fatto: **Notify me** sulle taglie/colori esauriti (`app/notify.js`).
20/10: **descrizioni prodotto in italiano** (`tDetail`, dizionario `DETAILS` in `app/i18n.js`; frasi nuove
su Shopify vanno aggiunte lì). Playwright aggiornato: reinstallato chromium (`npx playwright install chromium`).
Scartati dall'utente: soglia spedizione gratuita (no) e countdown al drop (non ora).
Lighthouse CI riparato (falliva dal 10/10 per `localhost:PORT` in `.github/lighthouse/lighthouserc.json`): ora verde, nessun avviso.
Prossimi passi proposti: **Formspree** (l'utente crea l'account e passa il link → `ENDPOINT` in
`app/preorder.js` + CSP: attiva pre-ordine e Notify me) · **analytics** (consigliato Plausible, senza
cookie/banner; decide l'utente) · guida Shopify Markets (USA/UK/JP) · descrizioni in italiano ·
Cloudflare (al lancio). Altre idee discusse: countdown al drop, soglia spedizione gratuita nella bag,
Klaviyo al posto di Mailchimp (carrelli abbandonati), video nei look, pagina editoriale.

## Sessione 25/11
**Pagina About** con il testo del brand (scritto con l'utente), EN + IT:
"TATO is an independent fashion label based in Rome. / It grows from a wish to return to a simpler way of seeing… / Designed in Rome, made in Italy, in small quantities, released one chapter at a time."
- Testo in `ABOUT_DEFAULT` (`app/info.js`), traduzioni IT in `i18n.js` (un paragrafo = una chiave: se cambi l'inglese, cambia anche la chiave IT).
- Una Pagina Shopify con handle `about` lo sostituirebbe (solo in inglese): meglio non crearla.
- Box testo `.about-wrap` portato a **1000px** (era 480) su richiesta dell'utente; su mobile resta a tutta larghezza.
- Meta About: titolo "About · TATO" (prima "Contacts") anche nel prerender.
- Playwright: chromium reinstallato (cancellato dalla pulizia cache del Mac): `npm_config_cache=<scratchpad>/npmcache npx playwright install chromium`.
- Tutto su `ecommerce-dev` (ultimo commit "About: box del testo a 1000px"); **non pubblicato su main**.
- In arrivo: pop up da Kiodoshop, Piazza del Fico 21, Roma, 10–14/12 (locandina "Release 001" / "First Release" proposta, decide l'utente).

## Stato
Sito completo lato codice: home, collection (da Shopify), shop con filtri, scheda prodotto (zoom,
visti di recente, guida taglie, Notify me sulle taglie esaurite), bag + checkout Shopify, wishlist, pre-ordine (mailto), account
(monogramma → pagina account Shopify), EN/IT, valute (attive quando Shopify ha i mercati),
404, accessibilità AA, Lighthouse mobile ~84 / 100 / 96 / 100.

## Prima del lancio (bloccanti)
1. **Cloudflare Pages** al posto di GitHub Pages + DNS da Aruba (posta!): checklist nella memoria "PROMEMORIA lancio".
2. **Shopify**: stock reale; pagamenti (Shopify Payments); **mercati USA/UK/Giappone** + spedizioni/dazi
   + canale Headless nei mercati; branding account/checkout (logo `docs/guide/shopify-logo.jpg`).
3. **Testi** (li scrive l'utente): ~~About~~ (25/11: testo EN/IT in `app/info.js` + `i18n.js`; una Pagina Shopify "about" lo sostituirebbe, ma solo in inglese), Spedizioni, Resi, FAQ, Privacy, Cookie, Condizioni
   (Shopify › Pagine); nella PDP "Delivery estimate" e "Order by phone"; misure guida taglie.
4. **Redirect negozio Shopify**: in theme.liquid cambiare `nuovo_sito = false` → `true` al lancio.

## Aperto / da decidere
- Pre-order e **Notify me** (taglia esaurita, `app/notify.js`) via Formspree: oggi mailto a info@tatorm.com →
  un solo `ENDPOINT` in `app/preorder.js` attiva entrambi (+ CSP connect-src).
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

## Sessione 11/10
Notify me: taglia o colore esaurito → "Notify me when available" (IT "Avvisami quando torna disponibile")
al posto di Add to bag, pagamento veloce nascosto, campo email a filo sotto il pulsante; taglie esaurite
ora selezionabili nella tendina (`data-soldout`, non più `disabled`). Invio come il pre-ordine (mailto oggi).
Scelto di NON usare Mailchimp: chi è già iscritto non verrebbe registrato e manca il consenso newsletter.
Test e2e nuovo in `tests/e2e/shop.spec.mjs`.
