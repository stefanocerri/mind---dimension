// Diagnosi dell'accesso a deejay.de dal Mac: confronta Safari, Chromium con finestra, Chromium headless e altri client.
//
//   cd playwright-lab
//   npm install && npx playwright install chromium webkit
//   node diagnosi/deejay-mac.mjs
//
// Cosa fa: per ogni client apre SOLO due indirizzi:
//   1. https://www.deejay.de/cdn-cgi/trace  → cosa vede Cloudflare (IP, paese, protocollo, user-agent)
//   2. https://www.deejay.de/               → la home: passa (200) o blocco (403)?
// e registra stato, intestazioni, proprietà del browser. Pausa di 5 secondi tra un client e l'altro.
// Non legge il catalogo, non salva pagine del negozio, non prova a superare blocchi o verifiche.
//
// Risultati: diagnosi/risultati/deejay-<data>.json  e  .md  (da mandare a Claude)
//
// Safari:
//   - "Safari (tu)": lo script apre Safari normale e ti chiede cosa vedi. È il riferimento: una persona vera.
//   - "Safari (WebDriver)": Safari automatico. Serve attivarlo una volta:
//        sudo safaridriver --enable     e in Safari: Sviluppo → Consenti automazione remota
//     Se non è attivo, il test viene saltato.

import { chromium, webkit } from '@playwright/test';
import { execFile, spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { promisify } from 'node:util';

// DEEJAY_BASE serve solo per provare lo script contro un server finto locale
const BASE = process.env.DEEJAY_BASE ?? 'https://www.deejay.de';
const HOME = `${BASE}/`;
const TRACE = `${BASE}/cdn-cgi/trace`;
const OUT = join(import.meta.dirname, 'risultati');
const PAUSA = 5000;
const sh = promisify(execFile);
const dorme = (ms) => new Promise((r) => setTimeout(r, ms));
const leggiTrace = (t) => Object.fromEntries(String(t).trim().split('\n').filter((l) => l.includes('=')).map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1)]));
const bloccata = (titolo, html = '') => /Attention Required|you have been blocked|Just a moment|Einen Moment/i.test(titolo + html.slice(0, 5000));

const risultati = [];
function registra(r) {
  risultati.push(r);
  const esito = r.saltato ? `saltato (${r.saltato})` : r.errore ? `errore: ${r.errore}` : `${r.stato} ${r.bloccato ? '⛔ BLOCCATO' : '✅ ok'}`;
  console.log(`\n■ ${r.client}\n  home: ${esito}${r.titolo ? ` — "${r.titolo}"` : ''}`);
  if (r.trace?.uag) console.log(`  Cloudflare vede: ip=${r.trace.ip} loc=${r.trace.loc} http=${r.trace.http} tls=${r.trace.tls}\n  user-agent: ${r.trace.uag}`);
  if (r.navigator) console.log(`  webdriver=${r.navigator.webdriver} · plugins=${r.navigator.plugins} · window.chrome=${r.navigator.windowChrome}`);
}

// --- client non-browser ------------------------------------------------------

async function provaCurl() {
  try {
    const { stdout: t } = await sh('curl', ['-s', '--max-time', '20', TRACE]);
    const { stdout } = await sh('curl', ['-s', '-o', '/dev/null', '-D', '-', '--max-time', '20', HOME]);
    const intest = Object.fromEntries(stdout.split(/\r?\n/).slice(1).filter((l) => l.includes(':')).map((l) => [l.split(':')[0].toLowerCase(), l.slice(l.indexOf(':') + 1).trim()]));
    const stato = Number(stdout.match(/^HTTP\/[\d.]+ (\d+)/)?.[1]);
    registra({ client: 'curl (non è un browser)', stato, bloccato: stato === 403, trace: leggiTrace(t), intestazioni: { server: intest.server, 'cf-ray': intest['cf-ray'], 'cf-mitigated': intest['cf-mitigated'] } });
  } catch (e) { registra({ client: 'curl', errore: e.message }); }
}

async function provaFetch() {
  try {
    const t = await (await fetch(TRACE)).text();
    const r = await fetch(HOME);
    const html = await r.text();
    registra({ client: 'Node fetch (non è un browser)', stato: r.status, bloccato: r.status === 403 || bloccata('', html), titolo: html.match(/<title>([^<]*)/)?.[1]?.trim(), trace: leggiTrace(t),
      intestazioni: { server: r.headers.get('server'), 'cf-ray': r.headers.get('cf-ray'), 'cf-mitigated': r.headers.get('cf-mitigated') } });
  } catch (e) { registra({ client: 'Node fetch', errore: e.message }); }
}

// --- Playwright ----------------------------------------------------------------

