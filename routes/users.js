var express = require('express');
var router = express.Router();
const User = require('../models/user');
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
  res.render('users/new');
})

// Users create
router.post('/', (req, res, next) => {
  console.log(req.body);
  const user = new User(req.body);

  user.save(function(err, user) {
    if(err) console.log(err);
    return res.redirect('/login');
  });
})

module.exports = router;