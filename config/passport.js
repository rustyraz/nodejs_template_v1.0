var passport = require('passport');
var User = require('../models/user');
var localStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user,done){
  done(null,user.id);
});

passport.deserializeUser(function(id,done){
  User.findById(id).catch(function(err){
    console.log('Error finding a user by id');
    done(err,null);
  }).then(function(data){
    done(null,data);
  });
});

passport.use('local-register', new localStrategy({
  usernameField : 'email',
  passwordField : 'password',
  passReqToCallback : true
}, function(req,email,password,done){
  //do the validation here
  req.checkBody('email','Invalid Email').notEmpty().isEmail();
  req.checkBody('password', 'Password should be at least 4 characters').notEmpty().isLength({min:4});
  var errors = req.validationErrors();
  if(errors){
    var error_messages = [];
    errors.forEach(function(error){
      error_messages.push(error.msg);
    });
    return done(null, false, req.flash('error', error_messages));
  }
  User.findOne({'email' : email}).catch(function(err){
    return done(err);
  }).then(function(data){
    if(data){
        return done(null,false,{message : "Email is already registered!"});
    }
    var newUser = new User();
    newUser.email = email;
    newUser.password = newUser.encryptPassword(password);
    newUser.first_name = req.body.first_name;
    newUser.last_name = req.body.last_name;
    newUser.phone = req.body.phone;
    newUser.save().catch(function(err){
      return done(err);
    }).then(function(new_user){
      return done(null,new_user);
    });
  });

}));


passport.use('local-login', new localStrategy({
  usernameField : 'email',
  passwordField : 'password',
  passReqToCallback : true
}, function(req, email,password,done){
  req.checkBody('email','Invalid Email').notEmpty().isEmail();
  req.checkBody('password', 'Valid password required!').notEmpty();
  var errors = req.validationErrors();
  if(errors){
    var error_messages = [];
    errors.forEach(function(error){
      error_messages.push(error.msg);
    });
    return done(null, false, req.flash('error', error_messages));
  }

  User.findOne({'email' : email}).catch(function(err){
    return done(err);
  }).then(function(user){
    if(!user){
      return done(null,false,{message : 'No user found!'});
    }
    if(!user.validatePassword(password)){
      return done(null,false,{message : 'Wrong password used!'});
    }
    console.log('Successful login');
    return done(null,user);
  });
}));
