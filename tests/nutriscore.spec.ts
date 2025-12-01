// tests/nutriscore.spec.ts
import { test, expect, Page } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

import { LoginPage } from '../pages/LoginPage';
import { NutriScorePage } from '../pages/NutriScorePage';

dotenv.config();

test.describe('Nutri-Score Scenarios', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login();

    await expect(page).toHaveURL(process.env.SODEXOLU_HOME_URL!);
  });

  // Helper to execute one scenario
  const runNutriScoreTest = async (
    page: Page,
    option: 'None' | 'A' | 'B' | 'C' | 'D' | 'E',
    allowedLetters: string[]
  ) => {
    const nutriScorePage = new NutriScorePage(page);

    await nutriScorePage.openProductModule();
    await nutriScorePage.openAdvancedFilter();
    await nutriScorePage.addNutriScoreCriteria();
    await nutriScorePage.saveCriteria();
    await nutriScorePage.selectNutriScore(option);
    await nutriScorePage.search();
    await nutriScorePage.openFirstProductFromResults();
    await nutriScorePage.scrollToNutriScoreSection();

    if (option === 'None') {
      await nutriScorePage.expectNoNutriScore();
    } else {
      await nutriScorePage.expectNutriScoreIn(allowedLetters);
    }
  };

  // // Optional feature flag – remove if you always want to run them
  // test.skip(
  //   process.env.NUTRISCORE_ENABLED !== 'user',
  //   'Nutri-Score is disabled via env'
  // );

  test('Nutri-Score = None', async ({ page }) => {
    await runNutriScoreTest(page, 'None', []);
  });

  test('Nutri-Score At least A', async ({ page }) => {
    await runNutriScoreTest(page, 'A', ['A']);
  });

  test('Nutri-Score At least B', async ({ page }) => {
    await runNutriScoreTest(page, 'B', ['A', 'B']);
  });

  test('Nutri-Score At least C', async ({ page }) => {
    await runNutriScoreTest(page, 'C', ['A', 'B', 'C']);
  });

  test('Nutri-Score At least D', async ({ page }) => {
    await runNutriScoreTest(page, 'D', ['A', 'B', 'C', 'D']);
  });

  test('Nutri-Score At least E', async ({ page }) => {
    await runNutriScoreTest(page, 'E', ['A', 'B', 'C', 'D', 'E']);
  });
});
