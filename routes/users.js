var express = require('express');
var router = express.Router();
const User = require('../models/user');
const Review = require('../models/review');
const auth = require('../public/javascripts/auth');
require('dotenv').config();
/* GET users listing. */
router.get('/', auth.requireLogin, (req, res, next) => {
  User.find({}, 'username', function(err, users) {
    if(err) {
      console.error(err);
    } else {
      res.render('users/index', { users });
    }
  });
});

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
      var err = new Error('Username not available');
      err.status = 400;
      return next(err);
      
    }
    else{
      user.save(function(err, user) {
        if(err) console.log(err);
        return res.redirect('/login');
      });
    }
    
  })
})

router.get('/profile', (req, res, next) => {
  User.findOne({username: req.query.user}, (err, user) => {
    console.log(req.query.user);
    console.log(user.length);
    if(err) { console.error(err) };
    Review.find({username: user.username}, (err, reviews) => {
    res.render('users/show', { user, reviews, title: user.username + ' \'s reviews' });
    })
  })
})

module.exports = router;