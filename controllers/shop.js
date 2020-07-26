const Product = require('../models/product');
const Order = require('../models/order');

const getProducts = async (req, res, next) => {
  const products = await Product.find();
  res.render('shop/list-product', {
    prods: products,
    pageTitle: 'All Products',
    path: '/products',
    isAuthenticated: req.isLoggedIn,
  });
};
//for single product
const getProduct = async (req, res, next) => {
  const prodId = req.params.productId;
  const product = await Product.findById(prodId);
  try {
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products',
      isAuthenticated: req.isLoggedIn,
    });
  } catch (error) {
    console.log(error);
    return error;
  }
};

const getIndex = async (req, res, next) => {
  const products = await Product.find({});
  res.render('shop/index', {
    prods: products,
    pageTitle: 'Shop',
    path: '/',
    isAuthenticated: req.isLoggedIn,
  });
};

// cart

const getShopCart = async (req, res, next) => {
  const data = await req.user.populate('cart.items.productId').execPopulate();
  /* ☝ this line populate (add & fetch) data from product model because of ref  data = cart:{items:[object]} this object is product data if want fetch data then {data.cart.items ==> (object data)}*/

  const product = data.cart.items; //do console
  try {
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products: product,
      isAuthenticated: req.isLoggedIn,
    });
  } catch (error) {
    console.log(error);
    return error;
  }
};

// for post => Cart
const postCart = async (req, res, next) => {
  const prodId = req.body.productId;
  const product = await Product.findById(prodId);
  try {
    return req.user.addToCart(product) && res.redirect('/cart');
  } catch (error) {
    return res.status(401).send(error) && console.log(error);
  }
};

//for post => delete cart items
const postCartDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  await req.user.removeFromCart(prodId);
  try {
    res.redirect('/cart');
  } catch (error) {
    console.log(error);
    return res.status(401).send(error);
  }
};
// for get => order
const getOrder = async (req, res, next) => {
  const orders = await Order.find({ 'user.userId': req.user._id });
  try {
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders,
      isAuthenticated: req.isLoggedIn,
    });
  } catch (error) {
    console.log(error);
    return res.status(401).send(error);
  }
};

//for post => order
const postOrder = async (req, res, next) => {
  const user = await req.user.populate('cart.items.productId').execPopulate();

  try {
    const products = user.cart.items.map((i) => {
      return { quantity: i.quantity, product: { ...i.productId._doc } };
    });
    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user,
      },
      products: products,
    });
    const result = await order.save();
    if (result) {
      return req.user.clearCart() && res.redirect('/orders');
    }
  } catch (error) {
    console.log(error);
    return res.status(401).send(error);
  }
};

// order
const getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Cart',
    path: '/checkout',
    isAuthenticated: req.isLoggedIn,
  });
};
module.exports = {
  getProducts,
  getProduct,
  getShopCart,
  postCart,
  postCartDeleteProduct,
  getOrder,
  postOrder,
  getIndex,
  getCheckout,
};
