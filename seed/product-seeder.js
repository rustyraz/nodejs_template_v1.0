var Product = require('../models/product');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/lms');
mongoose.Promise = Promise;

var products =  [
  new Product({
    imagePath : "http://www.clickbd.com/global/classified/item_img/296879_0_original.jpg",
    title : "Toyota Fielder",
    description : "2008 :: 1500cc :: Silver color :: Dark Interior",
    price : 900000,
    available : true
  }),
  new Product({
    imagePath : "http://auto-database.com/image/pictures-of-toyota-auris-2009-62455.jpg",
    title : "Toyota Auris",
    description : "2008 :: 1500cc :: Silver color :: Dark Interior",
    price : 890000,
    available : true
  }),
  new Product({
    imagePath : "http://image-cdn.beforward.jp/large/201403/226138/BF229368_80cad5.jpg",
    title : "Toyota Vanguard",
    description : "2009 :: 2400cc :: Black color :: Dark Interior",
    price : 1890000,
    available : true
  }),
  new Product({
    imagePath : "http://blogs-images.forbes.com/georgepeterson1/files/2016/11/2017-Honda-CR-V-FV-Forbes.jpg?width=960",
    title : "Honda",
    description : "2008 :: 1500cc :: Silver color :: Dark Interior",
    price : 2900000,
    available : true
  })
];

var done = 0;
for (var i = 0; i < products.length; i++) {
  products[i].save().catch(function(err){
    console.log(err);
  }).then(function(data){
    done++;
    console.log(data);
    if(done === products.length){
      exit();
    }
  });
}

function exit() {
  mongoose.disconnect();
}
