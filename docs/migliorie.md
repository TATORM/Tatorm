# TATO — Migliorie per un e-commerce di alto livello

Lista stilata il 30/09/2026 sullo stato attuale del sito (branch `ecommerce-dev`).
Chi: **Tu** = da fare nel pannello Shopify/servizi o contenuti da fornire · **Io** = lavoro sul codice · **Insieme**.

## A. Prima del lancio (senza queste il sito non è pronto)

| # | Miglioria | Chi |
|---|---|---|
| A1 | **Cloudflare Pages** al posto di GitHub Pages (vedi promemoria in handoff) | Insieme |
| A2 | **Stock reale** su Shopify (oggi tutto a 0 → tutto "Sold out") | Tu |
| A3 | **Pagamenti**: Shopify Payments + Apple Pay / Google Pay / PayPal; **paga in 3 rate** (Klarna o Scalapay: molto usato in Italia nella moda) | Tu |
| A4 | **Checkout Shopify con il brand**: logo, colori, font nel Checkout editor; togliere la password della vetrina | Tu, io ti guido |
| A5 | **Testi legali e info reali**: spedizioni, resi (recesso 14 giorni), privacy, cookie, termini di vendita. Ora c'è scritto "[DA FORNIRE]" | Tu (+ legale) |
| A6 | **Dati aziendali nel footer**: ragione sociale, P.IVA, sede (obbligatori per l'e-commerce in Italia) | Tu fornisci, io inserisco |
| A7 | **Segnaposto nella pagina prodotto**: "Delivery estimate — to be configured", "Order by phone — number to be provided", "Fit information to be provided" e le scritte PayPal/Apple Pay fisse. Vanno riempiti con dati veri oppure tolti | Tu decidi, io faccio |
| A8 | **Guida taglie con le misure in cm** (oggi mostra "—") | Tu fornisci, io inserisco |
| A9 | **Email @tatorm.com**: SPF + DKIM + DMARC (oggi SPF manca: le email finiscono in spam e il dominio si può falsificare) | Insieme |
| A10 | **Sicurezza account**: autenticazione a due fattori su Shopify, GitHub, Aruba, Mailchimp; `main` protetto su GitHub; permessi minimi del token Shopify | Tu |
| A11 | **Email automatiche Shopify con il brand** (conferma ordine, spedizione, reso) e **recupero dei checkout abbandonati** (già incluso in Shopify, va attivato) | Tu |

## B. Subito dopo il lancio (alto impatto sulle vendite)

| # | Miglioria | Chi |
|---|---|---|
| B1 | **"Avvisami quando torna disponibile"** sulle taglie esaurite: fondamentale per i drop | Insieme |
| B2 | **Più foto per colore**: fronte, retro, dettaglio + foto indossata; galleria con zoom a tutto schermo | Tu (foto), io (galleria) |
| B3 | **Info vestibilità**: "La modella è alta 1,78 e indossa la taglia 1" per prodotto (campo su Shopify) | Insieme |
| B4 | **Statistiche senza cookie** (Cloudflare Web Analytics o Plausible): nessun banner cookie necessario, dati su visite e prodotti più visti | Io |
| B5 | **Avviso automatico se qualcosa si rompe**: monitoraggio degli errori JS dal vivo + controllo giornaliero automatico del sito online (home → prodotto → carrello → checkout) | Io |
| B6 | **Google Shopping gratuito + Instagram/Facebook Shop**: canali ufficiali Shopify, sincronizzano i prodotti da soli (i dati strutturati sono già pronti) | Tu, io ti guido |
| B7 | **Italiano + inglese** e **prezzi nella valuta del cliente** (Shopify Markets) | Insieme |
| B8 | **Soglia spedizione gratuita** mostrata nel carrello ("Ti mancano €40 per la spedizione gratuita") | Io, dopo la tua decisione sul valore |
| B9 | **Accessibilità**: carrello e guida taglie navigabili da tastiera e lettori di schermo; caroselli con tasti freccia. Conta anche per l'European Accessibility Act, che per ora esclude le microimprese | Io |

## C. Struttura: gestire tutto senza toccare il codice

| # | Miglioria | Chi |
|---|---|---|
| C1 | **Look della Collection gestiti da Shopify** (Metaobjects): nuova collezione = foto + capi caricati in Shopify, niente codice. Oggi i 21 look sono scritti in `products.js` | Io |
| C2 | **Foto dei look e della Home sulla CDN Shopify** invece che nel repository (58 MB): repo leggero, upload da Shopify | Io |
| C3 | **Pagine info/legali come Pagine Shopify**: testi modificabili dal pannello | Io |
| C4 | **Hero e blocchi della Home modificabili** da Shopify (quali foto, in che ordine) | Io |
| C5 | **CSS diviso per componenti** (2.600 righe in un file, 21 `!important`) + variabili di design (colori, spaziature, tipografia) | Io |
| C6 | **Rilasci con versione e ritorno indietro in un clic** (tag Git + deploy precedenti su Cloudflare) | Io |

## D. Livello successivo (quando il catalogo cresce)

| # | Miglioria | Chi |
|---|---|---|
| D1 | Filtri per taglia/colore/prezzo e ordinamento nello Shop | Io |
| D2 | Ricerca prodotti | Io |
| D3 | Area cliente: ordini, tracking, resi self-service (account clienti Shopify) | Insieme |
| D4 | Drop: pagina countdown, limite di pezzi per ordine, protezione anti-bot | Insieme |
| D5 | Lista desideri | Io |
| D6 | Pre-ordine per capi in produzione | Insieme |
