const path = require('path');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const morgan = require('morgan');
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');

require('./utils/database');
const User = require('./models/user');
const { getError } = require('./controllers/error');
const { fileStorage, fileFilter } = require('./utils/addImages');

const app = express();

// for csrf protection
const csrfProtection = csrf();

// Load View Engine🎑
const viewPath = path.join(__dirname, 'views');
app.set('views', viewPath);
app.set('view engine', 'ejs');

// parse application/x-www-form-urlencoded and application/json

app.use(express.urlencoded({ extended: true }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use(express.json());
app.use(morgan('dev'));

//Set Public Folder 🗄
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

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

//for pass local variable in view
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

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
    message: error.message,
    status: error.status,
    code: error.statusCode,
    isAuthenticated: req.session.isLoggedIn,
  });
});

//for run express server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`express server run on port ${port} 🔥`);
});
