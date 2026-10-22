const { test, expect } = require('@playwright/test');

test('GET all users', async ({ request }) => {

    const response = await request.get('https://jsonplaceholder.typicode.com/users');

    expect(response.status()).toBe(200);

    const users = await response.json();

    console.log(users);

    expect(Array.isArray(users)).toBe(true);

    expect(users[0]).toHaveProperty('id');
    expect(users[0]).toHaveProperty('name');
    expect(users[0]).toHaveProperty('username');
    expect(users[0]).toHaveProperty('email');

});

test('GET single user', async ({ request }) => {

    const response = await request.get('https://jsonplaceholder.typicode.com/users/1');

    expect(response.status()).toBe(200);

    const user = await response.json();

    console.log(user);

    expect(user.id).toBe(1);
    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('username');
    expect(user).toHaveProperty('email');

});

test('POST create user', async ({ request }) => {

    const newUser = {
        name: 'Carl Test',
        username: 'carltest',
        email: 'carltest@example.com'
    };

    const response = await request.post('https://jsonplaceholder.typicode.com/users', {
        data: newUser
    });

    expect(response.status()).toBe(201);

    const createdUser = await response.json();

    console.log(createdUser);

    expect(createdUser).toHaveProperty('id');
    expect(createdUser.name).toBe(newUser.name);
    expect(createdUser.username).toBe(newUser.username);
    expect(createdUser.email).toBe(newUser.email);

});