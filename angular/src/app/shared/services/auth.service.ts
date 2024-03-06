import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../classes/user';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const credentials = { email, password };

    return this.http.post<any>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(data => {
          // Assuming your server sends back a token upon successful login
          const token = data.token;
          // Store the token in a secure way (e.g., localStorage or secure cookie)
          localStorage.setItem('authToken', token);
          localStorage.setItem('user', JSON.stringify(data.user));
        })
      );
  }

  isLoggedIn(): boolean {
    // Check if the token exists
    //console.log("token: "+this.getAuthToken());
    return this.getAuthToken() !== null;
  }

  isCurrentUser(userId: string): boolean {
    const user = this.getUser();
    return user ? user._id === userId : false;
  }

  register(userData: User): Observable<any> {
    console.log('Registering user:', userData);
    return this.http.post(`${this.apiUrl}/signup`, userData);
  }

  resetPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/initiate-reset-password`, { email });
  }

  completePasswordReset(
    email: string,
    code: string,
    newPassword: string
  ): Observable<any> {
    // Implement the logic to complete the password reset on the backend
    // This could be an HTTP request to your server
    const resetData = {
      email: email,
      code: code,
      newPassword: newPassword,
    };

    return this.http.post(`${this.apiUrl}/complete-reset-password`, resetData);
  }

  signOut(): void {
    // Clear the token from storage upon sign-out
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  getAuthToken(): string | null {
    // Retrieve the token from storage
    return localStorage.getItem('authToken');
  }

  getAuthHeaders(): HttpHeaders {
    const authToken = this.getAuthToken();
    return new HttpHeaders().set('Authorization', `Bearer ${authToken}`);
  }

  getUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // used to show the add groupClimb button, shows only for guides
  isGuide(): boolean {
    const user = this.getUser();
    return user ? user.is_guide : false;
  }
  
  getUserName(): string {
    const user = this.getUser();
    if (user) {
      //console.log("getUserName", user);
      return `${user.name} ${user.surname}`;
    } else {
      return 'Nihče';
    }
  }

}
