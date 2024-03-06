document.addEventListener('DOMContentLoaded', function() {
    const climbingSpots = [
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

    const titleList = document.querySelector('.title-list');

    climbingSpots.forEach(spot => {
        const title = document.createElement('h2');
        title.className = 'title';
        title.textContent = spot.name;
        titleList.appendChild(title);

        const info = document.createElement('div');
        info.className = 'info';
        info.style.display = 'none';
        info.textContent = `Latitude: ${spot.lat}, Longitude: ${spot.lng}`;
        titleList.appendChild(info);

        title.addEventListener('click', () => {
            info.style.display = info.style.display === 'none' ? 'block' : 'none';
            infoSections.forEach(section => {
                if (section !== info) {
                    section.style.display = 'none';
                }
            });
        });
    });
});


