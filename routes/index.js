var express = require('express');
var router = express.Router();
const spotify = require('../public/javascripts/methods');
const User = require('../models/user');
const Review = require('../models/review');


router.use(function(req, res, next) {
  res.locals.title ="music-review-site";
  res.locals.currentUserId = req.session.userId;
  next();
})
/* GET home page. */
router.get('/', function(req, res, next) {
  spotify.spotifyApi.initCredential();
  res.render('index');
});


router.get('/login', function(req, res, next) {
  res.render('login');
})

router.post('/login', function(req, res, next) {
  User.authenticate(req.body.username, req.body.password, (err, user) => {
    if(err || !user)
    {
      const next_err = new Error('username or password incorrect');
      next_err.status = 401;
      return next(next_err);
    }
    req.session.userId = user._id;
    return res.redirect('/');
  })
})

router.get('/logout', function(req, res, next) {
  if(req.session)
  {
    req.session.destroy((err) => {
      if(err) return next(err);
    });
  }
  return res.redirect('/');
})

module.exports = router;
