const Product = require('../models/product');

const getProducts = async (req, res, next) => {
  const products = await Product.find({});
  res.render('shop/list-product', {
    prods: products,
    pageTitle: 'All Products',
    path: '/products',
  });
};
//for single product
const getProduct = async (req, res, next) => {
  const prodId = req.params.productId;
  const product = await Product.findById(prodId);
  if (product) {
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products',
    });
  }
  return console.log('error');
};

const getIndex = async (req, res, next) => {
  const products = await Product.find({});
  res.render('shop/index', {
    prods: products,
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
  getProduct,
  getShopCart,
  getOrder,
  getIndex,
  getCheckout,
};
