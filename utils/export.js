const Prestashop = require('./prestashop');
const fs = require('fs');
const ftp = require('./ftp');
require('dotenv').config();

const presta = new Prestashop(process.env.URL, process.env.APIKEY);

// Create a unique file name
const file = `orders${Date.now()}.csv`;
const local = `./data/${file}`;
const remote = `/towms/${file}`;

/**
 * Retrieve the ID of orders that are marked as payment accepted
 */

presta.getOrders('payment_accepted', (error, result) => {
  if (error) {
    return console.log('Error', error);
  }

  // Create Header and then write to CSV file
  writeToCSV(local, CSVHEADER);

  const orders = result.orders;

  for (let order in orders) {
    // Retrieve the order details using the order ID
    presta.getOrderDetails(orders[order].id, (error, result) => {
      if (error) {
        return console.log('Error', error);
      }
      buildCSV(result.data);
    });
  }

  // Upload orders to FTP server
  uploadOrders(local);
});

// Creates each line of the CSV file from the order data
const buildCSV = data => {
  // if an order has more than one product, create a line for each product
  for (let i = 0; i < data.itemslist.length; i++) {
    let order = '';
    order += `"${data.company}", `;
    order += `"${data.firstname}", `;
    order += `"${data.lastname}", `;
    order += `"${data.id}", `;
    order += `"${data.date_add}",`;
    order += `"${data.itemslist[i].product_quantity}", `;
    order += `"${data.id_customer}", `;

    // if an order is for collection, replace all the address fields with 'Collection'
    if (data.id_carrier === '193') {
      order +=
        'Collection,Collection,Collection,Collection,Collection,Collection,Collection,';
    } else {
      order += `"${data.address1}", `;
      order += `"${data.address2}", `;
      order += ' , ';
      order += `"${data.city}", `;
      order += `"${data.state}", `;
      order += `"${data.postcode}", `;
      order += ' , ';
    }
    order += `"${data.countryIso}", `;
    order += `"${data.email}", `;
    order += `"${data.itemslist[i].product_reference}", `;
    order += `"${formatPhoneNumber(data.phone)}", `;
    order += `"${formatMessage(data.message)}"`;
    order += '\n';

    // write the order to a CSV file locally
    writeToCSV(local, order);
  }
};

// remove any character that's not a digit, including spaces
function formatPhoneNumber(number) {
  return number.replace(/\D+/g, '');
}

function formatMessage(message) {
  if (message !== null) {
    return message.substring(0, 300);
  }

  return '';
}

// Required CSV headers
const CSVHEADER =
  'Company Name,First Name,Last Name,Order Number,Date of Order,Quantity,Account Number,Address Line 1,Address Line 2,Address Line 3,Town,County,Post Code,State,Country,Email Address,SKU,Phone number,Comments\n';

// Adds a line to a file, creates file if it doesn't exist
const writeToCSV = (file, data) => {
  fs.appendFileSync(file, data);
};

const uploadOrders = local => {
  ftp.upload(local, remote);
  ftp.connect();
};

module.exports = {
  getOrders
};
