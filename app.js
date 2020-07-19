const path = require('path');
const express = require('express');
const app = express();

// Load View Engine🎑
const viewPath = path.join(__dirname, 'views');
app.set('views', viewPath);
app.set('view engine', 'ejs');

// parse application/x-www-form-urlencoded and application/json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Set Public Folder 🗄
app.use(express.static(path.join(__dirname, 'public')));

//routes
app.use('/admin', require('./routes/admin'));
app.use(require('./routes/shop'));
app.use(require('./controllers/error'));

//for run express server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`express server run on port ${port} 🔥`);
});
