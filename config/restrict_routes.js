module.exports = function(req,res,next){
  //this will be used to check if a user is authenticated in some routes
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/user/login');
}
