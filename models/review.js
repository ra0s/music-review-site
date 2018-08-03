const mongoose = require('mongoose');
const User = require('../models/user')
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    album_name: {type: String, required: true},
    artist_name: { type: String, required: true },
    review: { type: String, required: true },
    rating: { type: Number, required: true },
    summary: {type: String, required: true},
    img: {type: String},
    uri: {type: String},
    username: {type: String, required: true},
    date: {type: Date, required: true}
});
  
const Review = mongoose.model('Review', ReviewSchema);
module.exports = Review;