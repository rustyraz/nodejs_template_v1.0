var express = require('express');
var router = express.Router();

var csrfProtection = require('../config/csrf_protection');
router.use(csrfProtection); //protect our user routes
var passport = require('passport');
var restrict_routes = require('../config/restrict_routes');
var notLoggedInRoutes = require('../config/notLoggedInRoutes');
var Order = require('../models/order');
var Cart = require('../models/cart');


router.get('/logout',function(req,res,next){
  req.logout();
  res.redirect('/user/login');
});

router.get('/profile',restrict_routes,function(req,res,next){
  Order.find({user : req.user}).catch(function(err){
    console.log(error);
    res.send('Error encountered while trying to get orders')
  }).then(function(orders){
    var cart;
    for (var i = 0; i < orders.length; i++) {
      //console.log(orders[i]);
      cart = new Cart(orders[i].cart);
      orders[i].items = cart.generateArray();
      if(orders.length-1 == i){
        res.render('user/profile',{
          title: "My Orders",
          orders : orders
        });
      }
    }

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
  failureRedirect: '/user/register',
  failureFlash: true
}),function(req,res,next){
  if(req.session.oldUrl){
    var oldUrl = req.session.oldUrl
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  }else{
    res.redirect('/user/profile');
  }
});

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
  failureRedirect: '/user/login',
  failureFlash: true
}),function(req,res,next){
  if(req.session.oldUrl){
    var oldUrl = req.session.oldUrl
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  }else{
    res.redirect('/user/profile');
  }
});

module.exports = router;
