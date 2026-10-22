class APIUtils {
  constructor(apiContext, loginPayload) {
    this.apiContext = apiContext;
    this.loginPayload = loginPayload;
  }

  async getToken() {
    const loginResponse = await this.apiContext.post('https://rahulshettyacademy.com/api/ecom/auth/login', {
      data: this.loginPayload
    });
    const loginResponseJson = await loginResponse.json();
    const token = loginResponseJson.token;
    console.log(token);
    return token;
  }

  async createOrder(orderPayload) {
    let response = {};
    response.token = await this.getToken();

    // Dynamically fetch a valid live product ID to prevent "Wrong Product ID" errors
    const productsResponse = await this.apiContext.post('https://rahulshettyacademy.com/api/ecom/product/get-all-products', {
      data: { productName: "", minPrice: null, maxPrice: null, productCategory: [], productSubCategory: [], productFor: [] },
      headers: { 'Authorization': response.token, 'Content-Type': 'application/json' }
    });
    const productsJson = await productsResponse.json();
    if (productsJson.data && productsJson.data.length > 0) {
      orderPayload.orders[0].productOrderedId = productsJson.data[0]._id;
    }

    const orderResponse = await this.apiContext.post('https://rahulshettyacademy.com/api/ecom/order/create-order', {
      data: orderPayload,
      headers: {
        'Authorization': response.token,
        'Content-Type': 'application/json'
      }
    });

    const orderResponseJson = await orderResponse.json();
    console.log(orderResponseJson);
    const orderId = orderResponseJson.orders[0];
    response.orderId = orderId;
    return response;
  }
}

module.exports = { APIUtils };