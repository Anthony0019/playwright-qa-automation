const { test, expect } = require('@playwright/test');

test('Modify Checkbox State', async ({ page }) => {
    await page.goto('http://the-internet.herokuapp.com/checkboxes');

    const checkbox1 = page.locator('input[type="checkbox"]').nth(0);

    await expect(checkbox1).not.toBeChecked();

    await checkbox1.check();

    await expect(checkbox1).toBeChecked();

    const checkbox2 = page.locator('input[type="checkbox"]').nth(1);

    await expect(checkbox2).toBeChecked();

    await checkbox2.uncheck();

    await expect(checkbox2).not.toBeChecked();
});