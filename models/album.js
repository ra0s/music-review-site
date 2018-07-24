const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AlbumSchema = new Schema({
    name: {type: String, required: true},
    artist: {type: String, required: true},
    uri: {type: String},
    img: {type: String},
    reviews: {type: Array, ref: 'Reviews'},
})

const Album = mongoose.model('Album', AlbumSchema);
module.exports = Album;