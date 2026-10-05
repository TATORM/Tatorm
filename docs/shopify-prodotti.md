# Prodotti TATO — si gestiscono solo da Shopify

Il sito legge i prodotti da Shopify. Nel codice non si scrive nessun prodotto.

## Aggiungere un prodotto

1. **Prodotti → Aggiungi prodotto**
2. **Titolo**: il nome del capo, es. `Rib Bomber`. Se coincide con un capo dei look
   (Collection), il sito lo collega da solo al look ("Shop" nel pannello).
3. **Descrizione**: elenco puntato. La riga con la percentuale diventa la composizione,
   le altre la descrizione:
   - 100% Nylon
   - Ribbed collar and cuffs
   - Designed in Rome, Made in Italy
4. **Foto**: carica i packshot, poi in ogni variante assegna la foto del suo colore
   (Varianti → clic sulla variante → immagine).
5. **Varianti**: opzioni chiamate esattamente `Color` e `Size`.
6. **Tipo di prodotto** → categoria del sito:

   | Tipo prodotto | Categoria sul sito |
   |---|---|
   | Pants | Pants |
   | Shirts | Shirts |
   | Skirts | Skirts |
   | Jersey / Knitwear | Knitwear |
   | Outerwear | Outerwear |
   | Accessories | Accessories |
   | Tailoring | Tailoring (giacche, cappotti e pantaloni sartoriali) |

   Per forzare una categoria: tag `category:tailoring` (o outerwear, shirts, knitwear, pants, skirts, accessories).
7. **Tag reparto**: `women` e/o `men`. Nessuno dei due = compare in entrambi.
   Tag facoltativi `new` / `exclusive` → etichetta "New" / "Exclusive" su card e pagina prodotto.
8. **Lavaggio**: campo "Care" (metafield) in fondo alla pagina prodotto.
9. **Stato: Attivo** + canale di vendita dello Storefront (headless) attivo.

Il prodotto compare sul sito **subito** in Shop e PDP (dati dal vivo). In Home entra
alla ricostruzione successiva del sito (ogni 30 minuti, quando il deploy automatico è attivo).

## Togliere un prodotto

Stato → **Bozza** o **Archiviato**. Sparisce dal sito; chi lo aveva nel carrello lo
vede rimosso con un avviso; i vecchi link mostrano "This piece is no longer available".

## Colore del pallino

Se un colore è nuovo (es. "Olive"), impostare lo **swatch** del valore colore in
Shopify, oppure dirmelo e lo aggiungo alla tabella `COLOR_HEX` in `assets/js/catalog-core.js`.
Senza nessuno dei due il pallino è grigio. `npm run catalog` segnala i colori mancanti.

---

## Checklist — da fare adesso sui 10 prodotti esistenti

- [ ] **2 Button Long Skirt** → aggiungere il tag `women` (ora compare anche sotto Men)
- [ ] **Smock Longsleeve** → i 3 colori usano la stessa foto: assegnare a ogni variante
      la foto giusta (Burgundy / Navy, Black / Dark Grey, White)
- [ ] **Creare il campo Care** (una volta sola):
      Impostazioni → Dati personalizzati → Prodotti → Aggiungi definizione →
      Nome `Care`, spazio dei nomi e chiave `custom.care`, tipo *Testo a riga singola*,
      **attivare "Accesso API Storefront"** (senza, il sito non lo vede)
- [ ] Compilare Care (testi che c'erano sul sito):

  | Prodotto | Care |
  |---|---|
  | Tobi Pants | Dyed garment. Machine wash cold, inside out. |
  | 2 Button Shirt | Machine wash cold |
  | 2 Button Long Skirt | Dry clean only |
  | Triple Breasted Coat | Dry clean only |
  | Cropped Tailored Jacket | Dry clean only |
  | Tailored Pants | Dry clean only |
  | 2 Button Tailored Pants | Dry clean only |
  | Tiny Crewneck | Hand wash cold |
  | Smock Longsleeve | Machine wash cold |
  | TATO Cap | Spot clean |

Controllo: `npm run catalog` nella cartella SITO elenca cosa manca ancora.
