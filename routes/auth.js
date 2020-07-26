const express = require('express');
const ctrl = require('../controllers/auth');
const router = express.Router();

router.get('/login', ctrl.getLogin);

router.post('/login', ctrl.postLogin);

module.exports = router;
