const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/is-auth');
const ctrl = require('../controllers/admin');

// ⚠ request always travel left to right

// /admin/add-product => GET
router.get('/add-product', isAuth, ctrl.getAddProduct);
// /admin/products => GET
router.get('/products', isAuth, ctrl.getProducts);
// /admin/add-product => POST
router.post('/add-product', isAuth, ctrl.postAddProduct);
router.get('/edit-product/:productId', isAuth, ctrl.getEditProduct);
router.post('/edit-product/', isAuth, ctrl.postEditProduct);
router.post('/delete-product', isAuth, ctrl.postDeleteProduct);

module.exports = router;
