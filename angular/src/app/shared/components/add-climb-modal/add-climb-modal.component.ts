import { Component, Input, OnInit} from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UserDataService } from '../../services/user-data.service';
import { AuthService } from '../../services/auth.service';
import { Area } from "../../classes/area";
import { Climb } from "../../classes/climb"
import { Route } from "../../classes/route";


@Component({
  selector: 'app-add-climb-modal',
  templateUrl: './add-climb-modal.component.html',
  styles: [
  ]
})
export class AddClimbModalComponent implements OnInit {
  modalRef!: BsModalRef;
  @Input() area!: Area;
  @Input() route!: Route;
  bsInlineValue: Date = new Date();
  currentUser = this.authService.getUser();
  errorMessage: string | null = null;
  
  protected formData: any = {
    climbName: "",
    areaName: "",
    routeName: "",
    date: ""
  };

  constructor(
    private modalService: BsModalService, 
    private userDataService: UserDataService, 
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.formData.areaName = this.area.name;
    this.formData.routeName = this.route.name;
    this.setDefaultDate();
  }

  closeModal(): void {
    this.modalRef.hide();
  }

  private setDefaultDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2); // Months are zero-based
    const day = ('0' + today.getDate()).slice(-2);

    this.formData.date = `${year}-${month}-${day}`;
  }
  
  //Logged user only
  addClimb() {
    // Name can only be so long
    if (!this.formData.climbName || !/^[a-z0-9 ]+$/i.test(this.formData.climbName)) {
      this.errorMessage = 'Climb name is required and should only contain alphanumeric characters and spaces';
      return;
    }


    //Limit to only the past
    const today = new Date();
    const selectedDate = new Date(this.formData.date);
    if (selectedDate > today) {
      this.errorMessage = 'Date cannot be in the future';
      return;
    }

    const newClimb: Climb = {
      _id: "",
      name: this.formData.climbName,
      grade: this.route.grade,
      description: "default desciption, unused variable",
      date: this.formData.date,
      area: this.area._id, // Use the areaName instead of area
      areaName: this.area.name,
      numberOrder: this.route.numberOrder
    };

    if (this.currentUser === null) {
      this.errorMessage = 'Moraš biti prijavljan da dodaš vzpon';
      console.error('User ID is null');
      return;
    }

    this.userDataService.addUserClimb(this.currentUser._id, newClimb).subscribe({
      next: (response: any) => {
        console.log('Climb added successfully:', response);
      },
      error: (error) => {
        console.error('Error adding climb:', error);
      }
    });
    console.log(newClimb);
    this.modalRef?.hide();
  }

}