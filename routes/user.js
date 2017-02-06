var express = require('express');
var router = express.Router();

var csrfProtection = require('../config/csrf_protection');
router.use(csrfProtection); //protect our user routes
var passport = require('passport');
var restrict_routes = require('../config/restrict_routes');
var notLoggedInRoutes = require('../config/notLoggedInRoutes');


router.get('/logout',function(req,res,next){
  req.logout();
  res.redirect('/user/login');
});

router.get('/profile',restrict_routes,function(req,res,next){
  res.render('user/profile', {
    title : "User profile page"
  });
});
router.get('/',function(req,res,next){
  res.redirect('/user/profile');
});

//PLACE ROUTES THAT DO NOT REQUIRE LOGIN UNDER HERE
router.use('/',notLoggedInRoutes);

router.get('/register',function(req,res,next){
  var messages = req.flash('error');
  res.render('user/register',{
    title : "Register as a new shop admin",
    csrfToken : req.csrfToken(),
    messages : messages,
    hasErrors : messages.length>0
  });
});

router.post('/register', passport.authenticate('local-register', {
  successRedirect : '/user/profile',
  failureRedirect: '/user/register',
  failureFlash: true
}));

router.get('/login',function(req,res,next){
    var messages = req.flash('error');
    res.render('user/login',{
      title : "Login into your account",
      csrfToken : req.csrfToken(),
      messages : messages,
      hasErrors : messages.length>0
    });
});

router.post('/login', passport.authenticate('local-login',{
  successRedirect : '/user/profile',
  failureRedirect: '/user/login',
  failureFlash: true
}));

module.exports = router;
