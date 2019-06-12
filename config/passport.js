const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load user Model
const User = mongoose.model('users');

module.exports = function(passport) {
  passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done)=> {
    //console.log(email);
    //console.log(password);
    //Maatch user ->
    User.findOne({
      email: email
    }).then(user=> {
      if(!user){
        return done(null, false, {message: 'No user found'});    
      }
      //match password
      bcrypt.compare(password, user.password, (err, isMatch)=> {
        if(err) throw err;
        if(isMatch) {
          return done(null, user);
        }else {
          return done(null, false, {message: 'Password incorrect...'});
        }
      })
    });
  }));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  //Mangoose find by id is fine, but Native MongoDB we need to change it
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};