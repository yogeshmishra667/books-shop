const User = require('../models/user');
const bcrypt = require('bcryptjs');

const getLogin = (req, res, next) => {
  //because error style not hide automatic
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message,
  });
};

//for get => signup -->register
const getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message,
  });
};

const postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await User.findOne({ email });

  try {
    const doMatch = await bcrypt.compare(password, user.password);

    if (doMatch) {
      req.session.isLoggedIn = true;
      req.session.user = user;
      //redirect when session is saved
      req.session.save((error) => {
        console.log(error);
        res.redirect('/');
      });
    }
  } catch (error) {
    req.flash('error', 'invalid username or password!');
    return res.redirect('/login');
  }
};

//for post => signup -->register
const postSignup = async (req, res, next) => {
  const existUser = await User.findOne({ email: req.body.email });
  if (existUser) {
    req.flash('error', 'email already exist please pick another one!');
    return res.redirect('/signup');
  }
  try {
    const user = new User({ ...req.body, cart: { items: [] } });
    const result = await user.save();
    if (result) {
      res.redirect('/login');
    }
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

const postLogout = (req, res, next) => {
  req.session.destroy((error) => {
    res.redirect('/');
    res.status(404).send(error);
  });
};
module.exports = { getLogin, getSignup, postLogin, postSignup, postLogout };
