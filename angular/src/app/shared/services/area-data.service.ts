import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, retry, tap, map } from "rxjs/operators";
import { Area } from "../classes/area";
import { Comment } from "../classes/comment";

@Injectable({
  providedIn: 'root'
})

export class AreaDataService {
  private apiUrl = "http://localhost:3000/api";
  private currentArea = new BehaviorSubject<Area>(new Area());
  
  constructor(private http: HttpClient) { }

  //Why is this plural? It's only one area
  public getAreas(
    areaID: string
  ): Observable<Area> {
    const url: string = `${this.apiUrl}/plezalisce/${areaID}`;
    return this.http
      .get<Area>(url)
      .pipe(retry(1), catchError(this.handleError),
      tap(area => this.currentArea.next(area))
      );
  }

  public getCurrentArea(): Observable<Area> {
    return this.currentArea.asObservable();
  }

  public createComment(areaId: string, comment: Comment): Observable<Comment> {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('User is not authenticated');
    }

    const url: string = `${this.apiUrl}/plezalisce/${areaId}/comments`;
    const headers = { 'Authorization': 'Bearer ' + token };
    return this.http
      .post<Comment>(url, { comment }, { headers })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
}

public deleteComment(areaId: string, comment: Comment): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('User is not authenticated');
    }
    const url: string = `${this.apiUrl}/plezalisce/${areaId}/comments/${comment._id}`;
    const headers = { 'Authorization': 'Bearer ' + token };
    return this.http
      .delete<any>(url, { headers })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
}

  public getAreaName(areaID: string): Observable<string> {
    const url: string = `${this.apiUrl}/plezalisce/${areaID}`;
    return this.http
      .get<Area>(url)
      .pipe(
        retry(1),
        catchError(this.handleError),
        map(area => area.name)
      );
  }


  getRoutesForArea(plezalisceId: string): Observable<any> {
    const url = `${this.apiUrl}/plezalisce/${plezalisceId}`;
    return this.http.get(url);
  }
  

  private handleError(error: HttpErrorResponse) {
    return throwError(() => error.error.message || error.statusText);
  }
}
