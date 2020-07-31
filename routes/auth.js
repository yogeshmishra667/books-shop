const express = require('express');
const { check, body } = require('express-validator');
const ctrl = require('../controllers/auth');
const router = express.Router();

router.get('/login', ctrl.getLogin);
router.get('/signup', ctrl.getSignup);
router.post(
  '/login',
  [
    //validation part
    body('email', 'Please enter a valid email.').isEmail().withMessage(),
    body(
      //this check req.body
      'password',
      'Please enter a password with only numbers and text and at least 5 characters.'
    )
      .isLength({ min: 5 })
      .isAlphanumeric(),
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
      .custom((value, { req }) => {
        if (value === 'test@test.com') {
          throw new Error('This email address if forbidden.');
        }
        return true;
      }),
    body(
      //this check req.body
      'password',
      'Please enter a password with only numbers and text and at least 5 characters.'
    )
      .isLength({ min: 5 })
      .isAlphanumeric(),
    body('confirmPassword').custom((value, { req }) => {
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
