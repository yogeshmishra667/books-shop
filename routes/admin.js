const path = require('path');
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/product');

// /admin/add-product => GET
router.get('/add-product', ctrl.getAddProduct);
// /admin/add-product => POST
router.post('/add-product', ctrl.postAddProduct);

module.exports = router;
