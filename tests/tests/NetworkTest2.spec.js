const { test, expect } = require('@playwright/test');


test('Security test request intercept', async ({ page }) => {
    const email = "carranza.anthony0019@gmail.com";
    const productName = 'zara coat 3';
    const products = page.locator(".card-body");
    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator("#userEmail").fill(email);
    await page.locator("#userPassword").fill("Carlanthony0019");
    await page.locator("[value='Login']").click();
    await page.waitForLoadState('networkidle');
    await page.locator(".card-body b").first().waitFor();

    await page.locator('button[routerlink*="myorders"]').click();
    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*",
        route => route.continue({ url: 'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=* ' }))
    await page.locator("button:has-text('View')").first().click();
    await expect (page.locator('p').last()).toHaveText('You are not authorize to view this order');

});