# Playwright Lab

Una palestra per imparare [Playwright](https://playwright.dev): un piccolo sito finto in `sito/`
e cinque file di test commentati in italiano, dal più facile al più avanzato.

## Installazione (una volta sola)

```bash
cd playwright-lab
npm install
npx playwright install chromium
```

## Comandi

| Comando | Cosa fa |
|---|---|
| `npm test` | lancia tutti i test (senza vedere il browser) |
| `npm run test:headed` | come sopra, ma vedi il browser che clicca |
| `npm run test:ui` | **il migliore per imparare**: interfaccia grafica, rivedi ogni passo |
| `npm run test:debug` | si ferma a ogni riga, avanzi tu passo passo |
| `npm run report` | apre il report HTML dell'ultima esecuzione |
| `npm run sito` | avvia solo il sito su http://localhost:4173 per guardarlo |
| `npm run codegen` | apri il sito, clicchi tu, Playwright scrive il test |

Per un solo file o un solo test:

```bash
npx playwright test tests/03-form.spec.ts
npx playwright test -g "contatore"
npx playwright test --project=chromium
```

Al primo `npm test` il test di confronto visivo (lezione 5) fallisce perché non ha ancora
l'immagine di riferimento: la crea, e con `npx playwright test --update-snapshots` la conferma.

## Le lezioni

1. `tests/01-primi-passi.spec.ts` — struttura di un test, `goto`, `click`, `expect`
2. `tests/02-locator.spec.ts` — come trovare gli elementi (`getByRole`, `getByLabel`, …)
3. `tests/03-form.spec.ts` — compilare form, checkbox, liste, `filter()`, modalità strict
4. `tests/04-attese-e-rete.spec.ts` — dati in ritardo, `waitForResponse`, finte API con `page.route`
5. `tests/05-dialoghi-e-screenshot.spec.ts` — dialoghi, screenshot, confronto visivo

6. `esercizi/deejay.mjs` — un sito vero: deejay.de (vedi sotto)

Ogni file di `tests/` finisce con un **ESERCIZIO**. Il sito da testare è `sito/index.html`: puoi
cambiarlo, rompere qualcosa apposta e guardare quale test se ne accorge.

## Lezione 6: un sito vero (deejay.de)

È la versione Playwright del tuo vecchio scraper in `miketyson/deejay/`. Apre la lista
"Buzz Charts", raccoglie i link dei dischi e da ognuno legge artista, titolo, etichetta,
data, copertina e tracce. Salva tutto in `output/deejay-dischi.json`, più screenshot e HTML
delle pagine per studiarle.

```bash
npm run deejay
```

Va lanciato **dal tuo computer**. deejay.de è protetto da Cloudflare, che blocca le visite
automatiche che arrivano dai server: dal cloud la risposta è "Sorry, you have been blocked".
Da casa usi la tua connessione e un browser visibile, quindi è una visita come le tue.

- Se compare la verifica "sei umano?", la fai tu nel browser aperto: lo script aspetta.
- Se compare il blocco, lo script si ferma. Vuol dire che il sito non vuole accessi
  automatici: non si insiste e non si usano trucchi per aggirarlo.
- Lo script va piano: legge 5 dischi (`MAX_DISCHI=10 npm run deejay` per cambiare) con
  qualche secondo di pausa tra una pagina e l'altra.

I selettori vengono dal vecchio scraper del 2021: se il sito è cambiato e trovi 0 dischi,
apri `output/deejay-lista.html` oppure lancia `npm run codegen-deejay`, clicca sugli elementi
e guarda quali selettori propone Playwright. Aggiornarli è un ottimo esercizio.

## Diagnosi dell'accesso a deejay.de (Mac)

```bash
npx playwright install chromium webkit
node diagnosi/deejay-mac.mjs
```

Confronta curl, Node, Chromium headless, Chromium con finestra, Chrome, WebKit e Safari (automatico e usato da te),
con una sola richiesta alla home per client e 5 secondi di pausa. Salva il risultato in `diagnosi/risultati/`
(JSON e una tabella in Markdown). Per il test di Safari automatico: `sudo safaridriver --enable` e in Safari
Sviluppo → Consenti automazione remota.

## Tre regole d'oro

- Usa `await expect(...)`: riprova da solo finché la condizione è vera, quindi niente `sleep`.
- Preferisci `getByRole` e `getByLabel` ai selettori CSS: i test si rompono meno.
- Quando un test fallisce, apri `npm run report` o `npm run test:ui` e guarda cosa è successo.

## Prossimo passo

Quando ti senti pronto, prova a testare il sito vero di Mind Dimension: avvialo con
`npm run dev` nella cartella principale e in `playwright.config.ts` cambia `baseURL`
e `webServer` per puntare a `http://localhost:3000`.
