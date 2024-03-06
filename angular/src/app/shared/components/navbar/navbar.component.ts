
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { GroupEvent } from '../../classes/group_event';
import { ClimbingLocation } from '../../classes/climbing-location';
import { User } from '../../classes/user';

import { AreaService } from '../../services/plezalisce.service';
import { UserDataService } from '../../services/user-data.service';
import { GroupEventService } from '../../services/group-event.service';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';


@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html'

})
export class NavbarComponent implements OnInit{
    searchForm: FormGroup;

    constructor
    (public authService: AuthService,

    public areaService: AreaService, 
    public userDataService: UserDataService, 
    public groupEventService: GroupEventService, 

    private router: Router,
    private formBuilder: FormBuilder) 
    {
        this.searchString = "";
        this.searchForm = this.formBuilder.group({
            searchInput: new FormControl(''),
        });
        this.usersSubscription = new Subscription();

    }
    searchString: string;
    private usersSubscription: Subscription;

    protected areas: ClimbingLocation[] | undefined = [];
    protected groupEvents: GroupEvent[]| undefined = [];
    protected users: User[] | undefined = [];
    
    async ngOnInit() {
        try {
                this.areas = await this.areaService.getAllAreas();
            } catch (error) {
                console.error('Error fetching climbing spots:', error);
        }
        try {
            this.getGroupEvents();
          } catch (error) {
            console.error('Error fetching events:', error);
        }
        try {
          this.usersSubscription = this.userDataService.getUsers().subscribe(
              (response: any) => {
                  if (response.status === 'OK') {
                      this.users = response.users;
                      console.log(this.users);
                      console.log(Array.isArray(this.users)); // This should now log true
                  } else {
                      console.error('Error fetching users:', response.status);
                  }
              },
              error => {
                  console.error('Error fetching users:', error);
              }
          );
      } catch (error) {
          console.error('Error fetching users:', error);
      }
      

    }

    logout(): void {
        this.authService.signOut();
        this.router.navigate(['/']).then(() => {
        window.location.reload();
        });
    }

    async goToPage() {
        const searchTerm: string = this.searchForm.get('searchInput')?.value;
        if (this.groupEvents !== undefined) {
            this.groupEvents.forEach(event => {
                if (event.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                    this.router.navigate(['/dogodki/', event._id]);
                    return;
                }
            });
        }
        if (this.areas !== undefined) {
            this.areas.forEach(area => {
                if (area.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                    this.router.navigate(['/plezalisce/', area._id]);
                    return;
                }
            });
        }
        if (this.users) {
          console.log(this.users);
          console.log(Array.isArray(this.users));
          //this.users = this.users.users;
          if (Array.isArray(this.users)) {
            this.users.forEach((user) => {
              if (user.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                this.router.navigate(["/profile/", user._id]);
                return;
              }
            });
          }
        }
    }

    private filterEvent = { nResults: 20 };
    public getGroupEvents() {
        this.groupEventService
        .getAllEvents(this.filterEvent.nResults)
        .subscribe((response) => { this.groupEvents = response.events});
    }
}
