// LEZIONE 4 — Dati che arrivano in ritardo e controllo della rete
import { test, expect } from '@playwright/test';

test('aspettare i dati veri, senza sleep', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Carica frasi' }).click();

  // La API risponde dopo 800 ms: expect riprova finché le frasi compaiono.
  // MAI usare page.waitForTimeout() per "dare tempo": rende i test lenti e fragili.
  await expect(page.getByText('Caricamento…')).toBeHidden();
  await expect(page.getByRole('list', { name: 'Frasi' }).getByRole('listitem')).toHaveCount(3);
});

test('controllare la richiesta fatta dalla pagina', async ({ page }) => {
  await page.goto('/');

  // Si prepara l'attesa PRIMA del click, poi si clicca, poi si legge la risposta.
  const rispostaPromessa = page.waitForResponse('**/api/frasi');
  await page.getByRole('button', { name: 'Carica frasi' }).click();
  const risposta = await rispostaPromessa;

  expect(risposta.status()).toBe(200);
  expect(await risposta.json()).toHaveLength(3);
});

test('finta API: decido io cosa risponde il server', async ({ page }) => {
  // page.route intercetta le richieste: utile per provare casi difficili da ottenere davvero.
  await page.route('**/api/frasi', (route) =>
    route.fulfill({ json: [{ id: 99, testo: 'Frase inventata dal test' }] }),
  );
  await page.goto('/');
  await page.getByRole('button', { name: 'Carica frasi' }).click();

  await expect(page.getByRole('list', { name: 'Frasi' })).toHaveText('Frase inventata dal test');
});

test('finta API: il server è rotto', async ({ page }) => {
  await page.route('**/api/frasi', (route) => route.fulfill({ status: 500 }));
  await page.goto('/');
  await page.getByRole('button', { name: 'Carica frasi' }).click();

  await expect(page.getByText('Impossibile caricare le frasi')).toBeVisible();
});

test('chiamare una API direttamente, senza browser', async ({ request }) => {
  // La fixture `request` fa chiamate HTTP: comoda per testare un backend.
  const risposta = await request.get('/api/frasi');
  expect(risposta.ok()).toBeTruthy();
  expect(await risposta.json()).toContainEqual(expect.objectContaining({ id: 2 }));
});
