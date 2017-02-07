var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var Cart = require('../models/cart');
var Order = require('../models/order');

//route restrict
var checkout_redir = require('../config/checkout_redir');

//list the products in the store/shop
router.get('/',function(req,res,next){
  var successCheckout = req.flash('success')[0];
  var products = Product.find();
  products.catch(function(err){
    res.send('Error encountered');
  }).then(function(data){
    //split the data into chunks
    var productChunks = [];
    var chunkSize = 3;
    for (var i = 0; i < data.length; i += chunkSize) {
      productChunks.push(data.slice(i, i + chunkSize));
    }
    res.render('shop/index',{
      title : "list of the available products",
      products : productChunks,
      successCheckout : successCheckout,
      noSuccessCheckout : !!successCheckout
    });
  });

});

router.get('/add-to-cart/:id',function(req, res, next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  Product.findById(productId).catch(function(err){
    return res.redirect('/');
  }).then(function(result){
    cart.add(result,result.id);
    req.session.cart = cart;
    res.redirect('/shop');
  });
});

router.get('/cart', function(req,res,next){
  if(req.session.oldUrl){
    req.session.oldUrl = null;
  }
  if(!req.session.cart){
    return res.render('shop/cart', {
      products : null,
      title : "Empty cart"
    });
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/cart',{
    title : "Shopping cart",
    products : cart.generateArray(),
    totalPrice : cart.totalPrice
  });
});

router.get('/checkout', checkout_redir, function(req,res,next){
  if(!req.session.cart){
    return res.render('shop/cart', {
      products : null,
      title : "Empty cart"
    });
  }
  var errMsg = req.flash('error')[0];
  var cart = new Cart(req.session.cart);
  res.render('shop/checkout',{
    title : "Payment - Credit card details",
    total : cart.totalPrice,
    errMsg : errMsg,
    noError : !!errMsg
  })
});

router.post('/checkout',checkout_redir,function(req,res,next){
  if(!req.session.cart){
    return res.render('shop/cart', {
      products : null,
      title : "Empty cart"
    });
  }
  var cart = new Cart(req.session.cart);

  var stripe = require("stripe")(
    "sk_test_dGXkXTRar6gX2qA3JnSQmhwf"
  );
  stripe.charges.create({
    amount : cart.totalPrice, //should be multiplied by 100 but the ksh has a rate of 100 at the moment
    currency : "usd",
    source : req.body.stripeToken,
    description : "Charge for the car purchase"
  },function(err,charge){
    if(err){
      req.flash('error', err.message);
      return res.redirect('/shop/checkout');
    }

    var order = new Order();
    order.user = req.user;
    order.cart = cart;
    order.address = req.body.address_zip;
    order.name = req.body.card_holder_name;
    order.paymentId = charge.id;

    order.save().catch(function(err2){
      req.flash('error', err2);
      res.redirect('/shop');
    }).then(function(result){
      req.flash('success', "Successfully bought products!");
      req.session.cart = null;
      res.redirect('/shop');
    });

  });
});

module.exports = router;
