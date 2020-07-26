const path = require('path');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const morgan = require('morgan');
require('./utils/database');
const User = require('./models/user');
const app = express();

// Load View Engine🎑
const viewPath = path.join(__dirname, 'views');
app.set('views', viewPath);
app.set('view engine', 'ejs');

// parse application/x-www-form-urlencoded and application/json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));

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

//for user id  and add in product
app.use(async (req, res, next) => {
  const user = await User.findById('5f1719f67fff692414cd043d');
  req.user = user;
  next();
});

//Set Public Folder 🗄
app.use(express.static(path.join(__dirname, 'public')));

//routes
app.use('/admin', require('./routes/admin'));
app.use(require('./routes/shop'));
app.use(require('./routes/auth'));
app.use(require('./controllers/user'));
app.use(require('./controllers/error'));

//for run express server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`express server run on port ${port} 🔥`);
});
