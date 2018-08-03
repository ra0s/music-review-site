var express = require('express');
var router = express.Router();
const Review = require('../models/review');
const Album = require('../models/album');
const auth = require('../public/javascripts/auth');


router.get('/', function(req, res, next) {
    //Displays all reviews(for now)
    Review.find().sort({date: -1})
    .then( (reviews) => {
        //Put recent reviews at the top
        // let sorted = [];
        // for(let i = reviews.length-1; i >= 0; i--)
        // {
        //     sorted.push(reviews[i])
        // }
        res.render('reviews/index', {reviews, title: 'Reviews'} );

    })
    .catch( (err) => {
        console.log(err);
    })

})

router.post('/new', auth.requireLogin, function(req, res, next) {
    var album = new Album({name: req.query.album, artist: req.query.artist, img: req.query.img, uri: req.query.uri});
    console.log("Album Info: " + album);
    res.render('reviews/new', { album, title: 'New Review' });
})

router.post('/', (req, res, next) => {
    console.log(req.body);
    const review = new Review(req.body);
    review.username = req.session.username;
    console.log(review.username);
    var date = new Date();
    review.date = date;
    review.save(function(err, review) {
        if(err) console.log(err);
        return res.redirect('reviews/' + review._id);
    })
})

//Get reviews of a specific album
router.get('/album', function(req, res, next) {
    console.log("GET ALBUM + NAME");
    console.log(req.query.name);
    Review.find({album_name: req.query.name, artist_name: req.query.artist}, function(err, reviews) {
        console.log(reviews.length);
        res.render('reviews/album', {reviews, name: req.query.name, artist: req.query.artist, title: req.query.name + ' reviews'});
    })
});

router.get('/:id', (req, res, next) => {
    Review.findById(req.params.id, function(err, review) {
      if(err) { console.error(err) };
      res.render('reviews/show', { review, reviewId: req.params.id, title: 'Review of ' + review.album_name });

  });
});

module.exports = router;