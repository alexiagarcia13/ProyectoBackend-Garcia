const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: String,
    price: Number,
    // otras propiedades...
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
