var express = require('express');
var router = express.Router();
var request = require('request');
const spotify = require('../public/javascripts/methods');
const User = require('../models/user');
const Review = require('../models/review');

router.get('/', function(req, res, next) {
    res.render('search/index');
})

router.post('/results', function(req, res, next) {
    console.log(req.body);
    spotify.spotifyApi.findTracks(req.body.album)
    .then(function(albums) {
        res.render('search/results', {albums});
    })
    .catch((err) => {
        console.log(err);
    })
    
})
module.exports = router;