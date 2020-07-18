const path = require('path');
const express = require('express');


const app = express();
// Load View Engine🎑
const viewPath = path.join(__dirname, 'views');
app.set('views', viewPath);
app.set('view engine', 'ejs');


const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// parse application/x-www-form-urlencoded and application/json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//Set Public Folder 🗄
app.use(express.static(path.join(__dirname, 'public')));

//routes
app.use('/admin', adminData.routes);
app.use('/', shopRoutes);


app.use((req, res, next) => {
  res.status(404).render('404', { pageTitle: 'Page Not Found' });
});

//for run express server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`express server run on port ${port} 🔥`);
});