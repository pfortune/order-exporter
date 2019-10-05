const Prestashop = require("./utils/prestashop");
const fs = require("fs");
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

  // Overwrites CSV each time and adds the headers
  addCSVHeader();

  const orders = result.orders;

  for (let order in orders) {
    presta.getOrderDetails(orders[order].id, (error, result) => {
      if (error) {
        return console.log("Error", error);
      }

      buildCSV(result.data);
    });
  }
});

const buildCSV = data => {
  let order = "";

  for (let i = 0; i < data.itemslist.length; i++) {
    order += data.company + ", ";
    order += data.firstname + ", ";
    order += data.lastname + ", ";
    order += data.id + ", ";
    order += data.date_add + ", ";
    order += data.itemslist[i].product_quantity + ", ";
    order += data.id_customer + ", ";
    order += data.address1 + ", ";
    order += data.address2 + ", ";
    order += " , ";
    order += data.city + ", ";
    order += data.state + ", ";
    order += data.postcode + ", ";
    order += " , ";
    order += data.countryIso + ", ";
    order += data.email + ", ";
    order += data.itemslist[i].product_reference + ", ";
    order += data.phone;

    order += "\n";
    appendToCSV(order);
  }
};

// Adds the required headers to the top of the file
const addCSVHeader = () => {
  const header =
    "Company,Firstname,Lastname,Order,Date,Quantity,Customer,Address1,Address2,Address3,City,State,Postcode,Other,Country,Email,Sku,Phone\n";
  writeToCSV(header);
};

// Writes to the file, and overwrites existing data
const writeToCSV = data => {
  fs.writeFileSync("./data/test.csv", data);
};

// Appends a line to the file, without overwriting
const appendToCSV = data => {
  fs.appendFileSync("./data/test.csv", data);
};

/**
 * Test connecting to FTP server
 */
//ftp.list();
//ftp.connect();
