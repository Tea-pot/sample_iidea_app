const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const router = express.Router();

//Bring User Model
require('../models/User');
const User = mongoose.model('users');

// user log in route
router.get('/login', (req, res)=>{
  res.render('users/login');
});
// user register route
router.get('/register', (req, res)=>{
  res.render('users/register');
});
// Login form POST
router.post('/login', (req, res, next)=> {
  passport.authenticate('local', {
    successRedirect: '/ideas',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);

});

//Register form POST
router.post('/register', (req, res)=> {
  /*
  console.log(req.body);
  res.send('register');
   */
  let errors = [];
  if(req.body.password != req.body.password2) {
    errors.push({text:'Password do not match'});
  }
  if(req.body.password.length < 4) {
    errors.push({text: 'Password must be at least 4 characters'});
  }
  if(errors.length > 0) {
    res.render('users/register', {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  }else {
    //encryption via bcryptjs
    User.findOne({email: req.body.email})
    .then( user =>{
      if(user) {
        req.flash('error_msg', 'Email already registered');
        res.redirect('/users/register');

      }else {
        const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });
      bcrypt.genSalt(10, (err, salt)=> {
        bcrypt.hash(newUser.password, salt, (err, hash)=>{
          if(err) throw (err);
          newUser.password = hash;
          newUser.save()
          .then(user => {
            req.flash('success_msg', 'You are registered and now can log in');
            res.redirect('/users/login');
          })
          .catch(err => {
              console.log(err);
              return;
            });  
        });
      });
      console.log(newUser);
      }
    });
  }
});

//Logout User
router.get('/logout', (req, res)=> {
  req.logOut();
  req.flash('success_msg', 'you are logout');
  res.redirect('/users/login');
});


module.exports = router;