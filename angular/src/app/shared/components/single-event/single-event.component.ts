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
import { BehaviorSubject, Subject } from "rxjs";
import { Router, ActivatedRoute } from '@angular/router';
import { TicketingSystemService } from "../../services/ticketing-system.service";


@Component({
  selector: 'app-single-event',
  templateUrl: './single-event.component.html',
  styleUrls: []
})
export class SingleEventComponent implements OnInit {
  groupEvent: GroupEvent;
  user: User;
  user2: User;

  constructor(
    private route: ActivatedRoute,
    private groupEventService: GroupEventService,
    private areaDataService: AreaDataService,
    private userDataService: UserDataService,
    public authService: AuthService,
    private router: Router,
    private ticketingSystemService: TicketingSystemService
  ) {
    this.groupEvent = new GroupEvent();
    this.user = new User();
    this.user2 = new User();
  }

  userApplied: boolean = false;

  ngOnInit() {
    this.route.params.subscribe(params => {
      const eventId = params['id'];
      this.getEventDetails(eventId);
    });
    this.checkUserApplied();
  }
  getEventDetails(eventId: string) {
    this.groupEventService.getOneEvent(eventId).subscribe(
      (response: GroupEvent) => {
        console.log("grioup event iss:",response.name);
        this.groupEvent = response

        this.addAreaDetails(this.groupEvent.area);
        this.addAuthorDetails(this.groupEvent.author);
        if(this.groupEvent.participants?.length){
            this.addParticipantsDetails(this.groupEvent.participants);
        }
        if(this.groupEvent.participants?.length){
            this.groupEvent.currentNumParticipants = this.groupEvent.participants?.length
           }
        else{
            this.groupEvent.currentNumParticipants = 0;
        }
        console.log(this.groupEvent)
      },
      error => {
        console.error('Error getting event details', error);
      }
    );
  }
  areaName : string =''; 
  private addAreaDetails(areaId: string) {
    this.areaDataService.getAreas(areaId).subscribe((areaDetails) => {
      if (this.groupEvent.area == areaDetails._id) {
        this.groupEvent.image = "assets/public/images/climbing_sites/" + areaDetails.name + "/" + areaDetails.image;
        this.areaName = areaDetails.name;
      }
    });
  }
  authorOfEvent: string =  '';
  authorEmail: string = '';
  private addAuthorDetails(userId: string) {
    this.userDataService.getUser(userId).subscribe((response: any) => {
      this.user = response.userInstance;
      if (this.groupEvent.author == this.user._id) {
        this.authorOfEvent = this.user.name + " " + this.user.surname ;
        this.authorEmail = this.user.email;
      } else {
        console.log('Group event not found for userId:', userId);
      }
    });
  }
  participantNames: string[] = [];
  participantIds: string[] = [];
  private addParticipantsDetails(participantIds: string[]) {
    if (participantIds) {
      participantIds.forEach((participantId) => {
        this.userDataService.getUser(participantId).subscribe((response: any) => {
          this.user2 = response.userInstance;
          const participantAlreadyAdded = this.participantIds.includes(this.user2._id);
  
          if (!participantAlreadyAdded) {
            this.participantNames.push(this.user2.name+" "+this.user2.surname);
            this.participantIds.push(this.user2._id);
          } else {

            const indexToRemove = this.participantNames.indexOf(this.user2.name+" "+this.user2.surname);
            if (indexToRemove !== -1) {
              this.participantNames.splice(indexToRemove, 1);
              this.participantIds.splice(indexToRemove, 1);
            }
          }
        });
      });
    }
  } 

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

