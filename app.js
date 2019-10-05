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
    presta.getOrderDetails(orders[order].id, (error, result) => {
      if (error) {
        return console.log("Error", error);
      }

      const {
        company,
        firstname,
        lastname,
        id: orderId,
        date_add: date,
        id_customer: customerId,
        address1,
        address2,
        city,
        state,
        postcode,
        countryIso,
        email,
        phone,
        itemslist: products
      } = result.data;

      console.log(
        `
         ${firstname} ${lastname} | ${orderId} | ${date} | ${customerId} | 
         ${address1} | ${address2} | ${city} | ${state} | ${postcode} | ${countryIso} | ${email} | ${phone} | ${products}
         --------
         `
      );
    });
  }
});

/**
 * Test connecting to FTP server
 */
//ftp.list();
//ftp.connect();
