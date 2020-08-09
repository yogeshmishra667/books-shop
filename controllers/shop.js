const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const stripe = require('stripe')(process.env.STRIPE_TOKEN);

const Product = require('../models/product');
const Order = require('../models/order');
const appError = require('../utils/appError');
const ITEMS_PER_PAGE = 2;

const getProducts = async (req, res, next) => {
  //for pagination
  const page = +req.query.page || 1; //add plus because its string
  const totalItems = await Product.find().countDocuments();

  const products = await Product.find()
    .skip((page - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE);

  res.render('shop/list-product', {
    prods: products,
    pageTitle: 'All Products',
    path: '/products',

    // for pagination
    currentPage: page,
    hasNextPage: ITEMS_PER_PAGE * page < totalItems,
    hasPreviousPage: page > 1,
    nextPage: page + 1,
    previousPage: page - 1,
    lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
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
    });
  } catch (error) {
    console.log(error);
    return error;
  }
};

const getIndex = async (req, res, next) => {
  //for pagination
  const page = +req.query.page || 1; //add plus because its string
  const totalItems = await Product.find().countDocuments();

  const products = await Product.find()
    .skip((page - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE);

  res.render('shop/index', {
    prods: products,
    pageTitle: 'Shop',
    path: '/',

    // for pagination
    currentPage: page,
    hasNextPage: ITEMS_PER_PAGE * page < totalItems,
    hasPreviousPage: page > 1,
    nextPage: page + 1,
    previousPage: page - 1,
    lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
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
    });
  } catch (error) {
    console.log(error);
    return res.status(401).send(error);
  }
};

//for payment method
const getCheckout = async (req, res, next) => {
  let products;
  let total = 0;
  const user = await req.user.populate('cart.items.productId').execPopulate();
  try {
    products = user.cart.items;
    total = 0;
    products.forEach((p) => {
      total += p.quantity * p.productId.price;
    });
    //create session for stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: products.map((p) => {
        return {
          name: p.productId.title,
          description: p.productId.description,
          amount: p.productId.price * 100,
          currency: 'inr',
          quantity: p.quantity,
        };
      }),
      //if payment success/fail then redirect route
      success_url: req.protocol + '://' + req.get('host') + '/checkout/success', // => http://localhost:3000/checkout/success
      cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel',
    });

    if (session) {
      res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout',
        products: products,
        totalSum: total,
        sessionId: session.id,
      });
    }
  } catch (error) {
    return next(new appError(500, 'something went to wrong'));
  }
};

/*  you can also use postOrder route but i can create new route and paste postOrder code in controller */

const getCheckoutSuccess = async (req, res, next) => {
  const user = await req.user.populate('cart.items.productId').execPopulate();

  try {
    const products = user.cart.items.map((i) => {
      return { quantity: i.quantity, product: { ...i.productId._doc } };
    });
    const order = new Order({
      user: {
        email: req.user.email,
        userId: req.user,
      },
      products: products,
    });
    const result = await order.save();
    if (result) {
      return req.user.clearCart() && res.redirect('/orders');
    }
  } catch (error) {
    return next(new appError(500, 'something went to wrong'));
  }
};

//postOrder use when you can't use stripe
//for post => order
const postOrder = async (req, res, next) => {
  const user = await req.user.populate('cart.items.productId').execPopulate();

  try {
    const products = user.cart.items.map((i) => {
      return { quantity: i.quantity, product: { ...i.productId._doc } };
    });
    const order = new Order({
      user: {
        email: req.user.email,
        userId: req.user,
      },
      products: products,
    });
    const result = await order.save();
    if (result) {
      return req.user.clearCart() && res.redirect('/orders');
    }
  } catch (error) {
    return next(new appError(500, 'something went to wrong'));
  }
};

//for generate pdf
const getInvoice = async (req, res, next) => {
  const orderId = req.params.orderId;
  const order = await Order.findById(orderId);

  try {
    if (order.user.userId.toString() !== req.user._id.toString()) {
      return next(new appError(301, 'Unauthorized'));
    }
    const invoiceName = 'invoice-' + orderId + '.pdf';
    const invoicePath = path.join('invoices', invoiceName);

    const pdfDoc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'inline; filename="' + invoiceName + '"'
    );
    pdfDoc.pipe(fs.createWriteStream(invoicePath));
    pdfDoc.pipe(res);

    pdfDoc.fontSize(26).text('Invoice', {
      underline: true,
    });
    pdfDoc.text('-----------------------');
    let totalPrice = 0;
    order.products.forEach((prod) => {
      totalPrice += prod.quantity * prod.product.price;
      pdfDoc
        .fontSize(14)
        .text(
          `${prod.product.title} - ${prod.quantity} x $${prod.product.price}`
        );
    });
    pdfDoc.text('---');
    pdfDoc.fontSize(20).text('Total Price: $' + totalPrice);

    pdfDoc.end();
  } catch (error) {
    return next(new appError(500, 'something went to wrong'));
  }
};

module.exports = {
  getProducts,
  getProduct,
  getShopCart,
  postCart,
  postCartDeleteProduct,
  getOrder,
  getCheckoutSuccess,
  //postOrder,
  getIndex,
  getCheckout,
  getInvoice,
};
