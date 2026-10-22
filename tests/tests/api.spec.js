const { test, expect } = require('@playwright/test');

const API_URL = 'https://api.eventhub.rahulshettyacademy.com/api';

const USER = {
  email: 'carranza.anthony0019@gmail.com',
  password: 'Carl$anthony0019',
  name: 'Carl Anthony Carranza',
  phone: '0939812713',
};

test.describe('EventHub Basic API Test Suite', () => {
  let token;
  let authHeaders;
  let createdEventId;
  let createdBookingId;

  // 1. POST /auth/login - Authenticate once before running the suite
  test.beforeAll(async ({ request }) => {
    const res = await request.post(`${API_URL}/auth/login`, {
      data: {
        email: USER.email,
        password: USER.password,
      },
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    console.log('--- [POST /auth/login Response] ---', body);
    
    expect(body.success).toBe(true);
    expect(body.token).toBeTruthy();

    token = body.token;
    authHeaders = { Authorization: `Bearer ${token}` };
  });

  // 2. GET /health & GET /config - Public endpoints (No token needed)
  test('GET /health and /config should return 200', async ({ request }) => {
    const healthRes = await request.get(`${API_URL}/health`);
    console.log('--- [GET /health Status] ---', healthRes.status());
    expect(healthRes.status()).toBe(200);

    const configRes = await request.get(`${API_URL}/config`);
    const configBody = await configRes.json();
    console.log('--- [GET /config Response] ---', configBody);
    expect(configRes.status()).toBe(200);
  });

  // 3. GET /auth/me - Protected endpoint (Requires Bearer token)
  test('GET /auth/me should return current logged-in user', async ({ request }) => {
    const res = await request.get(`${API_URL}/auth/me`, {
      headers: authHeaders,
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    console.log('--- [GET /auth/me Response] ---', body);
    expect(body.user.email).toBe(USER.email);
  });

  // 4. Negative Test: Verify 400 Bad Request on invalid login
  test('POST /auth/login with wrong password should fail', async ({ request }) => {
    const res = await request.post(`${API_URL}/auth/login`, {
      data: {
        email: USER.email,
        password: 'wrongpassword123',
      },
    });

    const body = await res.json();
    console.log('--- [POST /auth/login Negative Test Response] ---', body);

    expect(res.ok()).toBeFalsy();
    expect(res.status()).toBeGreaterThanOrEqual(400);
  });

  // 5. Full Event & Booking CRUD Lifecycle (POST -> GET -> PUT -> DELETE)
  test('Full CRUD lifecycle for Events and Bookings', async ({ request }) => {
    // A. POST /events (Create a new event)
    const createEventRes = await request.post(`${API_URL}/events`, {
      headers: authHeaders,
      data: {
        title: 'Playwright API Test Concert',
        description: 'Automated API event creation',
        category: 'Concert',
        city: 'Paris',
        venue: 'London Arena',
        eventDate: '2026-11-15T18:00:00.000Z',
        price: 25,
        totalSeats: 100,
      },
    });
    await expect(createEventRes).toBeOK();
    const eventBody = await createEventRes.json();
    console.log('--- [POST /events Created Event] ---', eventBody);

    const createdEvent = eventBody.data || eventBody.event || eventBody;
    createdEventId = createdEvent.id || createdEvent._id;
    expect(createdEventId).toBeDefined();

    // B. GET /events/{id} (Read single event and verify title)
    const getEventRes = await request.get(`${API_URL}/events/${createdEventId}`, {
      headers: authHeaders,
    });
    const getEventBody = await getEventRes.json();
    console.log('--- [GET /events/{id} Single Event] ---', getEventBody);
    expect(getEventRes.status()).toBe(200);

    // C. PUT /events/{id} (Update the event title and price)
    const updateEventRes = await request.put(`${API_URL}/events/${createdEventId}`, {
      headers: authHeaders,
      data: {
        title: 'Playwright API Updated Concert',
        description: 'Updated via PUT request',
        category: 'Concert',
        city: 'Paris',
        venue: 'London Arena',
        eventDate: '2026-11-15T18:00:00.000Z',
        price: 50,
        totalSeats: 100,
      },
    });
    await expect(updateEventRes).toBeOK();
    const updateEventBody = await updateEventRes.json();
    console.log('--- [PUT /events/{id} Updated Event] ---', updateEventBody);

    // D. POST /bookings (Book a ticket for the event)
    const createBookingRes = await request.post(`${API_URL}/bookings`, {
      headers: authHeaders,
      data: {
        eventId: createdEventId,
        customerName: USER.name,
        customerEmail: USER.email,
        customerPhone: USER.phone,
        quantity: 2,
      },
    });
    await expect(createBookingRes).toBeOK();
    const bookingBody = await createBookingRes.json();
    console.log('--- [POST /bookings Created Booking] ---', bookingBody);

    const booking = bookingBody.booking || bookingBody.data || bookingBody;
    createdBookingId = booking.id || booking._id;
    expect(createdBookingId).toBeDefined();

    // E. GET /bookings/{id} (Read the booking details)
    const getBookingRes = await request.get(`${API_URL}/bookings/${createdBookingId}`, {
      headers: authHeaders,
    });
    const getBookingBody = await getBookingRes.json();
    console.log('--- [GET /bookings/{id} Single Booking] ---', getBookingBody);
    expect(getBookingRes.status()).toBe(200);

    // F. DELETE /bookings/{id} (Cancel the booking)
    const cancelBookingRes = await request.delete(`${API_URL}/bookings/${createdBookingId}`, {
      headers: authHeaders,
    });
    await expect(cancelBookingRes).toBeOK();
    console.log('--- [DELETE /bookings/{id} Cancelled Booking Status] ---', cancelBookingRes.status());

    // G. DELETE /events/{id} (Delete the event to clean up)
    const deleteEventRes = await request.delete(`${API_URL}/events/${createdEventId}`, {
      headers: authHeaders,
    });
    await expect(deleteEventRes).toBeOK();
    console.log('--- [DELETE /events/{id} Deleted Event Status] ---', deleteEventRes.status());
  });
});