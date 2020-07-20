const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, default: 0, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
