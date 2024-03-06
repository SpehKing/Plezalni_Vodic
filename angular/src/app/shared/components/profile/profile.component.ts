import { Component, OnInit, TemplateRef  } from '@angular/core';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { ActivatedRoute } from '@angular/router';
import { AuthService } from "../../services/auth.service";
import { switchMap } from 'rxjs/operators';
import { UserDataService } from '../../services/user-data.service';
import { User } from "../../classes/user";
import { UndefinedRawTransactionError } from 'web3';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.component.html',
  styles: [],
})

export class ProfileComponent implements OnInit {
  user: User;
  hasClimbs = false;
  //temporary object that stores values being edited in the form
  editUser: User = {
    _id: '',
    name: '',
    surname: '',
    birthday: '',
    email: '',
    publicKey: '',
    is_guide: false,
    climbs: [],
    profile_picture: '',
    bio: '',
  };
  modalRef?: BsModalRef;

  constructor(
    private userDataService: UserDataService,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private authService: AuthService
  ) {
    this.user = new User();
  }

  protected openModal(form: TemplateRef<any>) {
    this.editUser = {...this.user};
    this.modalRef = this.modalService.show(form, {
      class: "modal-dialog-centered",
    });
  }

  //Only available to currently logged in user
  updateUser() {
    // Merge editUser into user
    const updatedUser = { ...this.user, ...this.editUser };
  
    console.log("Updating with data:", updatedUser);
    this.userDataService.updateUser(this.user._id, updatedUser).subscribe({
      next: response => {
        console.log('User updated successfully with data: ', updatedUser),
        // Update this.user with the data from updatedUser
        this.user = updatedUser;
      },
      error: error => console.error('There was an error updating the user', error)
    });
    this.modalRef?.hide();
  }

  //Checks for the current user
  isCurrentUser(): boolean {
    return this.authService.isCurrentUser(this.user._id);
  }

  ngOnInit() {
    this.route.paramMap.pipe(
      // switchMap to extract userId from paramMap and use it in getUserData
      switchMap(paramMap => {
        const userId = paramMap.get('userId') ?? '';
        console.log('User ID:', userId);
        return this.userDataService.getUser(userId);
      })
    ).subscribe({
      next: (response: any) => {
        if (response.status === 'OK' && response.userInstance) {
          this.user = response.userInstance;
          
          console.log('User Data:', this.user);
        } else {
          console.error('Error fetching user data:', response.message || 'Unknown error');
        }
      },
      error: (error) => {
        console.error('API Error:', error);
      },
    });
  }

  deleteUser() {
    this.userDataService.deleteUser(this.user._id).subscribe({
      next: response => {
        console.log('User deleted successfully'),
        this.authService.signOut();
      },
      error: error => console.error('There was an error deleting the user', error)
    });
  }


}