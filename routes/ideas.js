const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');
/*{you can put any function you wuld like to, and another} adn we can add to any road we would like to pretect*/
 

// because we have no access to app change app to router:
//remove route '/idea' -> / because it will point to '/idea'

//Load schema - Idea model
require('../models/Idea');
const Idea = mongoose.model('ideas');

//Idea index page
router.get('/', ensureAuthenticated, (req, res)=>{
  Idea.find({user: req.user.id})
  .sort({date: 'desc'})
  .then(ideas => {
    res.render('ideas/index', {
      ideas:ideas
    });
  });
});

//add idea form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('ideas/add');
});
//Edit idea form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id})
  .then( idea =>{
    if(idea.user != req.user.id) {
      req.flash('error_msg', 'Not authorized');
      res.redirect('/ideas');
    }else {
      res.render('ideas/edit', {
      idea:idea
      });
    }
  });
  
});



//Process form
router.post('/', ensureAuthenticated, (req, res) => {
  /* 
  console.log(req.body);
  res.send('ok');
  */
 //simple server site validation
 let errors = [];
 if(!req.body.title) {
   errors.push({text:'Please add title'})
 }
 if(!req.body.details) {
  errors.push({text:'Please add some details'})
}
if(errors.length > 0) {
  res.render('/add', {
    errors: errors,
    title: req.body.title,
    details: req.body.details,
  });
} else {
  //res.send('passed');
  const newUser = {
    title: req.body.title,
    details: req.body.details,
    user: req.user.id
    //user: user.id
  }
  new Idea(newUser)
  .save()
  .then(idea => {
    req.flash('success_msg', 'Video Idea has been added');
    res.redirect('/ideas');
  });
}
});


//edit form process
router.put('/:id', ensureAuthenticated, (req, res)=> {
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    //new value
    idea.title = req.body.title;
    idea.details = req.body.details;

    idea.save()
    .then(idea => {
      req.flash('success_msg', 'Video Idea has been updated');
      res.redirect('/ideas');
    });
  });
  //res.send('PUT');
  /*https://www.npmjs.com/package/method-override*/
});

//delete idea as long as method is different URL can be the same
router.delete('/:id', ensureAuthenticated, (req, res)=> {
  //res.send('DELETE');
  Idea.deleteOne({_id: req.params.id})
  .then(()=>{
    req.flash('success_msg', 'Video Idea has been removed');
    res.redirect('/ideas');
  });
});

module.exports = router;