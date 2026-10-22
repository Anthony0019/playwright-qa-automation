const { _electron: electron, test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { PolarDataPage } = require('../pages/PolarDataPage');

let electronApp;
let window;

test.afterEach(async ({}, testInfo) => {
  if (testInfo.status !== 'passed' && window) {
    console.log(`❌ Test failed! Capturing screenshot for debugging...`);
    const screenshot = await window.screenshot({ path: 'test-results/failure-screenshot.png' });
    await testInfo.attach('Failure Screenshot', { body: screenshot, contentType: 'image/png' });
  }
  
  if (electronApp) {
    await electronApp.close();
  }
});

test('Filter Polar Data with Page Object Model', async () => {
  electronApp = await electron.launch({
    executablePath: 'C:\\Program Files\\CASH App\\CASH App.exe',
  });
  window = await electronApp.firstWindow();
  await window.waitForLoadState('domcontentloaded');

  const loginPage = new LoginPage(window);
  const polarDataPage = new PolarDataPage(window);

  await loginPage.handleLogin('anthony.carranza@redcoresolutions.com', 'Anthonycarl0019');
  await polarDataPage.navigateTo();
  await polarDataPage.filterByDate('31-Aug-2025');
  await polarDataPage.triggerReimportAndRefresh();

  // Intentional failure to verify failure screenshot capture
  console.log('Testing intentional failure to trigger screenshot...');
  await expect(polarDataPage.refreshButton).toHaveText('Fake Button Text', { timeout: 3000 });
});