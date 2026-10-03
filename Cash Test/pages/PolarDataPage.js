const { expect } = require('@playwright/test');

class PolarDataPage {
  constructor(window) {
    this.window = window;
    this.polarDataNav = window.getByText('Polar Data', { exact: true }).first();
    this.dateInput = window.locator('input[value*="-"]').first();
    this.refreshButton = window.getByRole('button', { name: 'Refresh' }).first();
    this.reimportButton = window.getByRole('button', { name: 'Re-Import' }).first();
  }

  async navigateTo() {
    await this.polarDataNav.click({ force: true });
  }

  async filterByDate(dateString) {
    await this.dateInput.click();
    await this.window.keyboard.press('Control+A');
    await this.window.keyboard.press('Backspace');
    await this.window.keyboard.type(dateString, { delay: 0 });
    await this.window.keyboard.press('Enter');
    await this.window.keyboard.press('Tab');
  }

  async triggerReimportAndRefresh() {
    await this.refreshButton.click();
    await expect(this.reimportButton).toBeEnabled({ timeout: 5000 });
    await this.reimportButton.click();
    await this.refreshButton.click();
  }
}

module.exports = { PolarDataPage };