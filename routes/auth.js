const express = require('express');
const ctrl = require('../controllers/auth');
const router = express.Router();

router.get('/login', ctrl.getLogin);
router.get('/signup', ctrl.getSignup);
router.post('/login', ctrl.postLogin);
router.post('/signup', ctrl.postSignup);
router.post('/logout', ctrl.postLogout);

module.exports = router;
