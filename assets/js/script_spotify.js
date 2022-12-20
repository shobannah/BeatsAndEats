/**
 * TODO:
 * Need assistance to properly get API requests,
 * having trouble figuring out what to do
 * -- Hailey F 12/17/22
 */

var client_id = '05757d0b060a45a58d9564f0534bbbd1';
var client_secret = 'f4461ae240424201b6e5ac3ff19f48e6';

var authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': 'Basic ' + ((client_id + ':' + client_secret).toString('base64'))
  },
  form: {
    grant_type: 'client_credentials'
  },
  json: true
};



// request.post(authOptions, function(error, response, body) {
//   if (!error && response.statusCode === 200) {
//     var token = body.access_token;
//     console.log(token);
//   }
// });

fetch("https://api.spotify.com/v1/", authOptions)
  .then(function(response){
    return response.json();
  })
  .then(function(data){
    console.log(data);
  })

