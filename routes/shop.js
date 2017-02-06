var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var Cart = require('../models/cart');

//list the products in the store/shop
router.get('/',function(req,res,next){
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
      products : productChunks
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
    console.log(req.session.cart);
    res.redirect('/shop');
  });
});

router.get('/cart', function(req,res,next){
  res.render('shop/cart',{
    title : "Shopping cart"
  });
});

module.exports = router;
