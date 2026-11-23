// LEZIONE 2 — Come trovare gli elementi (i "locator")
//
// Ordine di preferenza consigliato da Playwright:
//   1. getByRole      → come lo vede un utente o un lettore di schermo (il migliore)
//   2. getByLabel     → per i campi dei form
//   3. getByText / getByPlaceholder
//   4. getByTestId    → quando non c'è niente di meglio (attributo data-testid)
//   5. page.locator('css') → ultima spiaggia, si rompe facilmente
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // beforeEach gira prima di ogni test di questo file.
  await page.goto('/');
});

test('trovare per ruolo e nome', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Contatore' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Entra' })).toBeEnabled();
});

test('trovare per etichetta e segnaposto', async ({ page }) => {
  await expect(page.getByLabel('Email')).toBeEmpty();
  await expect(page.getByPlaceholder('Scrivi e premi Invio')).toBeVisible();
});

test('restringere la ricerca dentro una sezione', async ({ page }) => {
  // Ci sono più bottoni nella pagina: prima prendi la sezione, poi cerchi dentro.
  const sezione = page.getByRole('region', { name: 'Dialogo' });
  await expect(sezione.getByRole('button')).toHaveText('Apri la porta');
});

test('locator CSS, quando proprio serve', async ({ page }) => {
  await expect(page.locator('section')).toHaveCount(5);
  await expect(page.locator('#conteggio')).toHaveText('0');
});

// SUGGERIMENTO: lancia `npm run codegen`, clicca sulla pagina e guarda
// quali locator scrive Playwright per te.
