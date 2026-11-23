import { defineConfig, devices } from '@playwright/test';

// Documentazione completa: https://playwright.dev/docs/test-configuration
export default defineConfig({
  testDir: './tests',
  // Ogni file di test gira in parallelo con gli altri.
  fullyParallel: true,
  // In CI riprova due volte un test fallito; in locale no, così vedi subito l'errore.
  retries: process.env.CI ? 2 : 0,
  // "list" stampa i risultati nel terminale, "html" crea un report navigabile.
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    // Così nei test puoi scrivere page.goto('/') invece dell'indirizzo completo.
    baseURL: 'http://localhost:4173',
    // Registra una "trace" solo quando un test fallisce e viene riprovato:
    // poi la apri con `npx playwright show-trace` e rivedi ogni passo.
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  // Su quali browser far girare i test. Puoi aggiungere firefox e webkit
  // (dopo `npx playwright install firefox webkit`).
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'telefono', use: { ...devices['Pixel 7'] } },
  ],

  // Playwright avvia il sito di prova prima dei test e lo spegne alla fine.
  webServer: {
    command: 'node server.mjs',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
  },
});
