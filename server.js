const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.listen(3000, () => console.log('App listening on port 3000!'));