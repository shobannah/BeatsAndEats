// Google Maps API Basic Construct
 // requires HTML div element with an id of "map" and a linking script
 /* ex script line: 
 <script async
 src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap">
 </script> */
 /* requires following styling:
     <style>
         #map {
         height: 100%;
         }
         html, body {
         height: 100%;
         margin: 0;
         padding: 0;
         }
     </style>
 */

// let map;

// function initMap() {
//     map = new google.maps.Map(document.getElementById("map"), {
//     center: { lat: -34.397, lng: 150.644 },
//     zoom: 8,
//     });
//     var transitLayer = new google.maps.TransitLayer();
//     transitLayer.setMap(map);
// }


// window.initMap = initMap;

// // Cleaner, more modular construct
// var lat = 51.5;
// var lon = -0.11;
// var mapOptions = {
//    zoom: 13,
//    center: new google.maps.LatLng(lat,lon)
// }

// function initMap() {
//     map = new google.maps.Map(document.getElementById("map"), mapOptions); 
// }

// window.initMap = initMap;
 
let map, infoWindow;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 28.5384, lng: -81.3789 },
    zoom: 10,
  });
  infoWindow = new google.maps.InfoWindow();

  const locationButton = document.createElement("button");

  locationButton.textContent = "Pan to Current Location";
  locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  locationButton.addEventListener("click", () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          infoWindow.setPosition(pos);
          infoWindow.setContent("Location found.");
          infoWindow.open(map);
          map.setCenter(pos);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}

window.initMap = initMap;
