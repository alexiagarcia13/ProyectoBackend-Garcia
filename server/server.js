const express = require('express');
const productsRouter = require('./api/products/router');
const cartsRouter = require('./api/carts/router');
const http = require('http');
const socketIo = require('socket.io');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const fs = require('fs');

mongoose.connect('TU_URI_DE_CONEXIÓN', { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
const port = 8080;
const server = http.createServer(app);
const io = socketIo(server);

// Manejo de modelos de Mongoose
const Product = require('./dao/models/products');

app.use(express.json());

//Handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Rutas para el manejo de productos
app.use('/api/products', productsRouter);

// Rutas para el manejo de carritos
app.use('/api/carts', cartsRouter);

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

// Cargar los datos de productos desde MongoDB usando Mongoose
app.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.render('home', { products: products });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los productos.');
  }
});

app.get('/realtimeproducts', async (req, res) => {
  try {
    const products = await Product.find();
    res.render('realTimeProducts', { products: products });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los productos.');
  }
});

// WebSocket
io.on('connection', (socket) => {
  console.log('Cliente conectado por WebSocket');

  socket.on('disconnect', () => {
    console.log('Cliente desconectado por WebSocket');
  });

  // Escuchar eventos personalizados
  socket.on('newProduct', async (product) => {
    try {
      const newProduct = new Product(product);
      await newProduct.save();
      io.emit('productAdded', newProduct);
    } catch (error) {
      console.error(error);
    }
  });

  socket.on('deleteProduct', async (productId) => {
    try {
      await Product.findByIdAndRemove(productId);
      io.emit('productDeleted', productId);
    } catch (error) {
      console.error(error);
    }
  });
});

// Rutas HTTP
app.post('/createProduct', async (req, res) => {
  const productName = req.body.productName;
  if (productName) {
    try {
      const newProduct = new Product({ name: productName });
      await newProduct.save();
      io.emit('newProduct', newProduct);
    } catch (error) {
      console.error(error);
    }
  }
  res.redirect('/realtimeproducts');
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
