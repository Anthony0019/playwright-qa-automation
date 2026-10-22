const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://eventhub.rahulshettyacademy.com';
const API_URL = 'https://api.eventhub.rahulshettyacademy.com/api';

const YAHOO_USER = {
  name: 'Test User One',
  email: 'carranza.yahoo.test0019@yahoo.com',
  password: 'Carl$anthony0019'
};

const GMAIL_USER = {
  email: 'carranza.anthony0019@gmail.com',
  password: 'Carl$anthony0019'
};

// Reusable UI login helper.
async function loginAs(page, user) {
  await page.goto(BASE_URL);

  const signInHeading = page.getByRole('heading', {
    name: /sign in to eventhub/i
  });

  await expect(signInHeading).toBeVisible();

  await page.getByRole('textbox', { name: 'Email' }).fill(user.email);
  await page.getByRole('textbox', { name: 'Password' }).fill(user.password);
  await page.getByRole('button', { name: /sign in/i }).click();

  // Confirm that the login screen disappears.
  await expect(signInHeading).toBeHidden({ timeout: 10000 });
}

test('Gmail user cannot access Yahoo user booking', async ({ request, page }) => {
  // PRE-STEP: Auto-register Yahoo user so login never returns a 400 error
  await request.post(`${API_URL}/auth/register`, {
    data: {
      name: YAHOO_USER.name,
      email: YAHOO_USER.email,
      password: YAHOO_USER.password
    }
  });

  // STEP 1: Login as Yahoo user through the API.
  const loginRes = await request.post(`${API_URL}/auth/login`, {
    data: {
      email: YAHOO_USER.email,
      password: YAHOO_USER.password
    }
  });

  const responseText = await loginRes.text();
  console.log('Login status:', loginRes.status());

  expect(
    loginRes.ok(),
    `Login failed: HTTP ${loginRes.status()}\n${responseText}`
  ).toBeTruthy();

  const loginBody = JSON.parse(responseText);
  const token = loginBody.data?.token ?? loginBody.token;

  expect(token, 'Login response should contain a token').toBeTruthy();

  const authHeaders = {
    Authorization: `Bearer ${token}`
  };

  // STEP 2: Fetch events and extract a valid event ID.
  const eventsRes = await request.get(`${API_URL}/events`, {
    headers: authHeaders
  });

  expect(eventsRes.ok()).toBeTruthy();

  const eventsBody = await eventsRes.json();
  expect(eventsBody.data, 'Events response should contain an array').toBeInstanceOf(Array);
  expect(eventsBody.data.length).toBeGreaterThan(0);

  const eventId = eventsBody.data[0].id;
  expect(eventId).toBeTruthy();
  console.log('Event ID:', eventId);

  // STEP 3: Create a booking as Yahoo user through the API.
  const bookingRes = await request.post(`${API_URL}/bookings`, {
    headers: authHeaders,
    data: {
      eventId: eventId,
      customerName: 'Yahoo User',
      customerEmail: YAHOO_USER.email,
      customerPhone: '9876543210',
      quantity: 1
    }
  });

  expect(bookingRes.ok()).toBeTruthy();

  const bookingBody = await bookingRes.json();
  const yahooBookingId = bookingBody.data?.id ?? bookingBody.id;

  expect(yahooBookingId, 'Booking response should contain data.id').toBeTruthy();
  console.log('Yahoo booking ID:', yahooBookingId);

  // STEP 4: Confirm the accounts are different.
  expect(YAHOO_USER.email).not.toBe(GMAIL_USER.email);

  // STEP 5: Log in as Gmail user through the browser UI.
  await loginAs(page, GMAIL_USER);

  // STEP 6: Open Yahoo's booking as Gmail.
  await page.goto(`${BASE_URL}/bookings/${yahooBookingId}`);

  console.log('Logged-in user:', GMAIL_USER.email);
  console.log('Yahoo booking ID:', yahooBookingId);
  
// STEP 7: Verify access is denied and print the message to the terminal.
  const accessDeniedHeading = page.getByText('Access Denied', { exact: true });
  await expect(accessDeniedHeading).toBeVisible();

  const unauthorizedLocator = page.getByText(/not authorized/i);
  await expect(unauthorizedLocator).toBeVisible();

  const deniedMessage = await unauthorizedLocator.textContent();
  console.log('TERMINAL ALERT -> Access Denied Message:', deniedMessage);
}); // <-- This closing brace and parenthesis correctly close the test function!