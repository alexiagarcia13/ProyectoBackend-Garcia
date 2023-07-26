const express = require('express');
const bodyParser = require('body-parser');
const ProductManager = require('/ProductManager');


const productManager = new ProductManager();

const app = express();
const PORT = 3000; // Puedes cambiar el puerto si lo deseas

// Middleware para procesar el cuerpo de las peticiones como JSON
app.use(bodyParser.json());


app.get('/productos', (req, res) => {
  const limit = parseInt(req.query.limit);

  let products = productManager.getAllProducts();

  if (!isNaN(limit)) {
    products = productos.slice(0, limit);
  }

  res.json({ productos });
});


app.listen(PORT, () => {
  console.log(`Servidor Express iniciado en http://localhost:${PORT}`);
});
