
import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { User } from "../classes/user";
import { Climb } from "../classes/climb";
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: "root",
})
export class UserDataService {
  constructor(private http: HttpClient) {}

  private apiUrl = 'http://localhost:3000/api';

  // Methods for user details
  public getUser(userId: string): Observable<User> {
    const url: string = `${this.apiUrl}/profile/${userId}`;
    return this.http
      .get<User>(url)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  public getUsers(): Observable<User[]> {
    const url: string = `${this.apiUrl}/profile/`;
    return this.http
      .get<User[]>(url)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  public getUsersId(name: string, surname: string): Observable<any> {
    const url: string = `${this.apiUrl}/getUsersId/${name}/${surname}`;
    return this.http
      .get<any>(url)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  public updateUser(userId: string, userData: User): Observable<User> {
    const url: string = `${this.apiUrl}/profile/${userId}`;
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': 'Bearer ' + token };
    console.log("User data:", userData);
    return this.http
      .put<User>(url, userData, { headers })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  public deleteUser(userId: string): Observable<any> {
      const url: string = `${this.apiUrl}/profile/${userId}`;
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': 'Bearer ' + token };
      return this.http
        .delete<any>(url, { headers })
        .pipe(
          retry(1),
          catchError(this.handleError)
        );
  }

  // Methods for user Climb
  public getUserClimb(userId: string): Observable<Climb[]> {
    const url: string = `${this.apiUrl}/profile/${userId}/vzponi`;
    return this.http
      .get<Climb[]>(url)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  public addUserClimb(userId: string, climbData: Climb): Observable<Climb> {
    const url: string = `${this.apiUrl}/profile/${userId}/vzponi`;
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': 'Bearer ' + token };
    return this.http
      .post<Climb>(url, climbData, { headers })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  
  public deleteClimb(userId: string, climbId: string): Observable<any> {
    const url: string = `${this.apiUrl}/profile/${userId}/vzponi/${climbId}`;
    const token = localStorage.getItem('token');
    console.log(":::::::::",userId, climbId, url, token);
    const headers = { 'Authorization': 'Bearer ' + token };
    return this.http
      .delete<any>(url, { headers })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    return throwError(() => 'Failed to fetch or update data');
  }
}