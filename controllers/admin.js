const Product = require('../models/product');

const getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    isAuthenticated: req.session.isLoggedIn,
  });
};

//for admin  post add product
const postAddProduct = async (req, res, next) => {
  const product = new Product({ ...req.body, userId: req.user._id });
  try {
    const newProduct = await product.save();
    if (newProduct) {
      console.log('Created Product');
      res.redirect('/admin/products');
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

//for get admin products
const getProducts = async (req, res, next) => {
  const products = await Product.find();
  try {
    //console.log(products);
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
      isAuthenticated: req.session.isLoggedIn,
    });
  } catch (error) {
    console.log(error);
  }
};

//admin get => admin edit products
const getEditProduct = async (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const product = await Product.findById(req.params.productId);
  try {
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product,
      isAuthenticated: req.session.isLoggedIn,
    });
  } catch (error) {
    console.log(error);
    return res.status(401).redirect('/');
  }
};

//for post => admin edit products
const postEditProduct = async (req, res, next) => {
  const product = await Product.findById(req.body.productId);
  try {
    product.title = req.body.title;
    product.price = req.body.price;
    product.imageUrl = req.body.imageUrl;
    product.description = req.body.description;
    await product.save();

    console.log('UPDATED PRODUCT!');
    res.status(200).redirect('/admin/products');
  } catch (error) {
    console.log('something went to wrong', error);
    return res.status(401).send(error);
  }
};
//for post => delete admin product
const postDeleteProduct = async (req, res, next) => {
  await Product.findByIdAndRemove(req.body.productId);
  try {
    console.log('DESTROYED PRODUCT');
    res.status(201).redirect('/admin/products');
  } catch (error) {
    res.status(401).send(error);
    console.log(error);
  }
};

module.exports = {
  getProducts,
  getAddProduct,
  postAddProduct,
  postEditProduct,
  getEditProduct,
  postDeleteProduct,
};
