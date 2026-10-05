# TATO — Collezioni, look e pagine su Shopify

Da qui in poi **i contenuti del sito si gestiscono da Shopify**, come i prodotti:
collezioni (con campagna e look), archivio delle collezioni passate, pagina About
e pagine info (Shipping, Returns, FAQ, Privacy, Cookie, Terms).

Il sito si aggiorna da solo a ogni pubblicazione (ogni 30 minuti, quando il sito
nuovo sarà online). **Finché su Shopify non c'è nessuna collezione, il sito continua
a mostrare i 21 look attuali**: puoi lavorare con calma, niente si rompe a metà.

Tempo stimato: **passo 1–3 ~20 min** · inserimento dei 21 look **~40 min** · pagine a piacere.

---

## Passo 1 — Permessi della chiave del sito (2 min)

Il sito legge Shopify con una chiave "Storefront" che oggi vede solo i prodotti.

1. Shopify → **Impostazioni → App e canali di vendita** → apri **Headless**
   (il canale da cui è stata creata la chiave del sito).
2. Apri lo storefront del sito → **Storefront API → Gestisci** (permessi).
3. Attiva anche:
   - **Metaobjects** — lettura (`unauthenticated_read_metaobjects`)
   - **Content / Pagine** — lettura (`unauthenticated_read_content`)
4. **Salva.** La chiave resta la stessa, non serve mandarmi niente.

## Passo 2 — Definizione "Look" (5 min)

Shopify → **Impostazioni → Dati personalizzati → Metaoggetti → Aggiungi definizione**.

- **Nome:** `Look`  · **Tipo** (sotto il nome, "type"): `tato_look`  ⚠️ esattamente così
- Campi (il nome del campo deve essere esattamente questo, in inglese):

| Nome campo | Tipo | Note |
|---|---|---|
| `number` | Numero intero | il numero del look (1, 2, 3…) |
| `images` | File → **Elenco di file**, solo immagini | foto del carosello, nell'ordine voluto |
| `items` | Testo su più righe | una riga per capo: `NOME \| composizione \| colore` |

- In **Accesso / Opzioni**: attiva **Storefronts** (senza, il sito non lo vede)
  e **Pubblicabile** (stato Attivo/Bozza: un look in bozza non compare).
- Salva.

## Passo 3 — Definizione "Collection" (5 min)

Di nuovo **Aggiungi definizione**:

- **Nome:** `Collection` · **Tipo:** `tato_collection`  ⚠️ esattamente così

| Nome campo | Tipo | Note |
|---|---|---|
| `title` | Testo a riga singola | es. "Rome" |
| `season` | Testo a riga singola | es. "FW26" |
| `intro` | Testo su più righe | testo della campagna; ogni riga = un paragrafo (facoltativo) |
| `campaign_images` | File → Elenco di file, solo immagini | foto della campagna (facoltativo) |
| `looks` | Riferimento a metaoggetto → **Elenco**, definizione **Look** | i look, nell'ordine del sito |
| `current` | Vero o falso | **Sì** solo per la collezione attuale |

- Accesso: **Storefronts** attivo, **Pubblicabile** attivo. Salva.

## Come appare sul sito

