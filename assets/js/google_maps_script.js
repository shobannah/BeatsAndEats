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
    zoom: 10
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
      setInfoWindow(marker, result);
    }

    function deleteMarkers() {
      setMapOnAll(null);
      markers = [];
    }

    function setInfoWindow(passMarker, passResult) {
      let encodedName = encodeURI(passResult.name);
      var contentString = 
      '<div id="content">' +
      '<h1 id="firstHeading" class="firstHeading" style="font-size:14px">' + 
      "<b>Navigate to:</b>" +
      '</h1>' +
      '<div id="bodyContent">' +
      "<a href=" +
      `https://www.google.com/maps/search/?api=1&query=${encodedName}&query_place_id=${passResult.place_id}` +
      ' style="color:blue; text-decoration:underline">' +
      "<h1>" +
      passResult.name; +
      "</h1>" + 
      "</a>" +
      "</div>";
      var infoWindow = new google.maps.InfoWindow({
        content: contentString,
      });
      passMarker.addListener("click", () => {
        infoWindow.open({
          anchor: passMarker,
          map,
        });
      });
    }

    // Function recives arguments from callback function to set title and list of results on webpage
    function listMapResults(passResults) {
      var mapResultsList =  $("#mapResultsList");
      mapResultsList.empty();
      $("#resultsTitle").html(`Currently showing results for ${searchInput}:`);
      for (let i = 0; i < passResults.length; i++) {
        var placeName = passResults[i].name;
        let encodedName = encodeURI(passResults[i].name);
        var placeURL = `https://www.google.com/maps/search/?api=1&query=${encodedName}&query_place_id=${passResults[i].place_id}`
        var placeAnchorEl = $("<a>").attr("href", placeURL)
        var placeliEl = $("<li>").html(`${placeName} (${placeURL})`);
        placeAnchorEl.append(placeliEl);
        mapResultsList.append(placeAnchorEl);
      }
    }

    function callback(results, status) {
      deleteMarkers();
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        console.log(results);
        for (var i = 0; i < results.length; i++) {
          addMarker(results[i]);
        }
        setMapOnAll(map);
        listMapResults(results);
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