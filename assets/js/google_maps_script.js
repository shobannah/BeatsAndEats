// Google Maps API Basic Construct

var map;
var service;
var infoWindow;
var currentPlace;
var searchInput = "places to study"
var markers = [];

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
          searchStudyPlaces(searchInput);
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

  function searchStudyPlaces(input) {
    console.log(currentPlace);
    var request = {
      location: currentPlace,
      radius: '1200',
      query: input
    };

    function setMapOnAll(map) {
      console.log(markers);
      markers.forEach(element => {
        element.setMap(map);
      });

    }

    function addMarker(result) {
      const marker = new google.maps.Marker({
        position: result.geometry.location,
        map,
      });
    
      markers.push(marker);
    }

    function deleteMarkers() {
      setMapOnAll(null);
      markers = [];
    }

    function callback(results, status) {
      deleteMarkers();
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        console.log(results);
        for (var i = 0; i < results.length; i++) {
          addMarker(results[i]);
        }
        setMapOnAll(map);
      }
    }


    service = new google.maps.places.PlacesService(map);
    service.textSearch(request, callback);
  }

  $("#foodSearchBtn").click(function (e) { 
    e.preventDefault();
    searchInput = $("#foodSearchInput").val();
    console.log(searchInput);
    searchStudyPlaces(searchInput);
  });

};