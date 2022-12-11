try {
    mapboxgl.accessToken = mapboxt;

    const urlParams = new URLSearchParams(location.search);
    const search = urlParams.get('search');
    const stype = urlParams.get('stype');
    let dataUrl = '/campgrounds_map_data';
    if (search && search.length > 0) {
        dataUrl = dataUrl + `?search=${search}`;
    }
    if (stype && stype.length > 0 && search && search.length > 0) {
        dataUrl = dataUrl + `&stype=${stype}`;
    }
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
                container: 'map',
                // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
                style: 'mapbox://styles/mapbox/light-v10',
                center: [-3.152065617606258, 35.26859209417905],
                zoom: 0.2
            });

            map.on('load', () => {
                // Add a new source from our GeoJSON data and
                // set the 'cluster' option to true. GL-JS will
                // add the point_count property to your source data.
                map.addSource('campgrounds', {
                    type: 'geojson',
                    // Point to GeoJSON data. This example visualizes all M1.0+ campgrounds
                    // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
                    data: dataUrl,
                    cluster: true,
                    clusterMaxZoom: 14, // Max zoom to cluster points on
                    clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
                });

                map.addLayer({
                    id: 'clusters',
                    type: 'circle',
                    source: 'campgrounds',
                    filter: ['has', 'point_count'],
                    paint: {
                        // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
                        // with three steps to implement three types of circles:
                        //   * Blue, 20px circles when point count is less than 100
                        //   * Yellow, 30px circles when point count is between 100 and 750
                        //   * Pink, 40px circles when point count is greater than or equal to 750
                        'circle-color': [
                            'step',
                            ['get', 'point_count'],
                            '#8ecae6',
                            10,
                            '#219ebc',
                            20,
                            '#ffb703'
                        ],
                        'circle-radius': [
                            'step',
                            ['get', 'point_count'],
                            21,
                            10,
                            24,
                            20,
                            29
                        ]
                    }
                });

                map.addLayer({
                    id: 'cluster-count',
                    type: 'symbol',
                    source: 'campgrounds',
                    filter: ['has', 'point_count'],
                    layout: {
                        'text-field': ['get', 'point_count_abbreviated'],
                        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                        'text-size': 12
                    }
                });

                map.addLayer({
                    id: 'unclustered-point',
                    type: 'circle',
                    source: 'campgrounds',
                    filter: ['!', ['has', 'point_count']],
                    paint: {
                        'circle-color': '#11b4da',
                        'circle-radius': 9.5,
                        'circle-stroke-width': 2,
                        'circle-stroke-color': '#fff'
                    }
                });

                // inspect a cluster on click
                map.on('click', 'clusters', (e) => {
                    const features = map.queryRenderedFeatures(e.point, {
                        layers: ['clusters']
                    });
                    const clusterId = features[0].properties.cluster_id;
                    map.getSource('campgrounds').getClusterExpansionZoom(
                        clusterId,
                        (err, zoom) => {
                            if (err) return;

                            map.easeTo({
                                center: features[0].geometry.coordinates,
                                zoom: zoom
                            });
                        }
                    );
                });

                // When a click event occurs on a feature in
                // the unclustered-point layer, open a popup at
                // the location of the feature, with
                // description HTML from its properties.
                map.on('click', 'unclustered-point', (e) => {
                    const coordinates = e.features[0].geometry.coordinates.slice();
                    const title = e.features[0].properties.title;
                    const id = e.features[0].properties._id;
                    const location = e.features[0].properties.location;

                    // Ensure that if the map is zoomed out such that
                    // multiple copies of the feature are visible, the
                    // popup appears over the copy being pointed to.
                    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                    }

                    new mapboxgl.Popup()
                        .setLngLat(coordinates)
                        .setHTML(
                            `<h5>${title}</h5><p>${location}</p><a href="/campgrounds/${id}" target="_blank">More info</a>`
                        )
                        .addTo(map);
                });

                map.on('mouseenter', 'clusters', () => {
                    map.getCanvas().style.cursor = 'pointer';
                });
                map.on('mouseleave', 'clusters', () => {
                    map.getCanvas().style.cursor = '';
                });

                map.addControl(new mapboxgl.NavigationControl());

                setInterval(() => {
                    map.resize()
                }, 20);

                map.on('idle', function () {
                    showMap.classList.add('hide-showmap');
                    mapContainer.classList.add("map-showed");
                    showMapLoading.remove();
                })
            });
        }
    })
} catch (e) {
    console.error(e)
}