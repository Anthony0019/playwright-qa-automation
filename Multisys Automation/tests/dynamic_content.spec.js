const { test, expect } = require('@playwright/test');

test('Dynamic Content Changes After Refresh', async ({ page }) => {

    await page.goto('http://the-internet.herokuapp.com/dynamic_content');

    const contentBefore = await page.locator('.large-10.columns').allTextContents();

    await page.reload();

    const contentAfter = await page.locator('.large-10.columns').allTextContents();

    await expect(contentAfter).not.toEqual(contentBefore);

});