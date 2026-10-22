const { test, expect } = require('@playwright/test');

test('Client App login', async ({ page }) => {

    const email = "carranza.anthony0019@gmail.com";
    const productName = 'zara coat 3';
    const products = page.locator(".card-body");
    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator("#userEmail").fill(email);
    await page.locator("#userPassword").fill("Carlanthony0019");
    await page.locator("[value='Login']").click();
    await page.waitForLoadState('networkidle');
    await page.locator(".card-body b").first().waitFor();
    const titles = await page.locator(".card-body b").allTextContents();
    console.log(titles);

    const Count = await products.count();
    for (let i = 0; i < Count; ++i) 
    {
        if ((await products.nth(i).locator("b").textContent()).toLowerCase() === productName.toLowerCase()) {
        
           await products.nth(i).getByRole('button', { name: 'Add To Cart' }).click();
            break;        
    }

   }
    
   await page.locator('[routerlink*= cart]').click();
   await page.locator("div li").first().waitFor();
   const bool = await page.locator("h3:has-text('zara coat 3')").isVisible();
   expect(bool).toBeTruthy();
   await page.locator("text=Checkout").click();
   await page.locator("[placeholder*='Country']").pressSequentially("phi",{ delay: 100});
   const dropdown = page.locator(".ta-results");
   await dropdown.waitFor();
   const optionsCount = await dropdown.locator("button").count();
   for (let i = 0; i < optionsCount; ++i) 
   {
      const text = await dropdown.locator("button").nth(i).textContent();

      if (text.trim() === "Philippines") 
      {
         await dropdown.locator("button").nth(i).click();
         break;
      }
   }
      await expect(page.locator(".ta-backdrop")).toBeHidden();
      await expect(page.locator("input[type='text']").last()).toHaveValue(email);

      console.log("Page URL:", page.url());
      console.log("Place Order count:", await page.locator(".action__submit").count());

      await page.locator(".action__submit").click();

      await expect(page.locator(".hero-primary"))
       .toHaveText("Thankyou for the order.");

      const orderIds = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
      console.log(orderIds);
      
      await page.locator('button[routerlink*= myorders]').click();
      await page.locator("tbody").waitFor();
      const rows = await page.locator ('tbody tr');

      for (let i = 0; i < await rows.count(); ++i)
      {
         const rowOrderId = await rows.nth(i).locator("th").textContent();
         if (orderIds.includes(rowOrderId)) 
         {
           await rows.nth(i).locator("button").first().click();
             break; 
         }


      }
         const orderIdDetails = await page.locator(".col-text").textContent();
         expect(orderIds.includes(orderIdDetails)).toBeTruthy();
       
    

}) ;
 
 
test('@Web Client App login', async ({ page }) => {
   //js file- Login js, DashboardPage
   const email = "anshika@gmail.com";
   const productName = 'zara coat 3';
   const products = page.locator(".card-body");
   await page.goto("https://rahulshettyacademy.com/client");
   await page.locator("#userEmail").fill(email);
   await page.locator("#userPassword").type("Iamking@000");
   await page.locator("[value='Login']").click();
   await page.waitForLoadState('networkidle');
   await page.locator(".card-body b").first().waitFor();
   const titles = await page.locator(".card-body b").allTextContents();
   console.log(titles); 
 
})


test('Browser Context Playwright Test', async ({ browser }) => {

    const context = await browser.newContext();
    const page = await context.newPage();

    const email = "carranza.anthony0019@gmail.com";

    // LOGIN
    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator("#userEmail").fill(email);
    await page.locator("#userPassword").fill("Carlanthony0019");
    await page.locator("[value='Login']").click();

    await page.waitForLoadState('networkidle');
    await page.locator(".card-body b").first().waitFor();

    // GO TO ORDERS
    await page.locator('[routerlink*= myorders]').click();

    // Wait for Orders page
    await page.locator("tbody").waitFor();

    // Get Order ID
    const orderId = await page.locator("tbody tr").first().locator("th").textContent();
    console.log("Order ID:", orderId);
 
   // Click View
    await page.locator("tbody tr").first().getByRole('button', { name: 'View' }).click();

   // Get details
   const orderIdDetails = await page.locator(".col-text").textContent();

   // Get billing address
   const BillingAddressDetails = await page.locator(".address").first().textContent();

   // Get delivery address
   const DeliveryAddressDetails = await page.locator(".address").nth(1).textContent();

   console.log("Order ID Details:", orderIdDetails);
   console.log("Billing Address:", BillingAddressDetails);
   console.log("Delivery Address:", DeliveryAddressDetails);

   expect(orderIdDetails).toContain(orderId.trim());
      
    await page.getByText('View Orders').click();
    await page.locator("tbody").waitFor();


});
