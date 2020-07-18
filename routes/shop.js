const path = require('path');
const express = require('express');
const ctrl = require('../controllers/shop');
const router = express.Router();

router.get('/', ctrl.getShop);

module.exports = router;
