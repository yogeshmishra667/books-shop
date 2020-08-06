const path = require('path');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const morgan = require('morgan');
require('./utils/database');
const User = require('./models/user');
const csrf = require('csurf');
const flash = require('connect-flash');
const { getError } = require('./controllers/error');

const app = express();

// Load View Engine🎑
const viewPath = path.join(__dirname, 'views');
app.set('views', viewPath);
app.set('view engine', 'ejs');

// parse application/x-www-form-urlencoded and application/json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));

// for csrf protection
const csrfProtection = csrf();

//for session and cookie
app.use(
  session({
    secret: 'yogeshmishrashop',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      url: process.env.MONGODB_URL,
      collection: 'session',
    }),
  })
);

app.use(csrfProtection);
app.use(flash());

//create user based on session data
app.use(async (req, res, next) => {
  //if [req.session.user] not found simply next
  if (!req.session.user) {
    return next();
  }
  try {
    const user = await User.findById(req.session.user._id);
    if (!user) {
      return next();
    }
    req.user = user;
    next();
  } catch (error) {
    throw new Error(error);
  }
});

//Set Public Folder 🗄
app.use(express.static(path.join(__dirname, 'public')));

//for pass local variable in view
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

//routes
app.use('/admin', require('./routes/admin'));
app.use(require('./routes/shop'));
app.use(require('./routes/auth'));

app.use(getError);

// error handler middleware
app.use((error, req, res, next) => {
  res.status(error.statusCode).render('500', {
    pageTitle: 'Error!',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn,
    message: error.message,
    status: error.status,
    code: error.statusCode,
  });
});

//for run express server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`express server run on port ${port} 🔥`);
});
