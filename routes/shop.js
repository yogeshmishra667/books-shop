const express = require('express');
const ctrl = require('../controllers/shop');
const router = express.Router();

router.get('/', ctrl.getIndex);
router.get('/products', ctrl.getProducts);
router.get('/cart', ctrl.getShopCart);
router.get('/orders', ctrl.getOrder);

module.exports = router;
