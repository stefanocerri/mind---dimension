// LEZIONE 6 — Leggere un sito vero: deejay.de
//
// È la versione Playwright del vecchio scraper in miketyson/deejay/ (axios + node-html-parser).
// Si lancia DAL TUO COMPUTER con:   npm run deejay
//
// Perché dal tuo computer: deejay.de è protetto da Cloudflare, che blocca le visite
// automatiche che arrivano dai server (cloud, datacenter). Da casa arrivi con la tua
// connessione e un browser vero e visibile, come una visita normale.
// Se Cloudflare ti blocca lo stesso, lo script si ferma: vuol dire che il sito non vuole
// accessi automatici, e non si insiste.
//
// Regole di buona educazione, valgono per ogni sito:
//   - poche pagine, con pause tra una e l'altra (qui 3-6 secondi)
//   - niente trucchi per sembrare un altro browser o cambiare indirizzo
//   - i dati servono a te, non si ripubblicano

import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BASE = 'https://www.deejay.de';
// La lista "Buzz Charts" che usava il vecchio scraper (pagina 1, 20 dischi per pagina)
const LISTA = `${BASE}/content.php?param=/m_All/sm_Charts/liste_buzz/page_17/perpage_20/page_1`;
const MAX_DISCHI = Number(process.env.MAX_DISCHI ?? 5);
const OUTPUT = join(import.meta.dirname, '..', 'output');
mkdirSync(OUTPUT, { recursive: true });

const pausa = (min = 3000, max = 6000) => new Promise((r) => setTimeout(r, min + Math.random() * (max - min)));

/** Riconosce le pagine di Cloudflare: blocco vero o verifica "sei umano?". */
async function controllaCloudflare(page) {
  const titolo = await page.title();
  if (/Attention Required|you have been blocked/i.test(titolo + (await page.locator('body').innerText().catch(() => '')))) {
    console.log('\n⛔ Cloudflare ha bloccato la visita. Il sito non accetta accessi automatici: ci fermiamo qui.');
    return 'bloccato';
  }
  if (/Just a moment|Un momento/i.test(titolo)) {
    console.log('\n🧑 Cloudflare chiede una verifica. Se compare una casella, cliccala TU nel browser aperto.');
    console.log('   Aspetto fino a 60 secondi…');
    await page.waitForFunction(() => !/Just a moment|Un momento/i.test(document.title), null, { timeout: 60_000 })
      .catch(() => {});
    return controllaCloudflare(page);
  }
  return 'ok';
}

/** Salva screenshot e HTML: servono per studiare la pagina e trovare i selettori giusti. */
async function salvaPerStudio(page, nome) {
  await page.screenshot({ path: join(OUTPUT, `${nome}.png`), fullPage: true });
  writeFileSync(join(OUTPUT, `${nome}.html`), await page.content());
  console.log(`   📁 salvati output/${nome}.png e output/${nome}.html`);
}

// Un profilo del browser che resta tra un'esecuzione e l'altra (cookie, preferenze),
// come il tuo browser di tutti i giorni. Sta in playwright-lab/.profilo-browser
const contesto = await chromium.launchPersistentContext(join(import.meta.dirname, '..', '.profilo-browser'), {
  headless: process.env.HEADLESS === '1',
  viewport: { width: 1280, height: 900 },
  locale: 'it-IT',
});
const page = contesto.pages()[0] ?? (await contesto.newPage());

try {
  console.log('1. Apro la lista:', LISTA);
  await page.goto(LISTA, { waitUntil: 'domcontentloaded' });
  if ((await controllaCloudflare(page)) !== 'ok') {
    await salvaPerStudio(page, 'deejay-bloccato');
    process.exitCode = 1;
  } else {
    await page.waitForLoadState('networkidle').catch(() => {});
    await salvaPerStudio(page, 'deejay-lista');

    // Gli stessi selettori del vecchio scraper. Il sito può essere cambiato dal 2021:
    // se qui trovi 0 link, apri output/deejay-lista.html (o usa `npm run codegen-deejay`)
    // e cerca i selettori nuovi.
    const link = await page.locator('.cover .img1 a').evaluateAll((as) => [...new Set(as.map((a) => a.href))]);
    console.log(`2. Trovati ${link.length} dischi nella lista`);

    const dischi = [];
    for (const url of link.slice(0, MAX_DISCHI)) {
      await pausa();
      console.log('3. Apro', url);
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      if ((await controllaCloudflare(page)) !== 'ok') break;

      // locator(...).first() + textContent: se l'elemento manca, restituisce null e non si blocca
      const testo = (sel) => page.locator(sel).first().textContent({ timeout: 3000 }).then((t) => t?.replace(/\s+/g, ' ').trim() ?? null).catch(() => null);
      const disco = {
        url,
        artista: await testo('.artikel .artist h1'),
        titolo: await testo('.artikel .label h1'),
        etichetta: await testo('.artikel .label h3'),
        uscita: await testo('.date'),
        copertina: await page.locator('.cover .noMod img').first().getAttribute('src', { timeout: 3000 }).catch(() => null),
        tracce: await page.locator('.playtrack a h5').allTextContents(),
      };
      console.log('  ', disco.artista, '—', disco.titolo, `(${disco.tracce.length} tracce)`);
      dischi.push(disco);
      if (dischi.length === 1) await salvaPerStudio(page, 'deejay-disco');
    }

    writeFileSync(join(OUTPUT, 'deejay-dischi.json'), JSON.stringify(dischi, null, 2));
    console.log(`\n✅ ${dischi.length} dischi salvati in output/deejay-dischi.json`);
  }
} finally {
  await contesto.close();
}
