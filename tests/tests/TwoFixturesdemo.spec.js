const { expect } = require('@playwright/test');
const { customtest } = require('../../fixtures.js');

const BASE_URL = 'https://eventhub.rahulshettyacademy.com';

// Task 3: The test body contains no login code and no API calls — strictly navigation and assertion
customtest('Verify programmatically created event is visible on the events page', async ({ authenticatedPage, createEvent }) => {
  // Step 1: Use authenticatedPage fixture to navigate straight to the events page (already logged in)
  await authenticatedPage.goto(`${BASE_URL}/events`);

  // Step 2 & 3: Use createEvent fixture details and assert the event's name is visible on the page
  const eventHeading = authenticatedPage.getByRole('heading', { name: createEvent.name });
  await expect(eventHeading).toBeVisible();
});