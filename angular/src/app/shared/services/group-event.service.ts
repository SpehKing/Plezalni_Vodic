import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError, forkJoin } from "rxjs";
import { catchError, map, retry } from "rxjs/operators";
import { GroupEvent } from "../classes/group_event"; 

@Injectable({
    providedIn: "root",
  })
  export class GroupEventService {
    constructor(private http: HttpClient) {}
    private apiUrl = "http://localhost:3000/api";

    public getOneEvent(
        eventId: string
    ): Observable<GroupEvent>{
        const url: string = `${this.apiUrl}/event/${eventId}`;
        return this.http
        .get<{event: GroupEvent}>(url)
        .pipe(retry(1), catchError(this.handleError)
        ,map((response)=>response.event
        ));
    }

    public getAllEvents(
            nResults: number
    ): Observable<{events: GroupEvent[], status: string}> {
        const url: string = `${this.apiUrl}/event?nResults=${nResults}`;
         return this.http
            .get<{events: GroupEvent[], status: string}>(url)
            .pipe(retry(1), catchError(this.handleError)); 
    }

    public eventCreate(userId: string, eventData: GroupEvent): Observable<GroupEvent> {
      const url: string = `${this.apiUrl}/event/${userId}`;
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': 'Bearer ' + token };
      return this.http
        .post<GroupEvent>(url, eventData, { headers })
        .pipe(retry(1), catchError(this.handleError));
    }

    // JL:Not used right?
    public updateEvent(
        userId: string,
        eventId: string,
        eventData: GroupEvent): Observable<GroupEvent>{
            const url: string = `${this.apiUrl}/event/${eventId}/${userId}/update`;
            return this.http
            .put<GroupEvent>(url, eventData)
            .pipe(
            retry(1),
            catchError(this.handleError)
      );
    }

    public deleteEvent(userId: string, eventId: string): Observable<GroupEvent> {
      const url: string = `${this.apiUrl}/event/${eventId}/${userId}`;
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': 'Bearer ' + token };
      return this.http
        .delete<GroupEvent>(url, { headers })
        .pipe(retry(1), catchError(this.handleError));
    }
    
    public signUpToEvent(
        userId: string,
        eventId: string,): Observable<GroupEvent>{
          const url: string = `${this.apiUrl}/event/${eventId}/${userId}`;
            return this.http
            .put<GroupEvent>(url, eventId)
            .pipe(
            retry(1),
            catchError(this.handleError)
      );

    }
    public removeUserFromEvent(userToBeRemovedId: string, userRequestingTheRemoval: string, eventId: string): Observable<GroupEvent> {
      const url: string = `${this.apiUrl}/event/${eventId}/removeUser/${userToBeRemovedId}/${userRequestingTheRemoval}`;
      return this.http
        .put<GroupEvent>(url, {})
        .pipe(
          retry(1),
          catchError(this.handleError)
        );
    }

    private handleError(error: HttpErrorResponse) {
      return throwError(() => error.error.message || error.statusText);
    }

    generateObjectId(): Promise<string> {
      return new Promise((resolve) => {
        const timestamp = (new Date().getTime() / 1000 | 0).toString(16);
        const randomValue = (Math.random() * 16777215 | 0).toString(16);
        const machineId = '000000';
        const processId = '00';
        const counter = '00';
    
        const objectIdDB = timestamp + machineId + processId + counter + randomValue;
        resolve(objectIdDB);
      });
    }
    
  }