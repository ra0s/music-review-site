var express = require('express');
var router = express.Router();
const Review = require('../models/review');
const Album = require('../models/album');
const auth = require('../public/javascripts/auth');


router.get('/', (req, res) => {
    //Displays all reviews(for now)
    //Sorted by date
    Review.find().sort({date: -1})
    .then( (reviews) => {
        var reviews_active = true;
        res.render('reviews/index', {reviews, title: 'Reviews', reviews_active} );
    })
    .catch( (err) => {
        console.log(err);
    })

})

router.post('/sort', (req, res) => {
    const sort_param = req.body.sort;
    var formData;
    if(sort_param == 1)
        formData = { date: -1};
    else if(sort_param == 2)
        formData = { date: 1};
    else if(sort_param == 3)
        formData = { rating: -1};
    else if(sort_param == 4)
        formData = { rating: 1};
    else if(sort_param == 5)
        formData = { album_name: 1};
    else if(sort_param == 6)
        formData = { album_name: -1};
    else if(sort_param == 7)
        formData = { artist_name: 1};
    else if(sort_param == 8)
        formData = { artist_name: -1};
    Review.find().sort(formData)
    .then( (reviews) => {
        res.json(reviews);
    })
    .catch( (err) => {
        console.log(err);
    })
} )

router.post('/new', auth.requireLogin, (req, res) => {
    var album = new Album({name: req.query.album, artist: req.query.artist, img: req.query.img, uri: req.query.uri});
    res.render('reviews/new', { album, title: 'New Review' });
})

router.post('/', (req, res) => {
    const review = new Review(req.body);
    review.username = req.session.username;
    var date = new Date();
    review.date = date;
    review.save(function(err, review) {
        if(err) console.log(err);
        return res.redirect('reviews/' + review._id);
    })
})

//Get reviews of a specific album
router.get('/album', (req, res) => {
    Review.find({album_name: req.query.name, artist_name: req.query.artist}, function(err, reviews) {
        var average = 0;
        for(let i = 0; i < reviews.length; i++)
            average+=reviews[i].rating;
        average/=reviews.length;
        average = Math.round(average*10)/10;
        res.render('reviews/album', {reviews, average, name: req.query.name, artist: req.query.artist, title: req.query.name + ' reviews'});
    })
});

router.get('/:id', (req, res) => {
    Review.findById(req.params.id, function(err, review) {
      if(err) { console.error(err) };
      res.render('reviews/show', { review, reviewId: req.params.id, title: 'Review of ' + review.album_name });

  });
});

router.get('/:id/edit', auth.requireLogin, (req, res) => {
    Review.findById(req.params.id, function(err, review) {
      if( (req.session.username != review.username) || err) 
      { console.error(err) }
      else
      {
        res.render('reviews/edit', { review });
      }
    });
});

router.post('/:id', auth.requireLogin, (req, res) => {
    Review.findByIdAndUpdate(req.params.id, req.body, function(err, review) {
      if(err) { console.error(err) };
      res.redirect('/reviews/' + req.params.id);
    });
  });

module.exports = router;