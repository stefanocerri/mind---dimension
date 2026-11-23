// LEZIONE 1 — La struttura di un test
//
// Ogni test riceve `page`: una scheda del browser nuova e pulita.
// Lo schema è sempre lo stesso: vai alla pagina → fai qualcosa → controlla il risultato.
import { test, expect } from '@playwright/test';

test('la pagina si apre e ha il titolo giusto', async ({ page }) => {
  // '/' viene unito al baseURL scritto in playwright.config.ts
  await page.goto('/');

  // expect(...) con "await" RIPROVA da solo per qualche secondo finché è vero:
  // per questo in Playwright quasi non servono attese manuali.
  await expect(page).toHaveTitle(/Mind Dimension/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Mind Dimension');
});

test('il contatore aumenta e si azzera', async ({ page }) => {
  await page.goto('/');

  const conteggio = page.getByTestId('conteggio');
  const aggiungi = page.getByRole('button', { name: 'Aggiungi uno' });

  await expect(conteggio).toHaveText('0');

  await aggiungi.click();
  await aggiungi.click();
  await aggiungi.click();
  await expect(conteggio).toHaveText('3');

  await page.getByRole('button', { name: 'Azzera' }).click();
  await expect(conteggio).toHaveText('0');
});

// ESERCIZIO: scrivi un test che clicca "Aggiungi uno" 10 volte con un ciclo for
// e controlla che il contatore dica 10.
