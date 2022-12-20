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
  const orlando = { lat: 28.5384, lng: -81.3789 };
  map = new google.maps.Map(document.getElementById("map"), {
    center: orlando,
    zoom: 10,
  });

   // Create the places service.
   const service = new google.maps.places.PlacesService(map);
   let getNextPage;
   const moreButton = document.getElementById("more");
 
   moreButton.onclick = function () {
     moreButton.disabled = true;
     if (getNextPage) {
       getNextPage();
     }
   };

  // Add info Window
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

 // Perform a nearby search.
 service.nearbySearch(
  { location: orlando, radius: 500, type: "store" },
  (results, status, pagination) => {
    if (status !== "OK" || !results) return;

    addPlaces(results, map);
    moreButton.disabled = !pagination || !pagination.hasNextPage;
    if (pagination && pagination.hasNextPage) {
      getNextPage = () => {
        // Note: nextPage will call the same handler function as the initial call
        pagination.nextPage();
      };
    }
  }
);
}

function addPlaces(places, map) {
const placesList = document.getElementById("places");

for (const place of places) {
  if (place.geometry && place.geometry.location) {
    const image = {
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25),
    };

    new google.maps.Marker({
      map,
      icon: image,
      title: place.name,
      position: place.geometry.location,
    });

    const li = document.createElement("li");

    li.textContent = place.name;
    placesList.appendChild(li);
    li.addEventListener("click", () => {
      map.setCenter(place.geometry.location);
    });
  }
  }
};

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
