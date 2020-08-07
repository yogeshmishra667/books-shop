const Product = require('../models/product');
const { validationResult } = require('express-validator');
const appError = require('../utils/appError');

const getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: [],
  });
};

//for admin  post add product
const postAddProduct = async (req, res, next) => {
  const image = req.file;
  //if image is not find
  if (!image) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      product: {
        title: title,
        price: price,
        description: description,
      },
      errorMessage: 'Attached file is not an image.',
      validationErrors: [],
    });
  }

  const product = new Product({
    ...req.body,
    userId: req.user._id,
    imageUrl: req.file.path,
  });
  //for validation
  //for validationErrors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'error',
      path: '/admin/edit-product',
      editing: false,
      hasError: false,
      product: product,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }
  try {
    const newProduct = await product.save();
    if (newProduct) {
      console.log('Created Product');
      res.redirect('/admin/products');
    }
  } catch (error) {
    // console.log(error);
    // return res.status(500).send(error);
    next(new appError(500, `Some error occurred!`));
  }
};

//for get admin products
const getProducts = async (req, res, next) => {
  const products = await Product.find({ userId: req.user._id });
  //only show admin product for authenticated user whose create product
  try {
    //console.log(products);
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
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
      hasError: false,
      errorMessage: null,
      validationErrors: [],
    });
  } catch (error) {
    console.log(error);
    return res.status(401).redirect('/');
  }
};

//for post => admin edit products
const postEditProduct = async (req, res, next) => {
  const product = await Product.findById(req.body.productId);
  if (product.userId.toString() !== req.user._id.toString()) {
    //toString because also checking type
    return res.redirect('/');
  }

  //for input validation
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'error',
      path: '/admin/edit-product',
      editing: true,
      hasError: true,
      product: product,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }
  try {
    product.title = req.body.title;
    product.price = req.body.price;
    if (req.file) {
      product.imageUrl = req.file.path;
    }
    product.description = req.body.description;

    await product.save();
    console.log('UPDATED PRODUCT!');
    res.status(200).redirect('/admin/products');
  } catch (error) {
    next(new appError(500, `Some error occurred!`));
  }
};
//for post => delete admin product
const postDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  await Product.deleteOne({ _id: prodId, userId: req.user._id });
  //assign userId for delete only whose user Created
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
