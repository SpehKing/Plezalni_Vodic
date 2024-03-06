import { Component, OnInit, Input } from '@angular/core';
import { AreaService } from '../../services/plezalisce.service';
import { GroupEvent } from '../../classes/group_event';
import { Area } from "src/app/shared/classes/area";
import { User } from "src/app/shared/classes/user";
import { GroupEventService } from 'src/app/shared/services/group-event.service';
import { AreaDataService } from "../../services/area-data.service"; 
import { UserDataService } from "../../services/user-data.service"; 
import { NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-events-list',
  templateUrl: 'event-list.component.html',
  styleUrls: ['event-list.component.css'],
})
export class EventListComponent implements OnInit {
    user: User;
    user2: User;
    protected groupEvents!: GroupEvent[];
    @Input() userId!: string;
  constructor(
            private areaService: AreaService, 
            config: NgbAccordionConfig, 
            private groupEventService: GroupEventService,
            private areaDataService: AreaDataService,
            private userDataService: UserDataService,
            private router: Router) 
  {
    // customize default values of accordions used by this component tree
    config.closeOthers = true;
    config.type = 'info';
    this.user = new User();
    this.user2 = new User();
  }

  async ngOnInit(): Promise<void> {
    try {
        this.getGroupEvents();
    } catch (error) {
        console.error('Error fetching climbing spots:', error);
    }
  }

  toggleInfo(event: GroupEvent) {
    //console.log('Toggling info for spot:', spot);
    this.groupEvents!.forEach((e) => {
      e.showInfo = e === event ? !e.showInfo : false;
    });
  }

  handleButtonClick(id: string) {
    this.router.navigate(['/dogodki/', id]);
  }

  private filterEvent = { nResults: 10 };
  public getGroupEvents() {
    this.groupEventService
      .getAllEvents(this.filterEvent.nResults)
      .subscribe((response) => { this.groupEvents = response.events 
      
        // Fetch area details for each group event
        this.groupEvents.forEach((groupEvent) => {
          this.addAreaDetails(groupEvent.area);
        });
        // Fetch author details for each group event
        this.groupEvents.forEach((groupEvent) => {
          this.addAuthorDetails(groupEvent.author);
        });     
      });

  }
//get the area name and img
  private addAreaDetails(areaId: string) {
    this.areaDataService.getAreas(areaId).subscribe((areaDetails) => {
      const groupEvent = this.groupEvents.find((event) => event.area === areaId);
      if (groupEvent) {
        groupEvent.image = "assets/public/images/climbing_sites/"+areaDetails.name+"/1.jpg";
        groupEvent.area = areaDetails.name;
      }
    });
  }

  private addAuthorDetails(userId: string) {
    this.userDataService.getUser(userId).subscribe((response : any) => {
      this.user = response.userInstance;
      const groupEvent = this.groupEvents.find((event) => event.author === userId);
      if (groupEvent) {
        groupEvent.author = this.user.name;
        //console.log("username: ", this.user.name);
      } else {
        console.log('Group event not found for userId:', this.userId);
      }
    });
  } 
  
  
}
