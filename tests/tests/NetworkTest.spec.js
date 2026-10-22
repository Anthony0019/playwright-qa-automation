
const { test, expect, request } = require('@playwright/test');
const { APIUtils } = require('../utils/APIUtils');

const loginPayLoad = {
    userEmail: 'carranza.anthony0019@gmail.com',
    userPassword: 'Carlanthony0019'
};

const orderPayLoad = {
    orders: [{
        country: 'Philippines',
        productOrderedId: '67a8dde5c0d3e6622a297cc8'
    }]
};

const fakePayLoadOrders = {
    data: [],
    message: 'No Orders'
};

let response;

test.beforeAll(async () => {
    const apiContext = await request.newContext();
    const apiUtils = new APIUtils(apiContext, loginPayLoad);

    response = await apiUtils.createOrder(orderPayLoad);

    await apiContext.dispose();
});

test('@SP Place the order', async ({ page }) => {

    await page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, response.token);

    await page.goto('https://rahulshettyacademy.com/client');

    await page.route(
        '**/api/ecom/order/get-orders-for-customer/**',
        async route => {
            const apiResponse = await route.fetch();

            await route.fulfill({
                response: apiResponse,
                body: JSON.stringify(fakePayLoadOrders)
            });
        }
    );

    const responsePromise = page.waitForResponse(res =>
        res.url().includes(
            '/api/ecom/order/get-orders-for-customer/'
        )
    );

    await page.locator("button[routerlink*='myorders']").click();

    await responsePromise;

    console.log(await page.locator('.mt-4').textContent());
});
