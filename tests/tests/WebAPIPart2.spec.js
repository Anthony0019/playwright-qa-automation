
const { test, expect } = require('@playwright/test');

let webContext;

test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://rahulshettyacademy.com/client');
    await page.locator('#userEmail').fill('carranza.anthony0019@gmail.com');
    await page.locator('#userPassword').fill('Carlanthony0019');
    await page.locator("[value='Login']").click();
    
    await page.waitForLoadState('networkidle');

    await context.storageState({ path: 'state.json' });

    webContext = await browser.newContext({
        storageState: 'state.json'
    });

    await context.close();
});

test('Client App login', async () => {
    const email = 'carranza.anthony0019@gmail.com';
    const productName = 'zara coat 3';
    const page = await webContext.newPage();

    await page.goto('https://rahulshettyacademy.com/client');

    const products = page.locator('.card-body');
    const titles = await page.locator('.card-body b').allTextContents();
    console.log(titles);

    const Count = await products.count();

    for (let i = 0; i < Count; ++i) {
        if (
            (await products.nth(i).locator('b').textContent())
                .toLowerCase() === productName.toLowerCase()
        ) {
            await products.nth(i)
                .getByRole('button', { name: 'Add To Cart' })
                .click();
            break;
        }
    }

    await page.locator('[routerlink*= cart]').click();
    await page.locator('div li').first().waitFor();

    const bool = await page.locator("h3:has-text('zara coat 3')").isVisible();
    expect(bool).toBeTruthy();

    await page.locator('text=Checkout').click();

    await page.locator("[placeholder*='Country']")
        .pressSequentially('phi', { delay: 100 });

    const dropdown = page.locator('.ta-results');
    await dropdown.waitFor();

    const optionsCount = await dropdown.locator('button').count();

    for (let i = 0; i < optionsCount; ++i) {
        const text = await dropdown.locator('button').nth(i).textContent();

        if (text.trim() === 'Philippines') {
            await dropdown.locator('button').nth(i).click();
            break;
        }
    }

    await expect(page.locator('.ta-backdrop')).toBeHidden();

    // FIX: Expect the actual logged-in email, not an empty string.
    await expect(page.locator("input[type='text']").last())
        .toHaveValue(email);

    console.log('Page URL:', page.url());
    console.log(
        'Place Order count:',
        await page.locator('.action__submit').count()
    );

    await page.locator('.action__submit').click();

    await expect(page.locator('.hero-primary'))
        .toHaveText('Thankyou for the order.');

    const orderIds = await page.locator(
        '.em-spacer-1 .ng-star-inserted'
    ).textContent();

    console.log(orderIds);

    await page.locator('button[routerlink*= myorders]').click();
    await page.locator('tbody').waitFor();

    const rows = page.locator('tbody tr');

    for (let i = 0; i < await rows.count(); ++i) {
        const rowOrderId = await rows.nth(i).locator('th').textContent();

        if (orderIds.includes(rowOrderId)) {
            await rows.nth(i).locator('button').first().click();
            break;
        }
    }

    const orderIdDetails = await page.locator('.col-text').textContent();
    expect(orderIds.includes(orderIdDetails)).toBeTruthy();
});

test('Test case 2', async () => {
    const email = '';
    const productName = 'zara coat 3';
    const page = await webContext.newPage();

    await page.goto('https://rahulshettyacademy.com/client');

    const products = page.locator('.card-body');
    const titles = await page.locator('.card-body b').allTextContents();
    console.log(titles);
});
