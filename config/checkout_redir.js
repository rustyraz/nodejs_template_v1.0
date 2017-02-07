'use strict';
module.exports = function(req,res,next){
  //this will be used to check if a user is authenticated in some routes
  req.session.oldUrl = req.originalUrl; //var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/user/login');
}
