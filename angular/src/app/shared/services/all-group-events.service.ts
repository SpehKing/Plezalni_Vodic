import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { GroupEventService } from './group-event.service';
import { UserDataService } from './user-data.service';
import { AreaDataService } from './area-data.service';
import { GroupEvent } from '../classes/group_event';
import { User } from '../classes/user'; 
import { Area } from '../classes/area';

@Injectable({
    providedIn: "root",
  })
export class AllGroupEventService {
  constructor(
    private groupEventService: GroupEventService,
    private userDataService: UserDataService,
    private areaDataService: AreaDataService
  ) {}

  getFinalGroupEvent(): Observable<GroupEvent[]> {
    return this.groupEventService.getAllEvents(100).pipe(
      mergeMap((response: { events: GroupEvent[], status: string }) => {
        const events = response.events;

        // Create an array of observables to get area information for each event
        const userObservables = events.map(event =>
          this.userDataService.getUser(event.author)
        );

        // Fetch additional information from User2Service for each event
        const areaObservables = events.map(event =>
          this.areaDataService.getAreas(event.area)
        );

        // Use forkJoin to execute all observables in parallel
        return forkJoin([...userObservables, ...areaObservables]).pipe(
          map((results: (User | Area)[]) => {
            const user = results.slice(0, events.length) as User[];
            const area = results.slice(events.length) as Area[];

            // Update each event with the corresponding area name and author
            events.forEach((event, index) => {
              event.area = area[index].name;
              event.image = area[index].image;
              event.author = user[index].name;

              // Replace participant IDs with corresponding user names
              if (event.participants) {
                forkJoin(
                  event.participants.map(participantId =>
                    this.getUserNameById(participantId)
                  )
                ).subscribe(participantNames => {
                  //event.participants = participantNames.reduce((acc, names) => acc.concat(names), []);
                });
              } else {
                event.participants = [];
              }

            });

            return events;
          })
        );
      })
    );
  }
  private getUserNameById(userId: string): Observable<string>[] {
    return [this.userDataService.getUser(userId).pipe(map(user => user.name))];
  }
  
}
