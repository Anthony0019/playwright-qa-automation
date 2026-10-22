const { test, expect } = require('@playwright/test');

test.only('Client Login Test', async ({ page }) => {


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

});
