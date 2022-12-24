/**
 * TODO:
 * Need assistance to properly get API requests,
 * having trouble figuring out what to do
 * -- Hailey F 12/17/22
 */

var client_id_key = '05757d0b060a45a58d9564f0534bbbd1';
var client_secret_key = 'f4461ae240424201b6e5ac3ff19f48e6';
var token;
var tracks;
var track_id;


// Get Bearer Token
$.ajax({
  type: "POST",
  url: "https://accounts.spotify.com/api/token",
  // headers: { 
  //   'Authorization': 'Basic ' + (client_id + ':' + client_secret).toString('base64')
  // },
  data: {
    grant_type: 'client_credentials',
    json: true,
    client_id: client_id_key,
    client_secret: client_secret_key
  },
  dataType: "json",
  async: false,
  success: function (response) {
    console.log(response);
    token = response.access_token;
    console.log(token);
    return token;
  },
  error: function (response) {
    console.log(response);
  }
});

// Get Genres Array
$.ajax({
  type: "GET",
  url: "https://api.spotify.com/v1/recommendations/available-genre-seeds",
  headers: {
    'Authorization': "Bearer " + token
  },
  contentType: "application/json",
  async: false,
  dataType: "json",
  success: function (response) {
    console.log(token);
    console.log(response);
  },
  error: function (response) {
    console.log(token);
    console.log(response);
  }
});

// Gets List of tracks based on selected genre
$.ajax({
  type: "GET",
  url: "https://api.spotify.com/v1/recommendations",
  headers: {
    'Authorization': "Bearer " + token
  },
  data: {
    seed_genres: "alternative" // dynamic variable set by user input
  },
  contentType: "application/json",
  async: false,
  dataType: "json",
  success: function (response) {
    console.log(response);
    tracks = response.tracks;
    console.log(tracks);
  }
});

function getTrackId() {
  var randomNum = Math.floor(Math.random() * 20);
  console.log(randomNum);
  track_id = tracks[randomNum].id;
};

getTrackId();

// Creates iFrame element with dynamically selected track id
var track_embed = `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/${track_id}?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`

$("#music-player").append(track_embed);