const { test, expect } = require('@playwright/test');

test('Popup validation', async ({ page }) => {
  await page.goto('https://rahulshettyacademy.com/AutomationPractice/');
  await page.locator('#hide-textbox').click();
  await expect(page.locator('#displayed-text')).toBeHidden();
  await page.pause();
  page.on('dialog', dialog => dialog.accept());
  await page.locator('#confirmbtn').click();
  await page.locator('#mousehover').hover(); // Best practice: use .hover() instead of .click() for mouse hover elements
  const topLink = page.getByRole('link', { name: 'Top' });
  await expect(topLink).toBeVisible();
  await topLink.click();
  
  const framesPage = page.frameLocator('#courses-iframe');
  await framesPage.locator('li a[href*="lifetime-access"]:visible').click();
  const textCheck = await framesPage.locator('.text h2').innerText();
  console.log(textCheck.split(' ')[1]);
});