
const { test, expect } = require('@playwright/test');

test('Browser Context Playwright Test', async ({ browser, }) => {

    const context = await browser.newContext();
    const page = await context.newPage();
    const userName = page.locator('#username');
    const signIn = page.locator('#signInBtn');
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    console.log(await page.title());
    //css       type, fill
    await userName.fill('rahulshetty');
    await page.locator("[type='password']").fill('Learning@830$3mK2');
    await signIn.click();
    //wait until this locator shown up page
    //webdriverwait
    await expect(page.locator(".alert-danger")).toContainText('Incorrect');
    console.log(await page.locator(".alert-danger").textContent());

    //type //fill
    await userName.fill("");
    await userName.fill("rahulshettyacademy");
    await signIn.click();

    await page.locator(".card-body a").first().waitFor();
    console.log(await page.locator(".card-body a").allTextContents()); //for all elements command
    //console.log(await page.locator(".card-body a").nth(0).textContent());
    //console.log(await page.locator(".card-body a").nth(2).textContent());





});

test('Page Playwright Test', async ({ page }) => {

    await page.goto('https://google.com/');

    // Get title - assertion
    console.log(await page.title());
    await expect(page).toHaveTitle('Google');
});
