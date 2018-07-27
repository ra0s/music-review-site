//This mostly acts as a class to create Album objects. As of right now
//they are not saved to the database

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AlbumSchema = new Schema({
    name: {type: String, required: true},
    artist: {type: String, required: true},
    uri: {type: String},
    img: {type: String},
})

const Album = mongoose.model('Album', AlbumSchema);
module.exports = Album;