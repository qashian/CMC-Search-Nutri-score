// pages/LoginPage.ts
import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('#input-login-username');
    this.passwordInput = page.locator('#PW');
    this.loginButton = page.getByRole('button', { name: 'LOGIN' });
  }

  async goto() {
    // Go to the Sign-in page, never use HOME URL here
    await this.page.goto('https://app2025.calcmenu.com/Welcome/Signin');
  }

  async login() {
    // Use environment variables directly
    await this.emailInput.fill(process.env.SODEXOLU_EMAIL!);
    await this.passwordInput.fill(process.env.SODEXOLU_PASSWORD!);

    await expect(this.loginButton).toBeEnabled();
    await this.loginButton.click();

    // Validate successful login by checking destination URL
    await expect(this.page).toHaveURL(process.env.SODEXOLU_HOME_URL!);
  }
}