async function provaPlaywright(nome, tipo, opzioni) {
  let browser;
  try {
    browser = await tipo.launch(opzioni);
    const ctx = await browser.newContext({ locale: 'de-DE' });
    const page = await ctx.newPage();
    const traceResp = await page.goto(TRACE);
    const trace = leggiTrace(await traceResp.text());
    const inviate = {};
    page.on('request', async (req) => { if (req.url() === HOME) Object.assign(inviate, await req.allHeaders()); });
    const t0 = Date.now();
    const resp = await page.goto(HOME, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);
    const titolo = await page.title();
    const h = resp.headers();
    const nav = await page.evaluate(() => ({
      userAgent: navigator.userAgent,
      webdriver: navigator.webdriver,
      brands: navigator.userAgentData?.brands?.map((b) => `${b.brand} ${b.version}`).join(', ') ?? '(non supportato)',
      plugins: navigator.plugins.length,
      lingue: navigator.languages.join(','),
      windowChrome: typeof window.chrome,
      schermo: `${screen.width}x${screen.height}`,
    }));
    registra({
      client: nome, versione: browser.version(), stato: resp.status(), bloccato: resp.status() === 403 || bloccata(titolo), titolo, ms: Date.now() - t0,
      trace, navigator: nav,
      intestazioniInviate: { 'user-agent': inviate['user-agent'], 'sec-ch-ua': inviate['sec-ch-ua'], 'sec-ch-ua-platform': inviate['sec-ch-ua-platform'], 'accept-language': inviate['accept-language'] },
      intestazioni: { server: h.server, 'cf-ray': h['cf-ray'], 'cf-mitigated': h['cf-mitigated'] },
      cookie: (await ctx.cookies()).map((c) => c.name),
    });
  } catch (e) {
    registra({ client: nome, saltato: /Executable doesn't exist|not found|chrome/i.test(e.message) ? 'browser non installato' : undefined, errore: e.message.split('\n')[0] });
  } finally {
    await browser?.close();
  }
}

// --- Safari WebDriver (safaridriver, senza dipendenze) ----------------------------

async function provaSafariWebDriver() {
  const porta = 4444 + Math.floor(Math.random() * 1000);
  if (process.platform !== 'darwin') return registra({ client: 'Safari (WebDriver, automatico)', saltato: 'non è un Mac' });
  const proc = spawn('/usr/bin/safaridriver', ['-p', String(porta)]);
  proc.on('error', () => {});
  const wd = async (metodo, percorso, corpo) => {
    const r = await fetch(`http://127.0.0.1:${porta}${percorso}`, { method: metodo, headers: { 'content-type': 'application/json' }, body: corpo ? JSON.stringify(corpo) : undefined });
    const j = await r.json();
    if (j.value?.error) throw new Error(`${j.value.error}: ${j.value.message}`);
    return j.value;
  };
  let sessione;
  try {
    await dorme(1500);
    sessione = (await wd('POST', '/session', { capabilities: { alwaysMatch: { browserName: 'safari' } } })).sessionId;
    await wd('POST', `/session/${sessione}/url`, { url: TRACE });
    const trace = leggiTrace(await wd('POST', `/session/${sessione}/execute/sync`, { script: 'return document.body.innerText', args: [] }));
    await wd('POST', `/session/${sessione}/url`, { url: HOME });
    await dorme(3000);
    const titolo = await wd('GET', `/session/${sessione}/title`);
    const nav = await wd('POST', `/session/${sessione}/execute/sync`, { script: 'return {userAgent: navigator.userAgent, webdriver: navigator.webdriver, plugins: navigator.plugins.length, lingue: navigator.languages.join(","), windowChrome: typeof window.chrome}', args: [] });
    registra({ client: 'Safari (WebDriver, automatico)', stato: bloccata(titolo) ? 403 : 200, statoDedotto: true, bloccato: bloccata(titolo), titolo, trace, navigator: nav });
  } catch (e) {
    registra({ client: 'Safari (WebDriver, automatico)', saltato: /enable|Allow Remote Automation|session not created/i.test(e.message) ? 'safaridriver non attivo: sudo safaridriver --enable e Sviluppo → Consenti automazione remota' : undefined, errore: e.message });
  } finally {
    if (sessione) await wd('DELETE', `/session/${sessione}`).catch(() => {});
    proc.kill();
  }
}

// --- Safari normale: lo usi tu ------------------------------------------------------

async function provaSafariManuale() {
  if (process.platform !== 'darwin' || !process.stdin.isTTY) return registra({ client: 'Safari (tu, navigazione normale)', saltato: process.platform !== 'darwin' ? 'non è un Mac' : 'serve un terminale interattivo' });
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    console.log('\n■ Safari (tu): apro https://www.deejay.de/cdn-cgi/trace e poi la home in Safari.');
    await sh('open', ['-a', 'Safari', TRACE]);
    const uag = await rl.question('  Nella pagina "trace" c\'è una riga "uag=…". Incollala qui (o premi Invio): ');
    const ip = await rl.question('  E la riga "ip=…"? (Invio per saltare): ');
    await sh('open', ['-a', 'Safari', HOME]);
    const vista = (await rl.question('  Nella home vedi il negozio (s) o "Sorry, you have been blocked" (b)? [s/b] ')).trim().toLowerCase();
    registra({ client: 'Safari (tu, navigazione normale)', stato: vista === 'b' ? 403 : 200, statoDedotto: true, bloccato: vista === 'b', trace: { uag: uag.replace(/^uag=/, ''), ip: ip.replace(/^ip=/, '') } });
  } catch (e) {
    registra({ client: 'Safari (tu)', errore: e.message });
  } finally {
    rl.close();
  }
}

// --- Esecuzione ---------------------------------------------------------------------

console.log('Diagnosi accesso deejay.de — una richiesta alla home per client, 5 s di pausa tra i client.\n');
const prove = [
  provaCurl,
  provaFetch,
  () => provaPlaywright('Chromium headless (headless shell)', chromium, { headless: true }),
  () => provaPlaywright('Chromium headless (nuova modalità, browser completo)', chromium, { headless: true, channel: 'chromium' }),
  () => provaPlaywright('Chromium con finestra', chromium, { headless: false }),
  () => provaPlaywright('Google Chrome con finestra (se installato)', chromium, { headless: false, channel: 'chrome' }),
  () => provaPlaywright('WebKit headless (motore di Safari)', webkit, { headless: true }),
  () => provaPlaywright('WebKit con finestra (motore di Safari)', webkit, { headless: false }),
  provaSafariWebDriver,
  provaSafariManuale,
];
for (const [i, prova] of prove.entries()) {
  if (i) await dorme(PAUSA);
  await prova();
}

// --- Rapporto --------------------------------------------------------------------------

mkdirSync(OUT, { recursive: true });
const data = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const sistema = { macOS: (await sh('sw_vers', ['-productVersion']).catch(() => ({ stdout: '?' }))).stdout.trim(), node: process.version, quando: new Date().toISOString() };
writeFileSync(join(OUT, `deejay-${data}.json`), JSON.stringify({ sistema, risultati }, null, 2));

const eseguiti = risultati.filter((r) => !r.errore && !r.saltato);
const passano = eseguiti.filter((r) => !r.bloccato);
const bloccati = eseguiti.filter((r) => r.bloccato);
const righe = risultati.map((r) => `| ${r.client} | ${r.saltato ? 'saltato' : r.errore ? 'errore' : `${r.stato}${r.statoDedotto ? '*' : ''} ${r.bloccato ? '⛔' : '✅'}`} | ${r.trace?.uag ?? ''} | ${r.navigator?.webdriver ?? ''} | ${r.intestazioniInviate?.['sec-ch-ua'] ?? ''} |`);

// Differenze: valori che compaiono SOLO nei client bloccati o SOLO in quelli che passano
const segnali = (r) => ({
  'headless nello user-agent': /Headless/i.test(r.trace?.uag ?? r.navigator?.userAgent ?? ''),
  'non è un browser': /curl|node|undici/i.test(r.trace?.uag ?? r.client),
  'navigator.webdriver': r.navigator?.webdriver ?? null,
  'plugins = 0': r.navigator ? r.navigator.plugins === 0 : null,
  'window.chrome assente': r.navigator ? r.navigator.windowChrome === 'undefined' && /Chrom/i.test(r.navigator.userAgent) : null,
  'HTTP/3': r.trace?.http === 'http/3',
  'headless OPPURE non è un browser': /Headless/i.test(r.trace?.uag ?? r.navigator?.userAgent ?? '') || /curl|node|undici/i.test(r.trace?.uag ?? r.client),
});
const diff = Object.keys(segnali({})).map((k) => {
  const p = new Set(passano.map((r) => String(segnali(r)[k])));
  const b = new Set(bloccati.map((r) => String(segnali(r)[k])));
  // "Spiega il blocco" se tutti i bloccati hanno lo stesso valore e nessuno di quelli che passano ce l'ha
  const separa = b.size === 1 && p.size > 0 && !p.has([...b][0]);
  return `| ${k} | ${[...p].join(', ') || '—'} | ${[...b].join(', ') || '—'} | ${separa ? '**sì**' : 'no'} |`;
});

const md = `# Diagnosi deejay.de dal Mac

macOS ${sistema.macOS} · Node ${sistema.node} · ${sistema.quando}

| Client | Home | User-agent visto da Cloudflare | webdriver | sec-ch-ua inviato |
|---|---|---|---|---|
${righe.join('\n')}

\\* stato dedotto dal titolo della pagina (Safari non espone il codice HTTP)

IP visto da Cloudflare: ${[...new Set(eseguiti.map((r) => r.trace?.ip).filter(Boolean))].join(', ') || '—'} · paese: ${[...new Set(eseguiti.map((r) => r.trace?.loc).filter(Boolean))].join(', ') || '—'}

## Quali segnali separano chi passa da chi è bloccato

| Segnale | Valori in chi passa | Valori in chi è bloccato | Spiega il blocco? |
|---|---|---|---|
${diff.join('\n')}
`;
writeFileSync(join(OUT, `deejay-${data}.md`), md);
console.log(`\n${md}\nSalvati: diagnosi/risultati/deejay-${data}.json e .md`);
