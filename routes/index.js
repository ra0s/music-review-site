var express = require('express');
var router = express.Router();
const spotify = require('../public/javascripts/methods');
const User = require('../models/user');
const Review = require('../models/review');


router.use(function(req, res, next) {
  res.locals.title ="Orpheus";
  res.locals.currentUserId = req.session.userId;
  res.locals.currentUsername = req.session.username;
  next();
})

/* GET home page. */
router.get('/', function(req, res, next) {
  spotify.spotifyApi.initCredential();
  return spotify.spotifyApi.newReleases()
  .then( (albums) => {
    console.log(albums)
    var home_active = true;
    res.render('index', {albums, home_active});
  })
  .catch( (err) => {
    console.log(err);
  })
  
});

// LOGIN
router.get('/login', function(req, res, next) {
  res.render('login', {title: 'Log In'});
})

//Authenticate user
router.post('/login', function(req, res, next) {
  User.authenticate(req.body.username, req.body.password, (err, user) => {
    if(err || !user)
    {
      const next_err = new Error('username or password incorrect');
      next_err.status = 401;
      return next(next_err);
    }
    req.session.userId = user._id;
    req.session.username = req.body.username;
    return res.redirect('/');
  })
})

//Logout
router.get('/logout', function(req, res, next) {
  if(req.session)
  {
    res.locals.currentUserId = null;
    req.session.destroy((err) => {
      if(err) return next(err);
      return res.render('logout');
    });
    return res.render('logout');
  }

})

module.exports = router;
