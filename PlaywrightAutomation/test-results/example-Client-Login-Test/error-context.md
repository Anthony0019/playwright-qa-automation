# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: example.spec.js >> Client Login Test
- Location: tests\example.spec.js:3:6

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Added To Cart')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByText('Added To Cart') with timeout 5000ms
  - waiting for getByText('Added To Cart')

```

```yaml
- navigation:
  - link "Automation Automation Practice":
    - /url: ""
    - heading "Automation" [level=3]
    - paragraph: Automation Practice
  - link "🎯 I'll help you prepare for your next QA job — Explore the QA Career Accelerator.":
    - /url: https://rahulshettyacademy.com/qa-career-accelerator-job-ready
  - list:
    - listitem:
      - button " HOME"
    - listitem
    - listitem:
      - button " ORDERS"
    - listitem:
      - button " Cart 3"
    - listitem:
      - button "Sign Out"
- paragraph: Home | Search
- heading "Filters" [level=4]
- textbox "search"
- heading "Price Range" [level=6]
- textbox "Min Price"
- textbox "Max Price"
- heading "Categories" [level=6]
- text: 
- checkbox
- text: fashion
- checkbox
- text: electronics
- checkbox
- text: household
- heading "Sub Categories" [level=6]
- text: 
- checkbox
- text: t-shirts
- checkbox
- text: shirts
- checkbox
- text: shoes
- checkbox
- text: mobiles
- checkbox
- text: laptops
- heading "Search For" [level=6]
- text: 
- checkbox
- text: men
- checkbox
- text: women Showing 3 results | User can only see maximum 9 products on a page
- img
- heading "ADIDAS ORIGINAL" [level=5]
- text: $ 11500
- button "View"
- button " Add To Cart"
- img
- heading "ZARA COAT 3" [level=5]
- text: $ 11500
- button "View"
- button " Add To Cart"
- img
- heading "iphone 13 pro" [level=5]
- text: $ 55000
- button "View"
- button " Add To Cart"
- list "Pagination":
  - listitem: « Previous page
  - listitem: You're on page 1
  - listitem: Next page »
- text: Design and Developed By - Kunal Sharma
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | test.only('Client Login Test', async ({ page }) => {
  4  | 
  5  | 
  6  |     const userName = page.locator('#userEmail');
  7  |     const signIn = page.locator('#login');
  8  | 
  9  |     await page.goto('https://rahulshettyacademy.com/client/#/auth/login');
  10 | 
  11 |     console.log(await page.title());
  12 | 
  13 |     // Enter credentials
  14 |     await userName.fill('carranza.anthony0019@gmail.com');
  15 |     await page.locator("[type='password']").fill('Carlanthony0019');
  16 | 
  17 |     // Login
  18 |     await signIn.click();
  19 | 
  20 |     console.log(await page.locator(".toast-container").textContent());
  21 | 
  22 |     // Wait for product page
  23 |     await page.locator(".card-img-top").first().waitFor();
  24 | 
  25 |     // Click/View product
  26 |     
  27 | 
  28 |     console.log(await page.locator(".card-img-top").allTextContents());
  29 | 
  30 |     // Add to cart
  31 |     const adidas = page.locator(".card").filter({
  32 |     hasText: "ADIDAS ORIGINAL"
  33 | });
  34 | 
  35 |     const zara = page.locator(".card").filter({
  36 |     hasText: "ZARA COAT 3"
  37 | });
  38 | 
  39 |     const iphone = page.locator(".card").filter({
  40 |     hasText: "iphone 13 pro"
  41 | });
  42 | 
  43 |     await adidas.getByRole("button", { name: "Add To Cart" }).click();
  44 |     await zara.getByRole("button", { name: "Add To Cart" }).click();
  45 |     await iphone.getByRole("button", { name: "Add To Cart" }).click();
  46 |     // Verify confirmation
  47 |     await expect(page.getByText('Added To Cart'))
> 48 |         .toBeVisible();
     |          ^ Error: expect(locator).toBeVisible() failed
  49 | 
  50 | });
  51 | 
```