/* eslint-disable */
console.log('Hello from the client side');

// document.addEventListener('DOMContentLoaded', () => {
//   const locations = JSON.parse(
//     document.getElementById('map').dataset.locations
//   );
//   console.log(locations);
// });

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1Ijoic2FuZGVlcGdhbmdhcmFtIiwiYSI6ImNrem1kazExdzJteXYycG8wcmgzbnUxczcifQ.9AIdwz2_MNKvxliMECrScg';
  const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/sandeepgangaram/cl3bioh5u001414pfq72vqr11', // style URL
    center: [-118.113491, 34.111745], // starting position [lng, lat]
    zoom: 9, // starting zoom
    scrollZoom: false,
    // interactive: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);
    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 150,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
