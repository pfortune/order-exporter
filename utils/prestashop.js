const request = require("request");

/**
 *
 * @param {string} base_url Base URL
 * @param {string} key  PrestaShop WebService API Key
 */

class PrestaShop {
  constructor(base_url, key) {
    this.apiKey = key;
    this.base_url = base_url;
  }

  /**
   * Retrieve the ID's of all orders matching any options specified
   * @param {object} options
   * @param {function} callback
   */
  getOrders(options, cb) {
    if (options === "payment_accepted") {
      options = 2;
    }

    const url = this.buildUrl({
      type: "orders",
      options: options,
      format: "JSON"
    });

    this.req(url, cb);
  }

  /**
   * Retrieve an order based on the ID given.
   * @param {number} id
   * @param {function} callback
   */
  getOrderById(id, cb) {
    const url = this.buildUrl({
      type: "orders",
      id: id,
      format: "JSON"
    });

    this.req(url, cb);
  }

  /**
   * Given an address id return a state (eg. Dublin)
   * @param {*} id
   * @param {*} callback
   */
  getState(id, cb) {
    const url = this.buildUrl({
      type: "state",
      id: id,
      format: "JSON"
    });

    this.req(url, cb);
  }

  /**
   * Give a country id return the name of the country (eg. Ireland)
   * @param {*} id
   * @param {*} cb
   */
  getCountry(id, callback) {
    const url = this.buildUrl({
      type: "country",
      id: id,
      format: "JSON"
    });

    this.req(url, cb);
  }

  /**
   * Given a customer id return the email for that customer.
   * @param {*} id
   * @param {*} cb
   */
  getCustomerEmail(id, cb) {
    const url = this.buildUrl({
      type: "customer",
      id: id,
      format: "JSON"
    });

    this.req(url, cb);
  }

  /**
   * Given an address id return an address.
   * @param {*} id
   * @param {*} cb
   */
  getAddress(id, cb) {
    const url = this.buildUrl({
      type: "address",
      id: id,
      format: "JSON"
    });

    this.req(url, cb);
  }

  /**
   * Get Order Details
   * @param {*} id
   * @param {*} cb
   */
  getOrderDetails(id, cb) {
    const url = this.buildUrl({
      type: "orderslist",
      id,
      method: "getOrder"
    });

    this.req(url, cb);
  }

  /**
   * Builds up the API request url to be used by the other methods.
   */
  buildUrl({ type, id, options, format, method }) {
    let url = `${this.base_url}/${type}/`;

    if (id && !method) {
      url += `${id}/`;
    }

    url += `?ws_key=${this.apiKey}`;

    if (format) {
      url += `&output_format=${format}`;
    } else {
      url += `&output_format=JSON`;
    }

    if (options) {
      url += `&filter[current_state]=[${options}]`;
    }

    if (method) {
      url += `&method=${method}&orderId=${id}`;
    }

    return url;
  }

  /**
   *  Performs GET request using URL and returns response to callback
   * @param {*} url
   * @param {*} cb
   */
  req(url, cb) {
    request.get({ url: url, json: true }, (error, response) => {
      if (error) {
        cb("Unable to connect to the PrestaShop Webservice API.");
      } else {
        cb(undefined, response.body);
      }
    });
  }
}

module.exports = PrestaShop;
