// ProductManager.js
const fs = require('fs');

class ProductManager {
  constructor() {
    this.productsFilePath = '/productos.json';
  }

  
  getAllProducts() {
    try {
      const data = fs.readFileSync(this.productsFilePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error al leer el archivo de productos:', error);
      return [];
    }
  }
}

module.exports = ProductManager;
