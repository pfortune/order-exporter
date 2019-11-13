const express = require('express');
const orderRouter = require('./routers/order.js');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(orderRouter);

app.listen(port, () => {
  console.log('Server is up on port ' + port);
});
