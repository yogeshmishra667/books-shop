const getLogin = (req, res, next) => {
  console.log(req.session.isLoggedIn);
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false,
  });
};
const postLogin = (req, res, next) => {
  req.session.isLoggedIn = true;
  res.redirect('/');
};

const postLogout = (req, res, next) => {
  req.session.destroy((error) => {
    res.redirect('/');
    res.status(404).send(error);
  });
};
module.exports = { getLogin, postLogin, postLogout };
