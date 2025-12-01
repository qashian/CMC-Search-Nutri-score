// pages/NutriScorePage.ts
import { Page, Locator, expect } from '@playwright/test';

export class NutriScorePage {
  readonly page: Page;
  readonly productModuleLink: Locator;
  readonly advancedFilterButton: Locator;
  readonly addSearchCriteriaButton: Locator;
  readonly nutriScoreOption: Locator;
  readonly saveCriteriaButton: Locator;
  readonly searchButton: Locator;
  readonly productRows: Locator;
  readonly nutriScoreSectionTitle: Locator;
  readonly closeButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Adjust these locators if needed based on your actual UI
    this.productModuleLink = page.getByText('Product Module', { exact: false });
    // Alternative if needed:
    // this.productModuleLink = page.locator('img[src*="active_product.svg"]');

    this.advancedFilterButton = page.getByText('Advanced Filter', { exact: false });
    this.addSearchCriteriaButton = page.getByText('Add Search Criteria', { exact: false });
    this.nutriScoreOption = page.getByText('Nutri-Score', { exact: false });

    // Buttons: prefer role selectors for stability
    this.saveCriteriaButton = page.getByRole('button', { name: 'Save' });
    this.searchButton = page.getByRole('button', { name: 'Search' });

    // Product rows: based on the classes you shared
    // flex-grow-1 d-flex flex-column bg-white rounded shadow w-100 rounded-top-0 px-3 ng-star-inserted
    this.productRows = page.locator('div.flex-grow-1.d-flex.flex-column.bg-white.shadow');

    this.nutriScoreSectionTitle = page.getByText('Nutri-Score', { exact: false });

    // Close button for the Advanced Filter dialog
    this.closeButton = page.locator('img[alt="close"]');
  }

  async openProductModule() {
    await this.productModuleLink.click();
    // Example: https://app2025.calcmenu.com/Home/Product
    await expect(this.page).toHaveURL(/.*Product/);
  }

  async openAdvancedFilter() {
    await this.advancedFilterButton.click();
  }

  async addNutriScoreCriteria() {
    await this.addSearchCriteriaButton.click();
    await this.nutriScoreOption.click();

    // Based on your note: if no changes or Save is disabled, just close
    await this.closeButton.click();
  }

  async saveCriteria() {
    // If there are changes and Save should be enabled, assert it first
    await expect(this.saveCriteriaButton).toBeEnabled();
    await this.saveCriteriaButton.click();
  }

  async expectNoNutriScore() {
  await expect(this.page.locator('img[src*="nutriscore_"]')).toHaveCount(0);
}

async expectNutriScoreIn(letters: string[]) {
  const selectors = letters.map(
    (letter) => `img[src*="nutriscore_${letter.toLowerCase()}"]`
  );
  const locator = this.page.locator(selectors.join(', '));
  await expect(locator.first()).toBeVisible();
}


  async search() {
    await this.searchButton.click();
    // Wait for at least one visible product row
    await this.productRows.first().waitFor({ state: 'visible' });
  }

  async openFirstProductFromResults() {
    const firstRow = this.productRows.first();

    // Ensure first result is visible
    await expect(firstRow).toBeVisible();

    // Capture current URL
    const previousUrl = this.page.url();

    // Click the first product
    await firstRow.click();

    // Wait for page to settle (navigation/product detail load)
    await this.page.waitForLoadState('networkidle');

    // Assert that we navigated away from the list page
    await expect(this.page).not.toHaveURL(previousUrl);

    // Optional: if you know a stable selector or URL pattern for the product details page,
    // uncomment and adjust one of these:

    // 1) URL pattern
    // await expect(this.page).toHaveURL(/.*Product\/\d+|.*ProductDetails/);

    // 2) A detail-only element (e.g., product title or Nutri-Score section)
    // await expect(this.nutriScoreSectionTitle).toBeVisible();
  }

  async scrollToNutriScoreSection() {
    await this.nutriScoreSectionTitle.scrollIntoViewIfNeeded();
  }

  async expectNutriScoreLetterImage(letter: string) {
    // Example src: assets/Images/generic/Icons/nutriscore/nutriscore_a.png
    const nutriSelector = `img[src*="nutriscore_${letter.toLowerCase()}"]`;
    await expect(this.page.locator(nutriSelector)).toBeVisible();
  }
}
