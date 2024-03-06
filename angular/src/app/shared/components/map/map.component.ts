import { Component, AfterViewInit } from '@angular/core';
import { AreaService } from '../../services/plezalisce.service';
import { ClimbingLocation } from '../../classes/climbing-location';
import { Router } from '@angular/router';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  template: `<div id="map"></div>`,
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {

 constructor(private areaService: AreaService, private router: Router) {}

  private initializeMap() {
    const map = L.map('map').setView([45.636737, 13.746916], 9);
    console.log("AYYYYYYYYYYYYYYY")
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    return map;
  }
  
  private async fetchAndAddMarkers(map: any) {
    try {
      console.log('Fetching climbing spots...');
      const areas = await this.areaService.getAllAreas();
          // Check if areas is defined before using it
          console.log("founr" + areas);
    if (areas !== undefined) {
      console.log('Climbing spots data:', areas);
      this.addMarkers(map, areas);
    } else {
      console.error('Error: Areas data is undefined.');
    }
    } catch (error) {
      console.error('Error fetching climbing spots:', error);
    }
  }

  private addMarkers(map: any, climbingSpots: ClimbingLocation[]) {
    climbingSpots.forEach(spot => {
      const firstSentence = getFirstSentence(spot.description);
      const popupContent = `
        <div id="popup-${spot._id}" style="text-align: center;">
          <img src="assets/public/images/climbing_sites/${spot.name}/${spot.image}" alt="${spot.name}" style="width: 200px; height: auto; margin-bottom: 5px">
          <h4 style="font-weight: bold;">${spot.name}</h4>
          <p>${firstSentence}.</p>
          <button class="btn btn-success button">Poglej Plezišče</button>
        </div>
      `;
  
      function getFirstSentence(description: string): string {
        const sentences = description.split('.');
        return sentences[0];
      }
  
      //need stupid workound to get the button to work inside the popup
      const marker = L.marker([spot.coordinates[0], spot.coordinates[1]]).addTo(map).bindPopup(popupContent);
      marker.on('popupopen', () => {
        const popupElement = document.getElementById(`popup-${spot._id}`);
        if (popupElement) {
          popupElement.addEventListener('click', () => this.handleButtonClick(spot._id));
        }
      });
    });
  }

  handleButtonClick(id: string) {
    this.router.navigate(['/plezalisce', id]);
  }

  async ngAfterViewInit() {
    const map = this.initializeMap();
    await this.fetchAndAddMarkers(map);
  }
  
}

