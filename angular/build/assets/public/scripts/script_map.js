
// Initialize the map
var map = L.map('map').setView([46.0569, 14.5058], 8);

// Add a base map (e.g., OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

  // Define climbing spot markers and their coordinates
var climbingSpots = [
  {
    name: 'Kotečnik',
    lat: 46.19952,
    lng: 15.17892,
  },
  {
    name: 'Črni Kal',
    lat: 45.55121,
    lng: 13.88173,
  },
  {
    name: 'Osp',
    lat: 45.57241,
    lng: 13.86004,
  },
  {
    name: 'Mišja peč',
    lat: 45.56794,
    lng: 13.86269,
  },
  {
    name: 'Čreta',
    lat: 46.27226,
    lng: 14.95496,
  },
  {
    name: 'Vipavska Bela',
    lat: 45.87222,
    lng: 13.97244,
  },
  {
    name: 'Retovje',
    lat: 45.95170,
    lng: 14.29811,
  },
  {
    name: 'Preddvor',
    lat: 46.32357,
    lng: 14.44584,
  },
  // Add more climbing spots as needed, make sure they are near Ljubljana
];
  // Add markers for climbing spots
  climbingSpots.forEach(function (spot) {
    L.marker([spot.lat, spot.lng]).addTo(map).bindPopup(spot.name);
  });
