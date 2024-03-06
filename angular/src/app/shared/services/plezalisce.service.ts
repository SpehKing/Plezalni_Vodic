// area.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ClimbingLocation } from '../classes/climbing-location';


@Injectable({
  providedIn: 'root',
})
export class AreaService {
  private apiUrl = 'http://localhost:3000/api/'; // Adjust the URL based on your server configuration


  constructor(private http: HttpClient) {
    console.log(http);
  }

  async getAllAreas(): Promise<ClimbingLocation[] |undefined> {
    try {
      const areas = await this.http.get<ClimbingLocation[]>(`${this.apiUrl}/plezalisce`).toPromise();
      console.log(areas);
      return areas;
    } catch (error) {
      // Handle error as needed
      console.error('Error fetching climbing spots:', error);
      throw error;
    }
  }

  async getAreaById(areaId: string): Promise<any> {
    try {
      const area = await this.http.get<any>(`${this.apiUrl}/plezalisce/${areaId}`).toPromise();
      return area;
    } catch (error) {
      // Handle error as needed
      console.error('Error fetching climbing spot by ID:', error);
      throw error;
    }
  }
}
