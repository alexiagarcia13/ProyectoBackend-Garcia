const express = require('express');
const productsRouter = require('./api/products/router');
const cartsRouter = require('./api/carts/router');

const app = express();
const port = 8080;

app.use(express.json());

// Rutas para el manejo de productos
app.use('/api/products', productsRouter);

// Rutas para el manejo de carritos
app.use('/api/carts', cartsRouter);

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
