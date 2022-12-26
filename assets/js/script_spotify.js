/**
 * To save time with the autocomplete function, I have
 * refactored the code so that a token is generated on page
 * refresh and saved, which will then be used in calls when searching for
 * music.
 * However, this may not be a good solution for security reasons. If we would rather
 * save the array of 126 genres into an object manually instead of recieving them from the function call,
 * let me know and we can discuss refactor.
 * -- Hailey F, 12/26/22
 */
const TOKEN = get_BearerToken();
var GENRES_ARR;

// Get Bearer Token
function get_BearerToken(){
  const client_id_key = '05757d0b060a45a58d9564f0534bbbd1';
  const client_secret_key = 'f4461ae240424201b6e5ac3ff19f48e6';
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
      GENRES_ARR = get_genresArray(bearerToken);  
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
      GENRES_ARR = response.genres;
      autoComplete();
    },
    error: function (response) {
      console.log("error", token);
      console.log("error", response);
    } 
  });
}

function autoComplete(){
  $("#musicSearch").children("input").autocomplete({
    source: GENRES_ARR,
  });
}

// Gets List of tracks based on selected genre
function get_Tracks(token, genresArr){
  var chosenGenre = get_Genre(genresArr);
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
      curTrackList = response.tracks;
      console.log("TRACKS", curTrackList);
      get_TrackId(curTrackList);
    },
    error: function(response){
      console.log("error", response);
    }
  });
}

//choose a genre from user's input (randomly generates for now)
function get_Genre(){
  var userInput = $("#musicSearch").children("input").val();
  console.log("userInput", userInput);
  //TODO: get the user's input to choose a genre
    // I believe we were talking about using a dropdown menu on the HTML side? -- Hailey F.
  

  //substitute: generates random genre
  // var randomNum = Math.floor(Math.random() * 126);
  // console.log("randomNum", randomNum);
  // console.log("genreChosen", genresArr.genres[randomNum]);
  return userInput;
}


//gets trackID from chosen tracks array
function get_TrackId(tracks) {
  var randomNum = Math.floor(Math.random() * 20);
  console.log(randomNum);
  track_id = tracks[randomNum].id;
  appendTrack(track_id);
};

// Creates iFrame element with dynamically selected track id
function appendTrack(track_id){
  var track_embed = `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/${track_id}?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`;
  $("#music-player").empty();
  $("#music-player").append(track_embed);
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


//EventListener for search music button
$("#musicSearch").children("button").click(function(){
  get_Tracks(TOKEN, GENRES_ARR);
})


//event listener for change track button
$("#changeTrack").click(function(){
  get_Tracks(TOKEN,GENRES_ARR);
})




