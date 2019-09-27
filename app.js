const Prestashop = require("./utils/prestashop");

const presta = new Prestashop(URL, APIKEY);

/**
 * Retrieve the orders that are marked as payment accepted
 */
presta.getOrders("payment_accepted", (error, orders) => {
  if (error) {
    return console.log("Error", error);
  }

  for (let order in orders) {
    presta.getOrderById(orders[order].id, (error, order) => {
      if (error) {
        return console.log("Error", error);
      }

      console.log(order);
    });
  }
});

/**
 *
 */
presta.getOrderDetails("13398", (error, order) => {
  if (error) {
    return console.log("Error", error);
  }

  console.log(order.data.itemslist);
});
