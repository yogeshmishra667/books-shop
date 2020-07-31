const express = require('express');
const { check, body } = require('express-validator');
const User = require('../models/user');
const ctrl = require('../controllers/auth');
const router = express.Router();

router.get('/login', ctrl.getLogin);
router.get('/signup', ctrl.getSignup);
router.post(
  '/login',
  [
    //validation part
    body('email', 'Please enter a valid email.')
      .isEmail()
      .withMessage()
      .normalizeEmail(),
    body(
      //this check req.body
      'password',
      'Please enter a password with only numbers and text and at least 5 characters.'
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
  ],
  ctrl.postLogin
);

router.post(
  '/signup',
  [
    //validation part
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .normalizeEmail()
      .custom(async (value, { req }) => {
        // if (value === 'test@test.com') {
        //   throw new Error('This email address if forbidden.');
        const userDoc = await User.findOne({ email: value });
        if (userDoc) {
          return Promise.reject(
            'E-Mail exists already, please pick a different one.'
          );
        }
      }),
    body(
      //this check req.body
      'password',
      'Please enter a password with only numbers and text and at least 5 characters.'
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body('confirmPassword')
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords have to match!');
        }
        return true;
      }),
  ],
  ctrl.postSignup
);
router.post('/logout', ctrl.postLogout);
router.get('/reset', ctrl.getReset);
router.post('/reset', ctrl.postReset);
router.get('/reset/:token', ctrl.getNewPassword);
router.post('/new-password', ctrl.postNewPassword);

module.exports = router;
