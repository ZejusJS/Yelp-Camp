mapboxgl.accessToken = mapboxt;

const showMap = document.querySelector('#show-map')
const mapContainer = document.querySelector('#map')
const textShowMap = document.querySelector('#show-map span')
const showMapLoading = document.querySelector('#show-map .spinner-border')
let clicked = false;

showMap.addEventListener('click', function () {
    if (clicked == false) {
        clicked = true
        mapContainer.style.display = "block";
        showMap.disabled = true;
        showMap.style.pointerEvents = 'none';
        textShowMap.remove();
        showMapLoading.style.display = "inline-block"


        const map = new mapboxgl.Map({
            container: 'map', // container ID
            style: 'mapbox://styles/mapbox/streets-v12', // style URL
            center: campgroundGeo.coordinates, // starting position [lng, lat]
            zoom: 9, // starting zoom
        });

        // Define bounds that conform to the `LngLatBoundsLike` object.
        const bounds = [
            [-131.50, 10.48], // [west, south]
            [-47.656, 53.53]  // [east, north]
        ];
        // Set the map's max bounds.
        // map.setMaxBounds(bounds);

        const marker = new mapboxgl.Marker() // dá tam marker
            .setLngLat(campgroundGeo.coordinates)
            .setPopup(
                new mapboxgl.Popup({ offset: 25 })
                    .setHTML(`<h2 style="color: black;">${campgroundInfo.title}</h2><p style="color: black;">${campgroundInfo.location}</p>`)
            )
            .addTo(map);

        // Initialize the GeolocateControl.
        const geolocate = new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: true
        });
        // Add the control to the map.
        map.addControl(geolocate);
        // Set an event listener that fires
        // when a trackuserlocationend event occurs.
        geolocate.on('trackuserlocationend', () => {

        });

        map.addControl(new mapboxgl.NavigationControl());

        map.on('idle', function () {
            showMap.classList.add('hide-showmap');
            mapContainer.classList.add("map-showed");
            showMapLoading.remove();
        })

        setInterval(() => {
            map.resize()
        }, 150);
    }
})