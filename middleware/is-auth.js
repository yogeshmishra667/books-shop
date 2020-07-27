const isAuth = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    res.redirect('/login');
  }
  next();
};

module.exports = isAuth;
