var express = require('express');
var router = express.Router();
const Review = require('../models/review');
const Album = require('../models/album');
const auth = require('../public/javascripts/auth');


router.get('/', function(req, res, next) {
    Review.find({}, function(err, reviews) {
        if(err)
        console.log(err)
        res.render('reviews/index', {reviews} );

    })
})

router.post('/new', auth.requireLogin, function(req, res, next) {
    // var alb = JSON.stringify(req.query.album);
    // alb = JSON.parse(alb);  
    
   // var alb = new Album({name: req.query.album.name, artist: req.query.album.artist, uri: req.query.album.uri, img: req.query.album.img, reviews: req.query.album.reviews });
    var alb = new Album({name: req.query.album, artist: req.query.artist, img: req.query.img, uri: req.query.uri});
    console.log("THIS IS ALB: " + alb);
    res.render('reviews/new', {album: alb});
})

router.post('/', (req, res, next) => {
    console.log(req.body);
    const review = new Review(req.body);
    review.save(function(err, review) {
        if(err) console.log(err);
        return res.redirect('/');
    })
})

module.exports = router;