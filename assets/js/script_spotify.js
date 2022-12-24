var client_id_key = '05757d0b060a45a58d9564f0534bbbd1';
var client_secret_key = 'f4461ae240424201b6e5ac3ff19f48e6';
var token;
var tracks;
var track_id;

// Get Bearer Token
function get_BearerToken(){
  var bearerToken;
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
      bearerToken = response.access_token;
      console.log("bearerToken", bearerToken);
      get_genresArray(bearerToken);     
    },
    error: function (response) {
      console.log("ERROR BEARERTOKEN", response);
    }
  });
  return bearerToken;
}

// Get Genres Array
function get_genresArray(token){
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
      console.log("genreArray token", token);
      console.log("genreArray response", response);
      get_Tracks(token, response);
    },
    error: function (response) {
      console.log("error", token);
      console.log("error", response);
    } 
  });
}

// Gets List of tracks based on selected genre
function get_Tracks(token, genresArr){
  var chosenGenre = getGenre(genresArr);
  $.ajax({
    type: "GET",
    url: "https://api.spotify.com/v1/recommendations",
    headers: {
      'Authorization': "Bearer " + token
    },
    data: {
      seed_genres: chosenGenre // dynamic variable set by user input
    },
    contentType: "application/json",
    async: false,
    dataType: "json",
    success: function (response) {
      console.log("GET TRACKS", response);
      tracks = response.tracks;
      console.log("TRACKS", tracks);
      getTrackId(tracks);
    },
    error: function(response){
      console.log("error", response);
    }
  });
}

//choose a genre from user's input (randomly generates for now)
function getGenre(genresArr){
  //TODO: get the user's input to choose a genre
    // I believe we were talking about using a dropdown menu on the HTML side? -- Hailey F.
    // [code here]

  //substitute: generates random genre
  var randomNum = Math.floor(Math.random() * 126);
  console.log("randomNum", randomNum);
  console.log("genreChosen", genresArr.genres[randomNum]);
  return genresArr.genres[randomNum];
}

// window.onSpotifyIframeApiReady = (IFrameAPI) => {
//   // 
//   var randomNum = Math.floor(Math.random() * 20);
//   console.log(randomNum);
//   var track_selected = tracks[randomNum].uri;
//   console.log(track_selected);
//   let element = document.getElementById('embed-iframe');
//   let options = {
//       uri: track_selected
//     };
//   let callback = (EmbedController) => {};
//   IFrameAPI.createController(element, options, callback);
// };

//gets trackID from chosen tracks array
function getTrackId(tracks) {
  var randomNum = Math.floor(Math.random() * 20);
  console.log(randomNum);
  track_id = tracks[randomNum].id;
};


get_BearerToken();


// Creates iFrame element with dynamically selected track id
var track_embed = `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/${track_id}?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`

$("#music-player").append(track_embed);