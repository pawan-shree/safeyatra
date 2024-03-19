mapboxgl.accessToken = 'pk.eyJ1Ijoic2hyZWVwYXdhbiIsImEiOiJjbHR4M2ZrcjgwMjlvMmlwa2NmaWM5Z244In0.5aC6KoZ7rAkqlQ1bzosuuA';

var map;
var directions;
var startButton = document.getElementById('startButton');
var trackingStarted = false;
var startLocation = null;
var marker; // Declare marker variable

navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
    enableHighAccuracy: true,
});

function successLocation(position) {
    startLocation = [position.coords.longitude, position.coords.latitude];
    setupMap(startLocation);
}

function errorLocation() {
    setupMap([75.7139, 19.7515]);
}

function setupMap(center) {
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v12',
        center: center,
        zoom: 15
    });

    const nav = new mapboxgl.NavigationControl();
    map.addControl(nav);

    directions = new MapboxDirections({
        accessToken: mapboxgl.accessToken,
        unit: 'metric',
        controls: {
            inputs: true,
            instructions: false
        },
        interactive: true // Enables user interaction for selecting origin (point A)
    });

    // Set the starting point to the current location by default
    directions.setOrigin(startLocation);

    map.addControl(directions, 'top-left');

    startButton.addEventListener('click', function() {
        if (!trackingStarted) {
            startTracking();
            startButton.textContent = "Stop Tracking";
        } else {
            stopTracking();
            startButton.textContent = "Start Tracking";
        }
    });
}

function startTracking() {
    var geolocate = new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true
    });

    map.addControl(geolocate);

    geolocate.on('geolocate', function (e) {
        var lon = e.coords.longitude;
        var lat = e.coords.latitude;
        updateMarker([lon, lat]);
    });

    trackingStarted = true;
}

function stopTracking() {
    var controls = map._controls;
    for (var i = 0; i < controls.length; i++) {
        if (controls[i] instanceof mapboxgl.GeolocateControl) {
            map.removeControl(controls[i]);
            break;
        }
    }

    trackingStarted = false;
}

function updateMarker(coordinates) {
    if (!marker) {
        marker = new mapboxgl.Marker()
            .setLngLat(coordinates)
            .addTo(map);
    } else {
        marker.setLngLat(coordinates);
    }
}
