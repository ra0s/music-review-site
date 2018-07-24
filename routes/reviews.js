var express = require('express');
var router = express.Router();
const Review = require('../models/review');
const auth = require('../public/javascripts/auth');


router.get('/', function(req, res, next) {
    Review.find({}, 'album_name', function(err, reviews) {
        if(err)
        console.log(err)
        res.render('reviews/index', {reviews} );

    })
})

router.get('/new', auth.requireLogin, function(req, res, next) {
    res.render('reviews/new');
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