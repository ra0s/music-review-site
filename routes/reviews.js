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
    var album = new Album({name: req.query.album, artist: req.query.artist, img: req.query.img, uri: req.query.uri});
    console.log("Album Info: " + album);
    res.render('reviews/new', { album });
})

router.post('/', (req, res, next) => {
    console.log(req.body);
    const review = new Review(req.body);
    review.save(function(err, review) {
        if(err) console.log(err);
        return res.redirect('reviews/' + review._id);
    })
})

router.get('/:id', (req, res, next) => {
    Review.findById(req.params.id, function(err, review) {

      if(err) { console.error(err) };
      res.render('reviews/show', { review, reviewId: req.params.id });

  });
});



module.exports = router;