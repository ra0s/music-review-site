var express = require('express');
var router = express.Router();
const spotify = require('../public/javascripts/methods');

/* GET home page. */
router.get('/', function(req, res, next) {
  spotify.spotifyApi.initCredential();
  res.render('index', { title: 'Express' });
});

router.get('/reviews', function(req, res, next) {
  spotify.spotifyApi.findTracks()
  .then(function(result) {
    res.redirect('/');
  })
})
module.exports = router;
