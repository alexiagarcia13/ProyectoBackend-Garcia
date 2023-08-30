const express = require('express');
const productsRouter = require('./api/products/router');
const cartsRouter = require('./api/carts/router');
const http = require('http');
const socketIo = require('socket.io');
const exphbs = require('express-handlebars');
const fs = require('fs');


const app = express();
const port = 8080;
const server = http.createServer(app);
const io = socketIo(server);
// Cargar los datos de productos.json
const productsData = fs.readFileSync('productos.json', 'utf8');
const products = JSON.parse(productsData);

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


app.get('/', (req, res) => {
  res.render('home', { products: getAllProducts() });
});

app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts', { products: getAllProducts() });
});

// WebSocket
io.on('connection', (socket) => {
  console.log('Cliente conectado por WebSocket');

  socket.on('disconnect', () => {
      console.log('Cliente desconectado por WebSocket');
  });

  // Escuchar eventos personalizados
  socket.on('newProduct', (product) => {
      addProduct(product);
      io.emit('productAdded', product);
  });

  socket.on('deleteProduct', (productId) => {
      deleteProduct(productId);
      io.emit('productDeleted', productId);
  });
});

// Rutas HTTP
app.post('/createProduct', (req, res) => {
  const productName = req.body.productName;
  if (productName) {
      // Emitir evento para agregar producto
      io.emit('newProduct', { name: productName });
  }
  res.redirect('/realtimeproducts');
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});