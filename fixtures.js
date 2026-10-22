const base = require('@playwright/test');

const BASE_URL = 'https://eventhub.rahulshettyacademy.com';
const API_URL = 'https://api.eventhub.rahulshettyacademy.com/api';

const USER_EMAIL = 'carranza.anthony0019@gmail.com';
const USER_PASSWORD = 'Carl$anthony0019';

exports.customtest = base.test.extend({
  // Task 1: authenticatedPage fixture — Logs into EventHub via UI and yields the logged-in page
  authenticatedPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(`${BASE_URL}/login`);
    await page.locator('input[type="email"], #email').fill(USER_EMAIL);
    await page.locator('input[type="password"], #password').fill(USER_PASSWORD);
    await page.getByRole('button', { name: /sign in|login/i }).click();
    
    // Wait until login completes and redirects away from login
    await page.waitForURL(`${BASE_URL}/**`, { timeout: 15000 });

    await use(page);
    await context.close();
  },

  // Task 2: createEvent fixture — Calls POST /events via API to create an event beforehand
  createEvent: async ({ request }, use) => {
    // First, get an auth token via API login to authorize the event creation
    const loginRes = await request.post(`${API_URL}/auth/login`, {
      data: { email: USER_EMAIL, password: USER_PASSWORD }
    });
    const loginJson = await loginRes.json();
    const token = loginJson.data?.token ?? loginJson.token;

    // Generate unique dynamic event details
    const uniqueEventName = `AI Automation Summit ${Date.now()}`;
    const eventPayload = {
      title: uniqueEventName,
      category: 'Conference',
      eventDate: '2026-12-01T10:00:00.000Z',
      venue: 'HICC',
      city: 'Hyderabad',
      price: '999',
      totalSeats: 200,
      availableSeats: 150,
      description: 'Automated test event fixture'
    };

    // Call POST /events directly via API
    const eventRes = await request.post(`${API_URL}/events`, {
      headers: { Authorization: `Bearer ${token}` },
      data: eventPayload
    });

    const eventJson = await eventRes.json();
    
    // Yield the created event data (name/ID) to the test body
    await use({
      name: uniqueEventName,
      response: eventJson
    });
  }
});