const TOKEN = get_BearerToken();
var GENRES_ARR;
var curGenre;

// Get Bearer Token
function get_BearerToken() {
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
      bearerToken = response.access_token;
      get_userInputsArray(bearerToken);
    },
    error: function (response) {
      console.log("ERROR BEARERTOKEN", response);
    }
  });
  return bearerToken;
}

// Get Genres Array
function get_userInputsArray(token) {
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
      console.log("ERROR TOKEN (getUserInput)", token);
      console.log("ERROR RESPONSE (getUserInput)", response);
    }
  });
}

//autocomplete for the music search bar
function autoComplete() {
  $("#musicSearch").children("input").autocomplete({
    source: GENRES_ARR,
  });
}

// Gets List of tracks based on selected genre
function get_Tracks(token, genresArr) {
  var chosenGenre = get_userInput(genresArr);
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
      curTrackList = response.tracks;
      get_TrackId(curTrackList);
    },
    error: function (response) {
      console.log("ERROR RESPONSE (getTracks)", response);
    }
  });
}

//seperate call for ensuring same genre from prev search
function new_Track(token) {
  $.ajax({
    type: "GET",
    url: "https://api.spotify.com/v1/recommendations",
    headers: {
      'Authorization': "Bearer " + token
    },
    data: {
      seed_genres: curGenre // from saved genre
    },
    contentType: "application/json",
    async: false,
    dataType: "json",
    success: function (response) {
      curTrackList = response.tracks;
      get_TrackId(curTrackList);
    },
    error: function (response) {
      console.log("ERROR RESPONSE (newTrack)", response);
    }
  });
}

//choose a genre from user's input
function get_userInput() {
  var userInput = $("#musicSearch").children("input").val();
  curGenre = userInput;
  return userInput;
}


//gets trackID from chosen tracks array
function get_TrackId(tracks) {
  var randomNum = Math.floor(Math.random() * 20);
  track_id = tracks[randomNum].id;
  appendTrack(track_id);
};

// Creates iFrame element with dynamically selected track id
function appendTrack(track_id) {
  var track_embed = `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/${track_id}?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`;
  $("#music-player").empty();
  $("#curGenre").text( /**"Current Genre: " + */ curGenre);
  $("#music-player").append(track_embed);
}

//EventListener for search music button
$("#musicSearch").children("button").click(function () {
  var input = $("#musicSearch").children("input").val();
  if ((GENRES_ARR.includes(input))) {
    //get song
    get_Tracks(TOKEN, GENRES_ARR);

    // show player on screen -- Manny
    $(`#nowPlaying`).removeClass(`invisible`);
    $(`#mapContain`).removeClass(`invisible`);
    $(`#foodSearch`).removeClass(`invisible`);
    $(`#listResults`).removeClass(`invisible`);

  } else {
    alert("The genre you entered is invalid. Please choose a genre as suggested by the auto-complete dropdown menu, which displays while you type.");
  }

})


// event listener for change track button
$("#changeTrack").click(function () {
  new_Track(TOKEN);
})




