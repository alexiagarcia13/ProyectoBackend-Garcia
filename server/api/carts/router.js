const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const cartsFile = './server/api/carts/carts.json';

// Middleware para cargar los carritos desde el archivo JSON
function loadCarts() {
  const data = fs.readFileSync(cartsFile, 'utf8');
  return JSON.parse(data);
}

// Middleware para guardar los carritos en el archivo JSON
function saveCarts(carts) {
  fs.writeFileSync(cartsFile, JSON.stringify(carts, null, 2));
}

// Ruta raíz POST /api/carts/
router.post('/', (req, res) => {
  const cart = {
    id: uuidv4(),
    products: [],
  };

  const carts = loadCarts();
  carts.push(cart);
  saveCarts(carts);

  res.status(201).json(cart);
});

// Ruta GET /api/carts/:cid
router.get('/:cid', (req, res) => {
  const cid = req.params.cid;
  const carts = loadCarts();
  const cart = carts.find((c) => c.id.toString() === cid);
  if (cart) {
    res.json(cart.products);
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});

// Ruta POST /api/carts/:cid/product/:pid
router.post('/:cid/product/:pid', (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const quantity = req.body.quantity || 1;

  const carts = loadCarts();
  const cartIndex = carts.findIndex((c) => c.id.toString() === cid);

  if (cartIndex !== -1) {
    const cart = carts[cartIndex];

    const existingProductIndex = cart.products.findIndex((p) => p.product.toString() === pid);

    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      cart.products.push({ product: pid, quantity });
    }

    saveCarts(carts);
    res.json(cart.products);
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});

module.exports = router;
