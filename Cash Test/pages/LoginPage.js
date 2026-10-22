const { expect } = require('@playwright/test');

class LoginPage {
  constructor(window) {
    this.window = window;
    this.dashboardHeader = window.getByText('Commercial Application for Sales Handling');
    this.emailInput = window.getByPlaceholder('Email');
    this.passwordInput = window.getByPlaceholder('Password');
    this.loginButton = window.getByRole('button', { name: 'Log in' });
  }

  async handleLogin(email, password) {
    const isLoggedIn = await this.dashboardHeader.isVisible({ timeout: 1500 }).catch(() => false);

    if (!isLoggedIn) {
      await expect(this.emailInput).toBeEnabled({ timeout: 5000 });
      await this.emailInput.fill(email);
      await this.passwordInput.fill(password);
      await this.loginButton.click();
    }
    await expect(this.dashboardHeader).toBeVisible({ timeout: 10000 });
  }
}

module.exports = { LoginPage };