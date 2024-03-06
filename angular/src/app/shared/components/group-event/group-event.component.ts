import { Component, Input, OnInit, TemplateRef } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { GroupEvent } from "src/app/shared/classes/group_event";
import { Area } from "src/app/shared/classes/area";
import { User } from "src/app/shared/classes/user";
import { GroupEventService } from 'src/app/shared/services/group-event.service';
import { AllGroupEventService } from 'src/app/shared/services/all-group-events.service';
import { AreaDataService } from "../../services/area-data.service"; 
import { UserDataService } from "../../services/user-data.service"; 
import { AuthService } from "../../services/auth.service";
import { Subject } from "rxjs";
import { ClimbingLocation } from "../../classes/climbing-location";
import { AreaService } from "../../services/plezalisce.service";
import { ActivatedRoute, Router } from '@angular/router';
import { DateFormatPipe } from "../../pipes/date-format.pipe";
import { DateEventFormatPipe } from "../../pipes/date-format-event.pipe";
import { ShowClosestDateFirstPipe } from "../../pipes/show-closest-date-first.pipe";
import { TicketingSystemService } from "../../services/ticketing-system.service";
import { ObjectId } from 'bson';

@Component({
  selector: 'app-event',
  templateUrl: './group-event.component.html',
  styleUrls: [],
})
export class GroupEventComponent implements OnInit {
    user: User;
    user2: User;
    climbingAreas: ClimbingLocation[] | undefined = [];
    constructor (
      private groupEventService: GroupEventService,
      private areaDataService: AreaDataService,
      private userDataService: UserDataService,
      private modalService: BsModalService,
      public authService: AuthService,
      public AreaService: AreaService,
      private allGroupEventService: AllGroupEventService,
      private router: Router,
      private ticketingSystemService: TicketingSystemService
      ){
        
        this.user = new User();
        this.user2 = new User();
    }

    userApplied: boolean = false;
    protected message: string = "Please connect MetaMask wallet to continue!";
    async ngOnInit() {
        try {
          this.climbingAreas = await this.AreaService.getAllAreas();
        } catch (error) {
          console.error('Error fetching climbing spots:', error);
        }
        this.getGroupEvents();
        // this.getFinalGroupEvents();
        this.ticketingSystemService
        .connectToBC()
        .then((message: string) => (this.message = message));
    }

    modalRef?: BsModalRef;
    @Input() userId!: string;

    protected openModal(form: TemplateRef<any>) {
      this.modalRef = this.modalService.show(form, {
        class: "modal-dialog-centered",
        keyboard: false,
        ignoreBackdropClick: true
      });
    }

