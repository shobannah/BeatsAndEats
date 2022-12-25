// Google Maps API Basic Construct

var map;
var service;
var infoWindow;
var currentPlace;

function initialize() {

  currentPlace = { lat: 28.5384, lng: -81.3789 };

  map = new google.maps.Map(document.getElementById('map'), {
    center: currentPlace,
    zoom: 15
  });

  infoWindow = new google.maps.InfoWindow();

  function getCurrentLocation() {
    console.log("Getting current location");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          currentPlace = pos;
          console.log(currentPlace);
          map.setCenter(pos);
          searchStudyPlaces();
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
      searchStudyPlaces();
    }
  }

  getCurrentLocation();

  function searchStudyPlaces() {
    console.log(currentPlace);
    var request = {
      location: currentPlace,
      radius: '1200',
      query: 'places to study'
    };

    function createMarker(place) {
      console.log(place.name);
      new google.maps.Marker({
        tile: place.name,
        position: place.geometry.location,
        map: map
      });
    }

    function callback(results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          var place = results[i];
          createMarker(results[i]);
        }
      }
    }

    service = new google.maps.places.PlacesService(map);
    service.textSearch(request, callback);
  }

};