  deleteEvent(){
    const userId = this.authService.getUser()?._id;
    this.route.params.subscribe(params => {
      const eventIdPicked = params['id'];
      if(userId){
        if(this.groupEvent.author == userId){ 
          this.groupEventService.deleteEvent(userId, eventIdPicked).subscribe(
            (response: any) => {
              console.log('event deleted successfully:', response);
              console.log("event is deleted");
              //this.refreshGroupEvents();
              // setTimeout(() => {
              //   this.goToGroupEvents();
              // }, 500);
            },
            (error) => {
              console.error('Error deleting:', error);
            }
            );
            this.refreshGroupEvents();
            //location.reload()
          

        }else{
          window.alert("Dogodka drugih uporabnikov ni mogoče izbrisati");
        }
      }else{
        console.log("you are not singed in");
        window.alert("Niste prijavljeni");
      }
    });
  }
  refreshGroupEvents() {
    console.log('Refreshing group events...');
    setTimeout(() => {
      this.goToGroupEvents();
    }, 500); 
  }
  goToGroupEvents() {
    console.log('Navigating to group events...');
    this.router.navigate(['/dogodki']);
  }
  private checkUserApplied() {
    const userId = this.authService.getUser()?._id;
    this.route.params.subscribe(params => {
      const eventIdToCheck = params['id'];
      if (userId && eventIdToCheck) {
        this.groupEventService.getOneEvent(eventIdToCheck).subscribe((event) => {
          if (event.participants?.includes(userId)) {
            this.userApplied = true;
          } else {
            this.userApplied = false;
          }
        });
      }
    });
  }

  checkIfUserApplied = false;

  toggleApply() {
    const userId = this.authService.getUser()?._id;
    this.route.params.subscribe(params => {
      const eventIdToApply = params['id'];
      
          if (userId && eventIdToApply) {
            if(userId != this.groupEvent.author){
              if (this.userApplied) {
                //remove
                // this.groupEventService.removeUserFromEvent(userId, userId, eventIdToApply).subscribe(
                //   (response: any) => {
                //     console.log('User removed successfully:', response);
                //     this.userApplied = false;
                //     this.getEventDetails(eventIdToApply);
                //     if (this.groupEvent.participants) {
                //       this.addParticipantsDetails(this.groupEvent.participants);
                //     }
                //   },
                //   (error) => {
                //     console.error('Error removing user:', error);
                //   }
                // );
                this.checkIfUserApplied = true;

              } else {
                this.checkIfUserApplied = false;
                //apply
                if(!this.isUserApplied(this.groupEvent)){
                  if( this.groupEvent.currentNumParticipants != undefined && this.groupEvent.currentNumParticipants < this.groupEvent.maxParticipants){
                    this.groupEventService.signUpToEvent(userId, eventIdToApply).subscribe(
                      (response: any) => {
                        console.log('User applied successfully:', response);
                        this.userApplied = true;
                        this.getEventDetails(eventIdToApply);
                        if (this.groupEvent.participants) {
                          this.addParticipantsDetails(this.groupEvent.participants);
                        }
                        //console.log("sssssssssssssssssssssssssssssssss", eventIdToApply)
                        this.ticketingSystemService.purchaseTicket(eventIdToApply);
                      },
                      (error) => {
                        console.error('Error applying user:', error);
                      }
                    );
                  }else{
                    window.alert("Ni več prostega prostora");
                  }
                }else{
                  window.alert("Ste se že prijavili");
                }
              }
            }else{
              window.alert("Ne morete se prijaviti na svoj dogodek");
            }
          }else{
            window.alert("Niste prijavljeni")
          }
    });
  }
  isUserApplied(groupEvent: GroupEvent): boolean {
    const userId = this.authService.getUser()?._id;
    return !!userId && !!groupEvent.participants?.includes(userId);
  }
  
  async withdrawFunds() {
    this.route.params.subscribe(params => {
      const eventIdToApply = params['id'];
      console.log("sssssssssssssssssssssssssssssssss", eventIdToApply)
      this.ticketingSystemService.withdrawFunds(eventIdToApply);
    });
  }

  checkIfUserIsAuthor(): boolean{
    const userId = this.authService.getUser()?._id;
    if((userId == this.groupEvent.author) && userId){
      return true;
    }else{
      return false;
    }
  }

  isEventDatePassed(eventDate: Date): boolean {
    const currentDate = new Date();
    return currentDate > new Date(eventDate);
  }

  // async getEventFunds(eventId: string): Promise<number> {
  //   const returnableValue = await this.ticketingSystemService.getEventFunds(eventId);
  //   return returnableValue || 0;
  // }
  


}