- **/collection/** = la collezione con `current` = Sì.
  - Con **foto campagna**: prima schermata = carosello della campagna, e nel pannello
    a destra (su mobile in basso) stagione, titolo e testo `intro`. Poi i look.
  - Con **solo testo** (`intro` senza foto): una schermata di testo prima del look 1.
  - Senza nessuno dei due: si parte dal look 1, come oggi.
- **Archivio**: tutte le collezioni con `current` = No. Appena ce n'è una, nel menu
  compare **Archive** (/archive/) e ognuna ha la sua pagina /collection/<handle>/.
  Quando arriva la prossima collezione: crei la nuova con `current` = Sì e metti No
  su quella attuale, che passa da sola in archivio.
- **Capi del look**: se il NOME è identico al titolo di un prodotto Shopify (maiuscole
  non contano), nel pannello diventa il link "€ — Shop" alla scheda prodotto;
  altrimenti appare come "Archive piece". Se è un prodotto in vendita puoi anche
  lasciare vuota la composizione (`TOBI PANTS | | Black`): la prende dal prodotto.
- Le foto caricate su Shopify vengono servite dalla CDN di Shopify, già ridimensionate.

---

## Passo 4 — La collezione attuale: i 21 look (~40 min)

Shopify → **Contenuti → Metaoggetti → Look → Aggiungi voce**, per ognuno dei look qui sotto:

1. **number** → il numero.
2. **images** → *Carica file* e scegli le foto della cartella indicata, **nell'ordine indicato**.
   Cartelle sul Mac: `Desktop/LAVORO/IN CONTINUAZIONE/TATO/SITO/media/looks/look-NN/`
   (solo i `.jpg`, non i file `.avif`).
3. **items** → copia e incolla il blocco di testo così com'è.
4. Stato **Attivo** → Salva.

Poi **Contenuti → Metaoggetti → Collection → Aggiungi voce**: title, season, eventuale
testo e foto campagna, in **looks** seleziona i 21 look dal 1 al 21, **current = Sì**,
stato Attivo → Salva.

> Consiglio: fai prima **Look 1 e 2 e la Collection** con solo quei due, e scrivimi.
> Controllo che il sito li legga bene prima che inserisci tutti gli altri.
> (Finché la collezione su Shopify ha 2 look, il sito ne mostrerà 2: va bene in prova,
> il sito nuovo non è ancora online.)

### Look 1

- **Number:** 1
- **Images:** cartella `media/looks/look-01/` → 01.jpg, 02.jpg
- **Items:**

```
2 BUTTON WINDBREAKER | 100% Cotton | White
BACK SHIRT | 100% Cotton | White
TOBI PANTS | 100% Cotton | White
```

### Look 2

- **Number:** 2
- **Images:** cartella `media/looks/look-02/` → 01.jpg, 02.jpg, 03.jpg, 04.jpg, 05.jpg
- **Items:**

```
CROPPED TAILORED JACKET | 100% Wool | Anthracite
BACK SHIRT | 100% Cotton | Black
2 BUTTON TAILORED PANTS | 100% Wool | Anthracite
```

### Look 3

- **Number:** 3
- **Images:** cartella `media/looks/look-03/` → 01.jpg, 02.jpg
- **Items:**

```
CARDIGAN V NECK | 100% Wool | Chocolate
BACK SHIRT | 100% Cotton | White
2 BUTTON TAILORED PANTS | 100% Wool | Anthracite
```

### Look 4

- **Number:** 4
- **Images:** cartella `media/looks/look-04/` → 01.jpg, 02.jpg, 03.jpg, 04.jpg
- **Items:**

```
2 BUTTON SHIRT DRESS | 100% Cotton | Baby Blue
TAILORED PANTS | 100% Wool | Anthracite
```

### Look 5

- **Number:** 5
- **Images:** cartella `media/looks/look-05/` → 01.jpg, 02.jpg, 03.jpg
- **Items:**

```
CARDIGAN V NECK | 100% Wool | Lilac
TINY CREWNECK | 100% Cotton | Baby Blue
2 BUTTON SHIRT | 100% Cotton | White
TOBI PANTS | 100% Cotton | Black
```

### Look 6

- **Number:** 6
- **Images:** cartella `media/looks/look-06/` → 01.jpg, 02.jpg, 03.jpg, 04.jpg
- **Items:**

```
RIB BOMBER | 100% Nylon | Green / Chocolate
CARDIGAN V NECK | 100% Wool | Baby Green
2 BUTTON SHIRT | 100% Cotton | Baby Pink
2 BUTTON MIDI SKIRT | 100% Wool | Anthracite
```

### Look 7

- **Number:** 7
- **Images:** cartella `media/looks/look-07/` → 01.jpg, 02.jpg, 03.jpg
- **Items:**

```
TAILORED JACKET | 100% Wool | Anthracite
BACK SHIRT | 100% Cotton | White
TAILORED PANTS | 100% Wool | Anthracite
```

### Look 8

- **Number:** 8
- **Images:** cartella `media/looks/look-08/` → 01.jpg, 02.jpg, 03.jpg, 04.jpg, 05.jpg
- **Items:**

```
CARDIGAN V NECK | 100% Wool | Cherry
SIDE WAY VEST | 100% Cotton | Burgundy
2 BUTTON SHIRT | 100% Cotton | Baby Pink
TOBI PANTS | 100% Cotton | Baby Pink
```

### Look 9

- **Number:** 9
- **Images:** cartella `media/looks/look-09/` → 01.jpg, 02.jpg
- **Items:**

```
SIDE WAY ZIP-UP | 100% Cotton | Dark Navy
HOODIE | 100% Cotton | Dark Navy
3/4 ZIP-UP | 100% Cotton | Dark Navy
INSIDE OUT SELVEDGE DENIM | 100% Cotton | Black Denim
TATO CAP | 100% Cotton | Green
```

### Look 10

- **Number:** 10
- **Images:** cartella `media/looks/look-10/` → 01.jpg, 02.jpg, 03.jpg
- **Items:**

```
CROPPED TAILORED JACKET | 100% Wool | Anthracite
SMOCK LONGSLEEVE | 100% Cotton | White
TOBI PANTS | 100% Cotton | Black
```

### Look 11

- **Number:** 11
- **Images:** cartella `media/looks/look-11/` → 01.jpg, 02.jpg, 03.jpg, 04.jpg, 05.jpg, 06.jpg, 07.jpg, 08.jpg
- **Items:**

```
TRIPLE BREASTED COAT | 100% Wool | Dark Blue
CROPPED TAILORED JACKET | 100% Wool | Anthracite
BACK SHIRT | 100% Cotton | White
2 BUTTON LONG SKIRT | 100% Wool | Anthracite
```

### Look 12

- **Number:** 12
- **Images:** cartella `media/looks/look-12/` → 01.jpg, 02.jpg, 03.jpg
- **Items:**

```
BACK SHIRT | 100% Cotton | White
2 BUTTON LONG SKIRT | 100% Cotton | Shiny White
```

### Look 13

- **Number:** 13
- **Images:** cartella `media/looks/look-13/` → 01.jpg, 02.jpg, 03.jpg
- **Items:**

```
CROPPED TAILORED JACKET | 100% Wool | Anthracite
2 BUTTON SHIRT | 100% Cotton | White
2 BUTTON TAILORED PANTS | 100% Wool | Anthracite
```

### Look 14

- **Number:** 14
- **Images:** cartella `media/looks/look-14/` → 01.jpg, 02.jpg, 03.jpg
- **Items:**

```
TRIPLE BREASTED COAT | 100% Wool | Dark Blue
BACK SHIRT | 100% Cotton | White
TAILORED PANTS | 100% Wool | Anthracite
```

### Look 15

- **Number:** 15
- **Images:** cartella `media/looks/look-15/` → 01.jpg, 02.jpg, 03.jpg
- **Items:**

```
RIB BOMBER | 100% Nylon | Green / Chocolate
2 BUTTON WINDBREAKER | 100% Cotton | Grey
2 BUTTON SHIRT | 100% Cotton | Baby Blue
2 BUTTON TAILORED PANTS | 100% Wool | Anthracite
```

### Look 16

- **Number:** 16
- **Images:** cartella `media/looks/look-16/` → 01.jpg, 02.jpg
- **Items:**

```
RIB BOMBER | 100% Nylon | Dark Navy / Black
2 BUTTON WINDBREAKER | 100% Cotton | White
TOBI PANTS | 100% Cotton | White
```

### Look 17

- **Number:** 17
- **Images:** cartella `media/looks/look-17/` → 01.jpg, 02.jpg, 03.jpg, 04.jpg, 05.jpg
- **Items:**

```
TAILORED JACKET | 100% Wool | Anthracite
SMOCK LONGSLEEVE | 100% Cotton | Baby Pink
2 BUTTON MIDI SKIRT | 100% Wool | Anthracite
2 BUTTON LONG SKIRT | 100% Wool | Black
```

### Look 18

- **Number:** 18
- **Images:** cartella `media/looks/look-18/` → 01.jpg, 02.jpg, 03.jpg, 04.jpg
- **Items:**

```
BACK SHIRT | 100% Cotton | Black
2 BUTTON LONG SKIRT | 100% Cotton | Black
```

### Look 19

- **Number:** 19
- **Images:** cartella `media/looks/look-19/` → 01.jpg, 02.jpg, 03.jpg
- **Items:**

```
CARDIGAN V NECK | 100% Wool | Lilac
2 BUTTON WINDBREAKER | 100% Cotton | Baby Blue / Oriental Blue
BACK SHIRT | 100% Cotton | White
TAILORED PANTS | 100% Wool | Anthracite
```

### Look 20

- **Number:** 20
- **Images:** cartella `media/looks/look-20/` → 01.jpg, 02.jpg, 03.jpg, 04.jpg
- **Items:**

```
TRIPLE BREASTED BOMBER | 100% Wool | Dark Blue
SMOCK LONGSLEEVE | 100% Cotton | Navy / Bordeaux
TOBI PANTS | 100% Cotton | Navy
TATO TAILORING CAP | 100% Cotton | Washed Black
```

### Look 21

- **Number:** 21
- **Images:** cartella `media/looks/look-21/` → 01.jpg, 02.jpg, 03.jpg
- **Items:**

```
2 BUTTON SHIRT DRESS | 100% Cotton | White
2 BUTTON LONG SKIRT | 100% Cotton | Shiny White
```

---

## Passo 5 — Pagine: About e info (quando hai i testi)

Shopify → **Negozio online → Pagine → Aggiungi pagina**. Conta il **handle**
(in fondo alla pagina, "Anteprima del motore di ricerca → Modifica" → URL e handle):

| Pagina | Handle esatto | Dove compare |
|---|---|---|
| About | `about` | /about/, sopra i contatti |
| Shipping | `shipping` | /shipping/ |
| Returns & Refunds | `returns` | /returns/ |
| FAQ | `faq` | /faq/ |
| Privacy Policy | `privacy` | /privacy/ |
| Cookie Policy | `cookies` | /cookies/ |
| Terms of Sale | `terms` | /terms/ |

- Se nel menu di Shopify non vedi **Negozio online**, dimmelo: le Pagine stanno lì
  (si può aggiungere il canale senza usare il suo tema).
- Scrivi il testo con l'editor normale: titoli, grassetto, elenchi e link vanno bene;
  immagini, video e stili vengono ignorati (il sito usa sempre la sua tipografia).
- Lo stato deve essere **Visibile**.
- Finché una pagina info non c'è su Shopify, il sito mostra la versione con i
  segnaposto [DA FORNIRE] e la tiene fuori da Google; appena c'è il testo vero,
  la pagina viene indicizzata.
- Privacy, Cookie e Terms: testi da far scrivere o rivedere a un legale.

## Se qualcosa non compare

A ogni pubblicazione il build stampa un controllo (`npm run content`), per esempio:
"look 4 senza foto", "nessuna collezione segnata come current", "TATO HAT non è un
prodotto in vendita → Archive piece", oppure che la chiave non ha il permesso
(→ Passo 1). Chiedimi di lanciarlo e ti dico cosa sistemare.
