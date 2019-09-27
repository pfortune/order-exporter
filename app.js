const Prestashop = require("./utils/prestashop");
const ftp = require("./utils/ftp");

require("dotenv").config();

const presta = new Prestashop(process.env.URL, process.env.APIKEY);

/**
 * Retrieve the orders that are marked as payment accepted
 */
presta.getOrders("payment_accepted", (error, result) => {
  if (error) {
    return console.log("Error", error);
  }
  const orders = result.orders;

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
 * Retrieve details of an order from custom endpoint
 */
presta.getOrderDetails("13398", (error, order) => {
  if (error) {
    return console.log("Error", error);
  }

  console.log(order);
});

/**
 * Test connecting to FTP server
 */
ftp.list();
ftp.connect();