    protected groupEvents!: GroupEvent[];
    // private getFinalGroupEvents(){
    //   this.allGroupEventService.getFinalGroupEvent().subscribe(
    //     (groupEvents: GroupEvent[]) => {
    //       this.groupEvents = groupEvents;
    //       console.log('Fetched Group Events:', groupEvents);
    //     },
    //     error => {
    //       console.error('Error geting group events', error);
    //     }
    //   );
    // }
    //protected area!: Area[];
    private filterEvent = { nResults: 100 };
    private getGroupEvents() {
      this.groupEventService
        .getAllEvents(this.filterEvent.nResults)
        .subscribe((response) => { this.groupEvents = response.events 
        
          this.groupEvents.forEach((groupEvent) => {
            this.addAreaDetails(groupEvent.area);
          });
          this.groupEvents.forEach((groupEvent) => {
            this.addAuthorDetails(groupEvent.author);
          });
          this.groupEvents.forEach((groupEvent) => {
            if(groupEvent.participants?.length){
              this.addParticipantsDetails(groupEvent.participants);
            }
          });
          this.groupEvents.forEach((groupEvent) => {
            if(groupEvent.participants?.length){
              groupEvent.currentNumParticipants = groupEvent.participants?.length
            }
            else{
              groupEvent.currentNumParticipants = 0;
            }
          });
        });
    }
    private addAreaDetails(areaId: string) {
      this.areaDataService.getAreas(areaId).subscribe((areaDetails) => {
        const groupEvent = this.groupEvents.find((event) => event.area === areaId);
        if (groupEvent) {
          //groupEvent.image = "assets/public/images/climbing_sites/"+areaDetails.name+"/"+areaDetails.image;
          groupEvent.area = areaDetails.name;
        }
      });
    }
    private addAuthorDetails(userId: string) {
      this.userDataService.getUser(userId).subscribe((response : any) => {
        this.user = response.userInstance;
        const groupEvent = this.groupEvents.find((event) => event.author === userId);
        if (groupEvent) {
          groupEvent.author = this.user.name + " "+ this.user.surname;
        } else {
          console.log('Group event not found for userId:', this.userId);
        }
      });
    } 
    private addParticipantsDetails(participantIds: string[]) {
      participantIds.forEach((participantId) => {
        
        this.userDataService.getUser(participantId).subscribe((response: any) => {

          this.user2 = response.userInstance;
          this.groupEvents.forEach((groupEvent) => {

            if (groupEvent.participants && groupEvent.participants.includes(participantId)) {

              const participantIndex = groupEvent.participants.indexOf(participantId);
              groupEvent.participants[participantIndex] = this.user2.name +" "+this.user2.surname;
            }
          });
        });
      });
    }
    //groupEvent!: GroupEvent;
    groupEvent$ = new Subject<GroupEvent>(); //
    getOneEvent(eventId: string){
      //console.log(this.eventId);
      this.groupEventService
        .getOneEvent(eventId)
        .subscribe((response) => {
        if (response) {
          this.groupEvent$.next(response);
          //console.log('"OK"', response);
        } else {
          //console.error('Bad response', response);
        }
      });
    }
    
    getAreaId(areaName: string): string {
      if (!this.climbingAreas) {
        console.error('getAreaId error: climbingAreas is not defined or empty');
        return "";
      }
      const foundArea = this.climbingAreas.find((a) => a.name === areaName);
      if (!foundArea) {
        console.error(`getAreaId error: Area with name ${areaName} not found in climbingAreas`);
      }
      return foundArea ? foundArea._id : "";
    }

    private userArea!: Area; 
    userArea$ = new Subject<Area>;
    async getAreaDetails(areaId: string) {
      this.areaDataService
      .getAreas(areaId)
      .subscribe((areaDetails) => {
        if(areaDetails){
          this.userArea$.next(areaDetails);
          this.userArea = areaDetails;
          console.log("success loading eareaDetails into user area", this.userArea);
        }else{
          console.log("failed loading eareaDetails into user area");
        }
      });
    }
    createNewEvent = {
        name: '',
        image: '',
        description: '',
        price: 0,
        datum: new Date(),
        areaName: '', 
        maxParticipants: 0
    };
    currenDate = new Date();
    // createEvent() {
    //   if (
    //     this.createNewEvent &&
    //     this.createNewEvent.name &&
    //     this.createNewEvent.areaName &&
    //     this.createNewEvent.description &&
    //     this.createNewEvent.price !== undefined &&
    //     this.createNewEvent.datum &&
    //     this.createNewEvent.maxParticipants !== undefined
    //   ) {
    //     const userId = this.authService.getUser()?._id;
    //     const isGuide = this.authService.getUser()?.is_guide;
    
    //     if (isGuide) {
    //       this.getAreaDetails(this.getAreaId(this.createNewEvent.areaName));
    //       const imageU = "assets/public/images/climbing_sites/" + this.userArea.name + "/" + this.userArea.image;
    //       const areaU = this.userArea._id;
    
    //       if (userId) {
    //         const eventData: GroupEvent = {
    //           _id: this.groupEventService.generateObjectId(),
    //           name: this.createNewEvent.name,
    //           author: userId,
    //           image: imageU,
    //           description: this.createNewEvent.description,
    //           price: this.createNewEvent.price,
    //           date: this.createNewEvent.datum,
    //           area: areaU,
    //           maxParticipants: this.createNewEvent.maxParticipants
    //         };
    
    //         const nameRegex = /^[a-zA-Z0-9\sčćžđš]+$/;
    //         const opisRegex = /^[a-zA-Z0-9\sčćžđš,\.!\?()]+$/;
    //         const priceRegex = /^\d+(\.\d{1,2})?$/;
    
