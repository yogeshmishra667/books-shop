const Product = require('../models/product');

const getAddProduct = (req, res, next) => {
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
  });
};

//for admin product
const getProducts = (req, res, next) => {
  const products = new Product(req.body.title);
  res.render('admin/products', {
    prods: products.fetchAll(),
    pageTitle: 'Admin Product',
    path: '/admin/products',
  });
};

//for add product
const postAddProduct = (req, res, next) => {
  const product = new Product(req.body.title);
  product.save();
  res.redirect('/');
};

module.exports = {
  getAddProduct,
  postAddProduct,
  getProducts,
};
