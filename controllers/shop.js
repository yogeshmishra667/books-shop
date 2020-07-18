const productData = require('../controllers/product');

const getShop = (req, res, next) => {
  const products = productData.products;
  res.render('shop', {
    prods: products,
    pageTitle: 'Shop',
    path: '/',
    hasProducts: products.length > 0,
    activeShop: true,
    productCSS: true,
  });
};

module.exports = {
  getShop,
};
