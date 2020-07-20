const Product = require('../models/product');

const getProducts = (req, res, next) => {
  const products = new Product(req.body.title);
  res.render('shop/list-product', {
    prods: products.fetchAll(),
    pageTitle: 'All Products',
    path: '/products',
  });
};

const getIndex = (req, res, next) => {
  const products = new Product(req.body.title);
  res.render('shop/index', {
    prods: products.fetchAll(),
    pageTitle: 'Shop',
    path: '/',
  });
};

// cart
const getShopCart = (req, res, next) => {
  res.render('shop/cart', {
    pageTitle: 'Cart',
    path: '/cart',
  });
};

// order
const getOrder = (req, res, next) => {
  res.render('shop/orders', {
    pageTitle: 'Cart',
    path: '/orders',
  });
};

// order
const getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Cart',
    path: '/checkout',
  });
};
module.exports = {
  getProducts,
  getShopCart,
  getOrder,
  getIndex,
  getCheckout,
};
