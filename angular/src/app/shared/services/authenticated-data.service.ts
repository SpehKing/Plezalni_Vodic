// authenticated-data.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class AuthenticatedDataService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getSecureData(): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/secure-data`, { headers });
  }

  // Add other methods for authenticated requests as needed
}
