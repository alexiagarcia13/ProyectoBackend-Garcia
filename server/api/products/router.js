const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const productsFile = './server/api/products/products.json';

// Middleware para cargar los productos desde el archivo JSON
function loadProducts() {
  const data = fs.readFileSync(productsFile, 'utf8');
  return JSON.parse(data);
}

// Middleware para guardar los productos en el archivo JSON
function saveProducts(products) {
  fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
}

// Ruta raíz GET /api/products/
router.get('/', (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
  const products = loadProducts();
  const limitedProducts = limit ? products.slice(0, limit) : products;
  res.json(limitedProducts);
});

// Ruta GET /api/products/:pid
router.get('/:pid', (req, res) => {
  const pid = req.params.pid;
  const products = loadProducts();
  const product = products.find((p) => p.id.toString() === pid);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// Ruta raíz POST /api/products/
router.post('/', (req, res) => {
  const {
    title,
    description,
    code,
    price,
    status = true,
    stock,
    category,
    thumbnails,
  } = req.body;

  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const products = loadProducts();
  const newProduct = {
    id: uuidv4(),
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails: thumbnails || [],
  };

  products.push(newProduct);
  saveProducts(products);

  res.status(201).json(newProduct);
});

// Ruta PUT /api/products/:pid
router.put('/:pid', (req, res) => {
  const pid = req.params.pid;
  const products = loadProducts();
  const productIndex = products.findIndex((p) => p.id.toString() === pid);

  if (productIndex !== -1) {
    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const updatedProduct = {
      ...products[productIndex],
      title,
      description,
      code,
      price,
      status: status === undefined ? products[productIndex].status : status,
      stock,
      category,
      thumbnails: thumbnails || products[productIndex].thumbnails,
    };

    products[productIndex] = updatedProduct;
    saveProducts(products);

    res.json(updatedProduct);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// Ruta DELETE /api/products/:pid
router.delete('/:pid', (req, res) => {
  const pid = req.params.pid;
  const products = loadProducts();
  const productIndex = products.findIndex((p) => p.id.toString() === pid);

  if (productIndex !== -1) {
    products.splice(productIndex, 1);
    saveProducts(products);
    res.json({ message: 'Producto eliminado correctamente' });
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

module.exports = router;
