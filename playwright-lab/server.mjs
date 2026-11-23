// Server statico minimo (senza dipendenze) che serve la cartella ./sito.
// Playwright lo avvia da solo prima dei test (vedi `webServer` in playwright.config.ts).
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const PORT = Number(process.env.PORT ?? 4173);
const ROOT = join(import.meta.dirname, 'sito');
const TIPI = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json' };

// Una finta API: i test la usano per imparare ad aspettare e a intercettare la rete.
const FRASI = [
  { id: 1, testo: 'La mente è come un paracadute: funziona solo se si apre.' },
  { id: 2, testo: 'Ogni dimensione ha la sua porta.' },
  { id: 3, testo: 'Il silenzio è un suono anche lui.' },
];

createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/api/frasi') {
    // Ritardo apposta: Playwright deve aspettare senza che tu scriva "sleep".
    setTimeout(() => {
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify(FRASI));
    }, 800);
    return;
  }

  const percorso = url.pathname === '/' ? '/index.html' : url.pathname;
  const file = normalize(join(ROOT, percorso));
  if (!file.startsWith(ROOT)) {
    res.writeHead(403).end();
    return;
  }
  try {
    const contenuto = await readFile(file);
    res.writeHead(200, { 'content-type': TIPI[extname(file)] ?? 'application/octet-stream' });
    res.end(contenuto);
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain' }).end('Pagina non trovata');
  }
}).listen(PORT, () => console.log(`Sito di prova su http://localhost:${PORT}`));
