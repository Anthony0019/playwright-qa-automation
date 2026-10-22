
const { test, expect } = require('@playwright/test');
const { request } = require('node:http');

test.only('Browser Context Playwright Test', async ({ browser, }) => {

    const context = await browser.newContext();
    const page = await context.newPage();
    //page.route('**/*.{jpg,png,jpeg}',route=> route.abort());
    const userName = page.locator('#username');
    const signIn = page.locator('#signInBtn');
    const cardTitles = page.locator('.card-body a');
    page.on('request', request => {
        console.log('Request:', request.url());
    });

    page.on('response', response => {
        console.log('Response URL:', response.url());
        console.log('Status:', response.status());
    });
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





})



test('Client Login Test', async ({ page }) => {

    const userName = page.locator('#userEmail');
    const signIn = page.locator('#login');

    await page.goto('https://rahulshettyacademy.com/client/#/auth/login');

    console.log(await page.title());

    // Enter credentials
    await userName.fill('carranza.anthony0019@gmail.com');
    await page.locator("[type='password']").fill('Carlanthony0019');

    // Login
    await signIn.click();

    console.log(await page.locator(".toast-container").textContent());

    // Wait for product page
    await page.locator(".card-img-top").first().waitFor();

    // Click/View product


    console.log(await page.locator(".card-img-top").allTextContents());

    // Add to cart
    const adidas = page.locator(".card").filter({
        hasText: "ADIDAS ORIGINAL"
    });

    const zara = page.locator(".card").filter({
        hasText: "ZARA COAT 3"
    });

    const iphone = page.locator(".card").filter({
        hasText: "iphone 13 pro"
    });

    await adidas.getByRole("button", { name: "Add To Cart" }).click();
    await zara.getByRole("button", { name: "Add To Cart" }).click();
    await iphone.getByRole("button", { name: "Add To Cart" }).click();
    // Verify confirmation
    await expect(page.getByText('Added To Cart'))
        .toBeVisible();


    //await page.locator(".card-img-top").first().waitFor();
    //click.button = await page.locator("btn w-40 rounded").first();

    //console.log(await page.locator(".card-img-top").allTextContents()); //for all elements command
    //console.log(await page.locator(".card-body a").nth(0).textContent());
    //console.log(await page.locator(".card-body a").nth(2).textContent());
});



test('UI Controls', async ({ page }) => {


    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");

    const signIn = page.locator('#signInBtn');
    const documentLink = page.locator("[href*='documents-request']");
    const dropdown = page.locator("select.form-control");
    await dropdown.selectOption('consult');
    await page.locator(".radiotextsty").last().click();
    await page.locator("#okayBtn").click();
    console.log(await page.locator(".radiotextsty").last().isChecked());
    await expect(page.locator(".radiotextsty").last()).toBeChecked();
    await page.locator("#terms").click();
    await expect(page.locator("#terms")).toBeChecked();
    await page.locator("#terms").uncheck();
    expect(await page.locator("#terms").isChecked()).toBeFalsy();
    await expect(documentLink).toHaveAttribute("class", "blinkingText");




});



test('Childs windows handl', async ({ browser }) => {

    const context = await browser.newContext();
    const page = await context.newPage();
    const userName = page.locator('#username');
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    const documentLink = page.locator("[href*='documents-request']");

    const [newPage] = await Promise.all(
        [
            context.waitForEvent('page'), //listen for new page event pending,reject,fulfilled
            documentLink.click(),
        ])

    const text = await newPage.locator(".red").textContent();
    const arraytext = text.split("@");
    const domain = arraytext[1].split(" ")[0];
    console.log(domain);
    await page.locator("#username").fill(domain);

    console.log(await page.locator("#username").inputValue());

});