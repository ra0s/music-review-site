var express = require('express');
var router = express.Router();
const User = require('../models/user');
const Review = require('../models/review');
const auth = require('../public/javascripts/auth');
require('dotenv').config();

// Users new
router.get('/new', (req, res, next) => {
  res.render('users/new', {title: 'Create Account'});
})

// Users create
router.post('/', (req, res, next) => {
  console.log(req.body);
  const user = new User(req.body);
  User.find({username: user.username}, function(err, users) {
    if(users.length > 0)
    {
      res.json( {result: 'Username not available'} ) 
    }
    else{
      user.save(function(err, user) {
        if(err) console.log(err);
        User.authenticate(req.body.username, req.body.password, (err, u) => {
          req.session.userId = user._id;
          req.session.username = req.body.username;
          res.json( {result: 'Successful'} );
        })
      })
    }
  })
});

//Get user profile
router.get('/profile', (req, res, next) => {
  User.findOne({username: req.query.user}, (err, user) => {
    var user_active = false;
    if(user.username == req.session.userame)
      user_active = true;
    if(err) { console.error(err) };
    Review.find({username: user.username}, (err, reviews) => {
    res.render('users/show', { user, reviews, title: user.username + '\'s reviews', user_active });
    })
  })
})

module.exports = router;