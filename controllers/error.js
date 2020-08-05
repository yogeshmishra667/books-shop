const getError = (req, res, next) => {
  res.status(404).render('404', {
    pageTitle: 'Page Not Found',
    path: '/',
    isAuthenticated: req.isLoggedIn,
  });
};

module.exports = {
  getError,
};
