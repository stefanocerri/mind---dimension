// LEZIONE 3 — Compilare i form
import { test, expect } from '@playwright/test';

test.describe('form di accesso', () => {
  // describe raggruppa test che parlano della stessa cosa.
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // Nella pagina ci sono DUE elementi con ruolo "status" (anche l'<output> del contatore).
  // Playwright è "strict": se un locator trova più elementi si ferma con un errore.
  // Soluzione: cercare lo status solo dentro la sezione Accesso.
  const esito = (page: import('@playwright/test').Page) =>
    page.getByRole('region', { name: 'Accesso' }).getByRole('status');

  test('accesso riuscito', async ({ page }) => {
    await page.getByLabel('Email').fill('stefano@esempio.it');
    await page.getByLabel('Password').fill('segreto123');
    await page.getByLabel('Ricordami').check();
    await page.getByRole('button', { name: 'Entra' }).click();

    await expect(esito(page)).toHaveText('Benvenuto, stefano@esempio.it! Ti ricorderemo.');
  });

  test('password troppo corta', async ({ page }) => {
    await page.getByLabel('Email').fill('stefano@esempio.it');
    await page.getByLabel('Password').fill('123');
    // Si può anche premere un tasto invece di cliccare.
    await page.getByLabel('Password').press('Enter');

    await expect(esito(page)).toHaveText(/almeno 6 caratteri/);
    await expect(esito(page)).toHaveClass('errore');
  });
});

test.describe('lista delle cose da fare', () => {
  test('aggiungere, completare ed eliminare', async ({ page }) => {
    await page.goto('/');
    const nuova = page.getByLabel('Nuova cosa');
    const lista = page.getByRole('list', { name: 'Lista delle cose da fare' });

    for (const voce of ['Comprare il latte', 'Studiare Playwright', 'Dormire']) {
      await nuova.fill(voce);
      await nuova.press('Enter');
    }
    await expect(lista.getByRole('listitem')).toHaveCount(3);
    await expect(page.getByTestId('riepilogo')).toHaveText('0 di 3 completate');

    await page.getByRole('checkbox', { name: 'Completa Studiare Playwright' }).check();
    await expect(page.getByTestId('riepilogo')).toHaveText('1 di 3 completate');

    // filter() sceglie un elemento della lista in base al suo testo.
    await lista.getByRole('listitem').filter({ hasText: 'Dormire' })
      .getByRole('button', { name: 'Elimina' }).click();
    await expect(lista.getByRole('listitem')).toHaveText([/Comprare il latte/, /Studiare Playwright/]);
  });
});

// ESERCIZIO: scrivi un test per "Email non valida" (email senza @).
