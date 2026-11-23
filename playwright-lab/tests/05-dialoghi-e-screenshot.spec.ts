// LEZIONE 5 — Finestre di dialogo, screenshot e confronto visivo
import { test, expect } from '@playwright/test';

test('aprire e chiudere il dialogo', async ({ page }) => {
  await page.goto('/');
  const dialogo = page.getByRole('dialog', { name: "Sei entrato in un'altra dimensione" });

  await expect(dialogo).toBeHidden();
  await page.getByRole('button', { name: 'Apri la porta' }).click();
  await expect(dialogo).toBeVisible();

  await dialogo.getByRole('button', { name: 'Chiudi' }).click();
  await expect(dialogo).toBeHidden();
});

test('fare uno screenshot', async ({ page }, testInfo) => {
  await page.goto('/');
  // Lo screenshot finisce nel report HTML (`npm run report`).
  await testInfo.attach('pagina intera', {
    body: await page.screenshot({ fullPage: true }),
    contentType: 'image/png',
  });
});

test('confronto visivo della sezione contatore', async ({ page }) => {
  await page.goto('/');
  // La prima volta crea l'immagine di riferimento (il test fallisce e la salva:
  // rilancia con `npx playwright test --update-snapshots`).
  // Dalle volte dopo confronta pixel per pixel e fallisce se qualcosa cambia.
  await expect(page.getByRole('region', { name: 'Contatore' })).toHaveScreenshot('contatore.png');
});
