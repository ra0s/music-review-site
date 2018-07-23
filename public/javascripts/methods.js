const SpotifyWebApi = require('spotify-web-api-node');
require('dotenv').config();

var spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENTID,
    clientSecret: process.env.CLIENTSECRET,
 });

spotifyApi.initCredential = function() {
   spotifyApi.clientCredentialsGrant()
   .then(
       function (data) {
            console.log('The access token expires in ' + data.body['expires_in']);
            console.log('The access token is ' + data.body['access_token']);
 
            // Save the access token so that it's used in future calls
            spotifyApi.setAccessToken(data.body['access_token']);
        })
        .catch( function(err) {
            console.log(err)
        })
} 

//Returns albums that show up
spotifyApi.findTracks = () => {
    const tracklist = [];
    return spotifyApi.searchTracks('album:scorpion', {limit: 50})
    .then((data) => {
        data.body.tracks.items.forEach((data) => {
            console.log(data.album.name);
        })
    })
    .catch((err) => { console.log(err);})
}

exports.spotifyApi = spotifyApi;