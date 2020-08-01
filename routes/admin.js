const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/is-auth');
const { check, body } = require('express-validator');
const ctrl = require('../controllers/admin');

// ⚠ request always travel left to right

// /admin/add-product => GET
router.get('/add-product', isAuth, ctrl.getAddProduct);
// /admin/products => GET
router.get('/products', isAuth, ctrl.getProducts);
// /admin/add-product => POST
router.post(
  '/add-product',
  [
    //validation part
    body('title', 'Please enter a valid title.')
      .isString()
      .isLength({ min: 10, max: 20 }),
    body('imageUrl', 'Please enter a valid url.').isURL().trim(),
    body('price', 'Please enter a valid price.').isFloat().trim(),
    body('description').isLength({ min: 15, max: 200 }),
  ],
  isAuth,
  ctrl.postAddProduct
);
router.get('/edit-product/:productId', isAuth, ctrl.getEditProduct);
router.post(
  '/edit-product/',
  [
    //validation part
    body('title', 'Please enter a valid title.')
      .isString()
      .isLength({ min: 10, max: 40 }),
    body('imageUrl', 'Please enter a valid url.').isURL().trim(),
    body('price', 'Please enter a valid price.').isFloat().trim(),
    body('description').isLength({ min: 15, max: 200 }),
  ],
  isAuth,
  ctrl.postEditProduct
);
router.post('/delete-product', isAuth, ctrl.postDeleteProduct);

module.exports = router;