    //         if (
    //           nameRegex.test(eventData.name) &&
    //           opisRegex.test(eventData.description) &&
    //           priceRegex.test(String(eventData.price)) &&
    //           eventData.date &&
    //           eventData.maxParticipants > 0 &&
    //           eventData.area
    //         ) {
    //           this.groupEventService.eventCreate(userId, eventData).subscribe(
    //             (response: any) => {
    //               console.log('Event created successfully:', response);
    //               this.ticketingSystemService.createEventOnBC(eventData.name, eventData.price, eventData.maxParticipants, eventData._id);
    //               this.getGroupEvents();
    //             },
    //             (error) => {
    //               console.error('Error creating event:', error);
    //             }
    //           );
    //           this.modalRef?.hide();
    //           this.getGroupEvents();
    //         } else {
    //           window.alert("Poskrbite, da boste vnesli pravilne podatke");
    //         }
    //       } else {
    //         console.log("You are not signed in");
    //         window.alert("Niste prijavljeni");
    //       }
    //     } else {
    //       window.alert("Za ustvarjanje dogodka morate biti vodnik.");
    //     }
    //   } else {
    //     window.alert("Prosimo izpolnite vsa zahtevana polja.");
    //     console.error('Invalid createNewEvent object or missing required fields.');
    //   }
    // }
    async createEvent() {
      if (
        this.createNewEvent &&
        this.createNewEvent.name &&
        this.createNewEvent.areaName &&
        this.createNewEvent.description &&
        this.createNewEvent.price !== undefined &&
        this.createNewEvent.datum &&
        this.createNewEvent.maxParticipants !== undefined
      ) {
        const userId = this.authService.getUser()?._id;
        const isGuide = this.authService.getUser()?.is_guide;
    
        if (isGuide) {
          
          if (userId) {
              await this.getAreaDetails(this.getAreaId(this.createNewEvent.areaName));
              this.userArea$.subscribe(async (userArea1) =>{
                const imageU = "assets/public/images/climbing_sites/" + userArea1.name + "/" + userArea1.image;
                const areaU = userArea1._id;
                const eventData: GroupEvent = {
                  _id: await this.groupEventService.generateObjectId(),
                  name: this.createNewEvent.name,
                  author: userId,
                  image: imageU,
                  description: this.createNewEvent.description,
                  price: this.createNewEvent.price * 10000000000000000,
                  date: this.createNewEvent.datum,
                  area: areaU,
                  maxParticipants: this.createNewEvent.maxParticipants
                };
                
                const nameRegex = /^[a-zA-Z0-9\sčćžđš]+$/;
                const opisRegex = /^[a-zA-Z0-9\sčćžđš,\.!\?()]+$/;
                const priceRegex = /^\d+(\.\d{1,2})?$/;
                
                if (
                  nameRegex.test(eventData.name) &&
                  opisRegex.test(eventData.description) &&
                  priceRegex.test(String(eventData.price)) &&
                  eventData.date &&
                  eventData.maxParticipants > 0 &&
                  eventData.area
                  ) {
                    const response: any = await this.groupEventService.eventCreate(userId, eventData).toPromise();
                    console.log('Event created successfully:', response);
                    this.getGroupEvents();
                    await this.ticketingSystemService.createEventOnBC(eventData.name, eventData.price, eventData.maxParticipants, eventData._id);
                    this.modalRef?.hide();
                  } else {
                    window.alert("Poskrbite, da boste vnesli pravilne podatke");
                  }
                });
                } else {
                  console.log("You are not signed in");
                  window.alert("Niste prijavljeni");
                }
            } else {
          window.alert("Za ustvarjanje dogodka morate biti vodnik.");
        }
      } else {
        window.alert("Prosimo izpolnite vsa zahtevana polja.");
        console.error('Invalid createNewEvent object or missing required fields.');
      }
    }
    
    goToSingleEvent(eventsId: string) {
      if (eventsId) {
        this.router.navigate(['/dogodki', eventsId]);
      } else {
        console.error('Event ID is undefined.');
      }
    }


}
