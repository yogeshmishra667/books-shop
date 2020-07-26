const User = require('../models/user');

const getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false,
  });
};

const postLogin = async (req, res, next) => {
  const user = await User.findById('5f1719f67fff692414cd043d');
  try {
    req.session.isLoggedIn = true;
    req.session.user = user;
    res.redirect('/');
  } catch (error) {
    res.status(404).send(error);
    console.log(error);
  }
};
const postLogout = (req, res, next) => {
  req.session.destroy((error) => {
    res.redirect('/');
    res.status(404).send(error);
  });
};
module.exports = { getLogin, postLogin, postLogout };
