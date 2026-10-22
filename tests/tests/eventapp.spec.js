const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://eventhub.rahulshettyacademy.com';

// Reusable login helper function
async function login(page) {
  await page.goto(`${BASE_URL}/login`);
  await page.getByPlaceholder('you@email.com').fill('carranza.anthony0019@gmail.com');
  await page.getByLabel('Password').fill('Carl$anthony0019');
  await page.locator('#login-btn').click();
  await expect(page.getByRole('link', { name: 'Browse Events →' })).toBeVisible();
}

// Helper to generate future date value for the event
function futureDateValue() {
  const future = new Date();
  future.setDate(future.getDate() + 5);
  return future.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:mm
}

test('Assignment: Create event, book ticket, and verify seat reduction', async ({ page }) => {
  // Step 1 — Login
  await login(page);

  // Step 2 — Create a new event
  await page.goto(`${BASE_URL}/admin/events`);
  const eventTitle = `Test Event ${Date.now()}`;

  await page.locator('#event-title-input').fill(eventTitle);
  await page.locator('#admin-event-form textarea').fill('Automated test description for event creation assignment.');
  await page.getByLabel('City').fill('New York');
  await page.getByLabel('Venue').fill('Madison Square Garden');
  await page.getByLabel('Event Date & Time').fill(futureDateValue());
  await page.getByLabel('Price ($)').fill('100');
  await page.getByLabel('Total Seats').fill('50');
  await page.locator('#add-event-btn').click();

  await expect(page.getByText('Event created!')).toBeVisible();

  // Step 3 — Find the event card and capture seats
  await page.goto(`${BASE_URL}/events`);
  const eventCards = page.locator('[data-testid="event-card"]');
  await expect(eventCards.first()).toBeVisible();

  const matchedEventCard = eventCards.filter({ hasText: eventTitle });
  await expect(matchedEventCard).toBeVisible({ timeout: 5000 });

  const seatTextBefore = await matchedEventCard.locator(':text("seat")').textContent();
  const seatsBeforeBooking = parseInt(seatTextBefore.replace(/\D/g, ''), 10);

  // Step 4 — Start booking
  await matchedEventCard.locator('[data-testid="book-now-btn"]').click();

  // Step 5 — Fill booking form
  await expect(page.locator('#ticket-count')).toHaveText('1');
  await page.getByLabel('Full Name').fill('Carl Anthony Carranza');
  await page.locator('#customer-email').fill('carranza.anthony0019@gmail.com');
  await page.getByPlaceholder('+91 98765 43210').fill('0939812713');
  await page.locator('.confirm-booking-btn').click();

  // Step 6 — Verify booking confirmation
  const bookingRefEl = page.locator('.booking-ref').first();
  await expect(bookingRefEl).toBeVisible();
  const bookingRef = (await bookingRefEl.textContent()).trim();

  // Step 7 — Verify in My Bookings
  await page.getByRole('link', { name: 'View My Bookings' }).click();
  await expect(page).toHaveURL(`${BASE_URL}/bookings`);

  const bookingCards = page.locator('#booking-card');
  await expect(bookingCards.first()).toBeVisible();

  const matchedBookingCard = bookingCards.filter({ has: page.locator(`.booking-ref`, { hasText: bookingRef }) });
  await expect(matchedBookingCard).toBeVisible();
  await expect(matchedBookingCard).toContainText(eventTitle);

  // Step 8 — Verify seat reduction
  await page.goto(`${BASE_URL}/events`);
  await expect(eventCards.first()).toBeVisible();

  const updatedEventCard = eventCards.filter({ hasText: eventTitle });
  await expect(updatedEventCard).toBeVisible();

  const seatTextAfter = await updatedEventCard.locator(':text("seat")').textContent();
  const seatsAfterBooking = parseInt(seatTextAfter.replace(/\D/g, ''), 10);

  expect(seatsAfterBooking).toBe(seatsBeforeBooking - 1);
});