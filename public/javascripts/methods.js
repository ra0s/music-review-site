const SpotifyWebApi = require('spotify-web-api-node');
const Album = require('../../models/album')
require('dotenv').config();

var spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENTID,
    clientSecret: process.env.CLIENTSECRET,
 });

 //Get authorization to use API
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

//Returns albums based on query
spotifyApi.findTracks = (album) => {
    const list = [];
    //Returns list of albums
    return spotifyApi.searchTracks('album:' + album, {type: 'album', limit: 25})
    .then((data) => {
        //Push all found albums into array
        data.body.albums.items.forEach((data) => {
            let alb = new Album({name: data.name, artist: data.artists[0].name, uri: data.uri, img: data.images[1].url});
            list.push(alb);
        })

        //Remove duplicates (explicit/clean versions are counted as the same thing)
        //Credit to https://stackoverflow.com/a/2219024 for this code
        var temp = [];
        for ( var i=0; i < list.length; i++ )
            temp[list[i]['artist']] = list[i];
        
        var newList = new Array();
        for ( var key in temp )
            newList.push(temp[key]);
        return newList;
    })
    .catch((err) => { console.log(err);})
}
exports.spotifyApi = spotifyApi;