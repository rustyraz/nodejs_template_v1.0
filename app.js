var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
var MongoStore = require('connect-mongo')(session);

//ROUTES GO HERE
var indexRoutes = require('./routes/index');
var shopRoutes = require('./routes/shop');
var userRoutes = require('./routes/user');
var leadsRoutes = require('./routes/leads');

var app = express();

//connect to mongoose
mongoose.connect('mongodb://localhost:27017/lms');
mongoose.Promise = Promise;
require('./config/passport');

// view engine setup
app.engine('.hbs', expressHbs({defaultLayout : 'layout', extname : '.hbs'}));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({
  secret : "mytopsecretsessionkey",
  resave : false,
  saveUninitialized : false,
  store : new MongoStore({
    //prevent new mongoose connection. Use the existing one
    mongooseConnection : mongoose.connection
  }),
  //have a cookie expiration
  cookie : { maxAge : 180 * 60 * 1000 } // 3 hrs in milli secs
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

//middle-ware to hav the authenticated user variable set to the views
app.use(function(req, res, next){
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});

//Apply routes to views
app.use('/', indexRoutes);
app.use('/leads',leadsRoutes);
app.use('/user', userRoutes);
app.use('/shop', shopRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
