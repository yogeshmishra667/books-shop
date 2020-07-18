const products = [];

const getAddProduct = (req, res, next) => {
  res.render('add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
  });
};

//for add product
const postAddProduct = (req, res, next) => {
  products.push({ title: req.body.title });
  res.redirect('/');
};

module.exports = {
  products,
  getAddProduct,
  postAddProduct,
};
