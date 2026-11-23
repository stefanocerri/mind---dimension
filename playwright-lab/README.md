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

Ogni file finisce con un **ESERCIZIO**. Il sito da testare è `sito/index.html`: puoi
cambiarlo, rompere qualcosa apposta e guardare quale test se ne accorge.

## Tre regole d'oro

- Usa `await expect(...)`: riprova da solo finché la condizione è vera, quindi niente `sleep`.
- Preferisci `getByRole` e `getByLabel` ai selettori CSS: i test si rompono meno.
- Quando un test fallisce, apri `npm run report` o `npm run test:ui` e guarda cosa è successo.

## Prossimo passo

Quando ti senti pronto, prova a testare il sito vero di Mind Dimension: avvialo con
`npm run dev` nella cartella principale e in `playwright.config.ts` cambia `baseURL`
e `webServer` per puntare a `http://localhost:3000`.
