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
   .then( (data) => {
            console.log('The access token expires in ' + data.body['expires_in']);
            console.log('The access token is ' + data.body['access_token']);
 
            // Save the access token so that it's used in future calls
            spotifyApi.setAccessToken(data.body['access_token']);
            
        })
        .catch( (err) => {
            console.log(err)
        })
} 

//Returns albums based on query
spotifyApi.findTracks = (album) => {
    const list = [];
    
    //The following accounts for if someone enters
    //"album" by "artist"
    //It also accounts for if the album or artist name is multiple words long
    var wordCount = album.split(' ');
    var by = -1;
    for(let j = 0; j < wordCount.length; j++)
    {
        if(wordCount[j] === 'by')
        {
            //Find the index where the word "by" is
            by = j;
            break;
        }
    }
    var artistName = "";
    var albumName = "";
    if(by!=-1)
    {
        //The artist name is everything after "by"
        for(let k = by+1; k < wordCount.length; k++)
        {
            artistName = artistName + wordCount[k];
            if((k+1)!=wordCount.length) 
                artistName+=" ";
        }
        //The album name is everything before "by"
        for(let x = 0; x < by; x++)
        {
            albumName = albumName + wordCount[x];
            if((x+1)!=by)
                albumName+=" ";
        }
    }
    else {
        albumName = album;
    }
    var searchString;
    if(artistName != '')
    {
        searchString = 'album:' + albumName + ' artist:' + artistName;
    }
    else
        searchString = 'album:' + albumName; 
    return spotifyApi.searchTracks(searchString, {type: 'album', limit: 25})
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

spotifyApi.newReleases = () => {
    var arr = [];
    return spotifyApi.getNewReleases({ limit : 4, offset: 0 })
    .then( (data) => {
        console.log(data.body);
        data.body.albums.items.forEach( (data) => {
        let alb = new Album({name: data.name, artist: data.artists[0].name, uri: data.uri, img: data.images[1].url});
        arr.push(alb);
        })
        return arr;
    }) 
    .catch( (err) => {
       console.log(err)
    })
}
exports.spotifyApi = spotifyApi;