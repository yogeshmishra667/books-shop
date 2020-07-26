const getLogin = (req, res, next) => {
  // console.log(req.get('Cookie'));
  // const isLoggedIn = req.get('Cookie').split(';')[1].trim().split('=')[1];
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

module.exports = { getLogin, postLogin };
