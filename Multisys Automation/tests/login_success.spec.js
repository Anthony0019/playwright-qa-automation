const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');

test('Successful Login and Logout', async ({ page }) => {

    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await loginPage.login('tomsmith', 'SuperSecretPassword!');

    await expect(loginPage.flashMessage)
        .toContainText('You logged into a secure area!');

    await loginPage.logout();

    await expect(loginPage.flashMessage)
        .toContainText('You logged out of the secure area!');
});