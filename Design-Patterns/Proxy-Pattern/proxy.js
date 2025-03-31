class API {
  request(endpoint) {
    console.log(`Fetching data from ${endpoint}...`);
  }
}

class APIProxy {
  constructor() {
    this.api = new API();
    this.cache = {};
  }

  request(endpoint) {
    if (this.cache[endpoint]) {
      console.log("Returning cached data...");
      return this.cache[endpoint];
    }

    this.cache[endpoint] = this.api.request(endpoint);
    return this.cache[endpoint];
  }
}

export default new APIProxy();

