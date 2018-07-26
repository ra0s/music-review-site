const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    album_name: {type: String, required: true},
    artist_name: { type: String, required: true },
    review: { type: String, required: true },
    rating: { type: String, required: true },
    summary: {type: String, required: true},
    user: {type: Schema.Types.ObjectId, ref: 'User'},
});
  
const Review = mongoose.model('Review', ReviewSchema);
module.exports = Review;