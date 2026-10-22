const { test, expect } = require('@playwright/test');

test('Save login session', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://rahulshettyacademy.com/client');

    await page.locator('#userEmail').fill('carranza.anthony0019@gmail.com');
    await page.locator('#userPassword').fill('Carlanthony0019');
    await page.locator("[value='Login']").click();

    // Confirm login succeeded before saving the session
    await expect(
        page.locator('[routerlink*="myorders"]')
    ).toBeVisible();

    await context.storageState({ path: 'state.json' });

    await context.close();
});