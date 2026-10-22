const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://eventhub.rahulshettyacademy.com';

const USER_EMAIL = 'carranza.anthony0019@gmail.com';
const USER_PASSWORD = 'Carl$anthony0019';

// Mock response with 6 events.
const SIX_EVENTS_RESPONSE = {
  data: [
    {
      id: 1,
      title: 'Tech Summit 2025',
      category: 'Conference',
      eventDate: '2025-06-01T10:00:00.000Z',
      venue: 'HICC',
      city: 'Hyderabad',
      price: '999',
      totalSeats: 200,
      availableSeats: 150,
      imageUrl: null,
      isStatic: false
    },
    {
      id: 2,
      title: 'Rock Night Live',
      category: 'Concert',
      eventDate: '2025-06-05T18:00:00.000Z',
      venue: 'Palace Grounds',
      city: 'Bangalore',
      price: '1500',
      totalSeats: 500,
      availableSeats: 300,
      imageUrl: null,
      isStatic: false
    },
    {
      id: 3,
      title: 'IPL Finals',
      category: 'Sports',
      eventDate: '2025-06-10T19:30:00.000Z',
      venue: 'Chinnaswamy',
      city: 'Bangalore',
      price: '2000',
      totalSeats: 800,
      availableSeats: 50,
      imageUrl: null,
      isStatic: false
    },
    {
      id: 4,
      title: 'UX Design Workshop',
      category: 'Workshop',
      eventDate: '2025-06-15T09:00:00.000Z',
      venue: 'WeWork',
      city: 'Mumbai',
      price: '500',
      totalSeats: 50,
      availableSeats: 20,
      imageUrl: null,
      isStatic: false
    },
    {
      id: 5,
      title: 'Lollapalooza India',
      category: 'Festival',
      eventDate: '2025-06-20T12:00:00.000Z',
      venue: 'Mahalaxmi Racecourse',
      city: 'Mumbai',
      price: '3000',
      totalSeats: 5000,
      availableSeats: 2000,
      imageUrl: null,
      isStatic: false
    },
    {
      id: 6,
      title: 'AI & ML Expo',
      category: 'Conference',
      eventDate: '2025-06-25T10:00:00.000Z',
      venue: 'Bangalore International Exhibition Centre',
      city: 'Bangalore',
      price: '750',
      totalSeats: 300,
      availableSeats: 180,
      imageUrl: null,
      isStatic: false
    }
  ],
  pagination: {
    page: 1,
    totalPages: 1,
    total: 6,
    limit: 12
  }
};

// Mock response with 4 events.
const FOUR_EVENTS_RESPONSE = {
  data: [
    {
      id: 1,
      title: 'Tech Summit 2025',
      category: 'Conference',
      eventDate: '2025-06-01T10:00:00.000Z',
      venue: 'HICC',
      city: 'Hyderabad',
      price: '999',
      totalSeats: 200,
      availableSeats: 150,
      imageUrl: null,
      isStatic: false
    },
    {
      id: 2,
      title: 'Rock Night Live',
      category: 'Concert',
      eventDate: '2025-06-05T18:00:00.000Z',
      venue: 'Palace Grounds',
      city: 'Bangalore',
      price: '1500',
      totalSeats: 500,
      availableSeats: 300,
      imageUrl: null,
      isStatic: false
    },
    {
      id: 3,
      title: 'IPL Finals',
      category: 'Sports',
      eventDate: '2025-06-10T19:30:00.000Z',
      venue: 'Chinnaswamy',
      city: 'Bangalore',
      price: '2000',
      totalSeats: 800,
      availableSeats: 50,
      imageUrl: null,
      isStatic: false
    },
    {
      id: 4,
      title: 'UX Design Workshop',
      category: 'Workshop',
      eventDate: '2025-06-15T09:00:00.000Z',
      venue: 'WeWork',
      city: 'Mumbai',
      price: '500',
      totalSeats: 50,
      availableSeats: 20,
      imageUrl: null,
      isStatic: false
    }
  ],
  pagination: {
    page: 1,
    totalPages: 1,
    total: 4,
    limit: 12
  }
};

// Log API activity to help diagnose failures.
function logNetworkActivity(page) {
  page.on('request', request => {
    if (request.url().includes('/api/')) {
      console.log('API REQUEST:', request.method(), request.url());
    }
  });

  page.on('response', response => {
    if (response.url().includes('/api/')) {
      console.log('API RESPONSE:', response.status(), response.url());
    }
  });

  page.on('pageerror', error => {
    console.log('PAGE JAVASCRIPT ERROR:', error.message);
  });
}

// Log in, then navigate to Events.
async function loginAndGoToEvents(page) {
  await page.goto(BASE_URL);

  const signInHeading = page.getByRole('heading', {
    name: /sign in to eventhub/i
  });

  await expect(signInHeading).toBeVisible();

  await page.getByRole('textbox', { name: 'Email' }).fill(USER_EMAIL);
  await page.getByRole('textbox', { name: 'Password' }).fill(USER_PASSWORD);

  await page.getByRole('button', { name: /sign in/i }).click();

  await expect(signInHeading).toBeHidden({
    timeout: 10000
  });

  await page.goto(`${BASE_URL}/events`);
}

// Test 1: Six mocked events, banner should be visible.
test('Banner is visible when six events are returned', async ({ page }) => {
  logNetworkActivity(page);

  await page.route('**/api/events**', async route => {
    if (route.request().method() !== 'GET') {
      await route.continue();
      return;
    }

    console.log('MOCK MATCHED: SIX EVENTS', route.request().url());

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(SIX_EVENTS_RESPONSE)
    });
  });

  await loginAndGoToEvents(page);

  const eventCards = page.getByTestId('event-card');
  console.log('Six-event card count:', await eventCards.count());

  await expect(eventCards.first()).toBeVisible();
  await expect(eventCards).toHaveCount(6);

  const banner = page.getByText(/sandbox holds up to/i);
  await expect(banner).toBeVisible();
  await expect(banner).toContainText(/9 bookings/i);
});

// Test 2: Four mocked events, banner should be hidden.
test('Banner is hidden when four events are returned', async ({ page }) => {
  logNetworkActivity(page);

  await page.route('**/api/events**', async route => {
    if (route.request().method() !== 'GET') {
      await route.continue();
      return;
    }

    console.log('MOCK MATCHED: FOUR EVENTS', route.request().url());

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(FOUR_EVENTS_RESPONSE)
    });
  });

  await loginAndGoToEvents(page);

  const eventCards = page.getByTestId('event-card');
  console.log('Four-event card count:', await eventCards.count());

  await expect(eventCards.first()).toBeVisible();
  await expect(eventCards).toHaveCount(4);

  const banner = page.getByText(/sandbox holds up to/i);
  await expect(banner).not.toBeVisible();
});