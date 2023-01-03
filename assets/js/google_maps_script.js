// Google Maps API Basic Construct

var map;
var service;
var infoWindow;
var currentPlace;
var searchInput = "places to study"
var markers = [];


// Google Maps API map initialization
function initialize() {

  currentPlace = { lat: 28.5384, lng: -81.3789 };

  map = new google.maps.Map(document.getElementById('map'), {
    center: currentPlace,
    zoom: 12
  });

  infoWindow = new google.maps.InfoWindow();

  function getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          currentPlace = pos;
          map.setCenter(pos);
          const infoWindow = new google.maps.InfoWindow({
            content: "Current Location",
          });
          const marker = new google.maps.Marker({
            position: pos,
            map: map,
            icon: {                             
              url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"}
          });
          infoWindow.open({
            anchor: marker,
            map,
          });
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

  // Called after getCurrentLocation and by Event Listener to display map markers and results
  function searchStudyPlaces(input) {
    console.log(currentPlace);
    var request = {
      location: currentPlace,
      radius: '1200',
      query: input
    };

    // Used to set and unset all markers on the map
    function setMapOnAll(map) {
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

    // Creates and sets infoWindows for all markers
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
        var placeAnchorEl = $("<a>").attr("href", placeURL).attr("target", "_blank");
        var placeliEl = $("<li>").html(`${placeName}`);
        placeAnchorEl.append(placeliEl);
        mapResultsList.append(placeAnchorEl);
      }
    }

    // Called by textSearch service function to retrive user results
    function callback(results, status) {
      deleteMarkers();
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          addMarker(results[i]);
        }
        setMapOnAll(map);
        listMapResults(results);
      }
    }

    // Google Map API Places service declaration and textSearch function
    service = new google.maps.places.PlacesService(map);
    service.textSearch(request, callback);

   }
  
   // Event listener to trigger food search based on user input
  $("#foodSearchBtn").click(function (e) { 
    e.preventDefault();
    searchInput = $("#foodSearchInput").val();
    searchStudyPlaces(searchInput);
  });


  // DOM listener to ensure map resize
  google.maps.event.addDomListener(window, "resize", function() {
    var center = map.getCenter();
    google.maps.event.trigger(map, "resize");
    map.setCenter(center); 
  });

};