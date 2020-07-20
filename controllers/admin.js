const Product = require('../models/product');

const getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
};

//for admin  post add product
const postAddProduct = async (req, res, next) => {
  const product = new Product(req.body);
  const newProduct = await product.save();
  if (newProduct) {
    console.log('Created Product');
    res.redirect('/admin/products');
  }
  return res.status(500).send({ message: ' Error in Creating Product.' });
};

//for add product
const getProducts = (req, res, next) => {
  res.redirect('/');
};

module.exports = {
  getAddProduct,
  postAddProduct,
  getProducts,
};
