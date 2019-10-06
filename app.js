const Prestashop = require('./utils/prestashop');
const fs = require('fs');
const ftp = require('./utils/ftp');

require('dotenv').config();

const presta = new Prestashop(process.env.URL, process.env.APIKEY);

// Create a unique file name
const file = `./data/orders${Date.now()}.csv`;

/**
 * Retrieve the ID of orders that are marked as payment accepted
 */
presta.getOrders('payment_accepted', (error, result) => {
  if (error) {
    return console.log('Error', error);
  }

  // Create Header and then write to CSV file
  writeToCSV(file, CSVHeader());

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
});

// Creates each line of the CSV file from the order data
const buildCSV = data => {
  let order = '';

  for (let i = 0; i < data.itemslist.length; i++) {
    order += data.company + ', ';
    order += data.firstname + ', ';
    order += data.lastname + ', ';
    order += data.id + ', ';
    order += data.date_add + ', ';
    order += data.itemslist[i].product_quantity + ', ';
    order += data.id_customer + ', ';
    order += data.address1 + ', ';
    order += data.address2 + ', ';
    order += ' , ';
    order += data.city + ', ';
    order += data.state + ', ';
    order += data.postcode + ', ';
    order += ' , ';
    order += data.countryIso + ', ';
    order += data.email + ', ';
    order += data.itemslist[i].product_reference + ', ';
    order += data.phone;

    order += '\n';
    writeToCSV(file, order);
  }
};

// Required CSV headers
const CSVHeader = () => {
  return 'Company,Firstname,Lastname,Order,Date,Quantity,Customer,Address1,Address2,Address3,City,State,Postcode,Other,Country,Email,Sku,Phone\n';
};

// Adds a line to a file, creates file if it doesn't exist
const writeToCSV = (file, data) => {
  fs.appendFileSync(file, data);
};

/**
 * Test connecting to FTP server
 */
//ftp.list();
//ftp.connect();
