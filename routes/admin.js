const path = require('path');
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/admin');

// /admin/add-product => GET
router.get('/add-product', ctrl.getAddProduct);
// /admin/products => GET
router.get('/products', ctrl.getProducts);
// /admin/add-product => POST
router.post('/add-product', ctrl.postAddProduct);
router.get('/edit-product/:productId', ctrl.getEditProduct);
router.post('/edit-product/', ctrl.postEditProduct);
router.post('/delete-product', ctrl.postDeleteProduct);

module.exports = router;
