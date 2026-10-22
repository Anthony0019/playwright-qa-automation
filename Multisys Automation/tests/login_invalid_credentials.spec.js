const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');

test('Invalid Username and Password', async ({ page }) => {

    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await loginPage.login(
        'wronguser',
        'wrongpassword'
    );

    await expect(loginPage.flashMessage)
        .toContainText('Your username is invalid!');
});