import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-comment-modal',
  templateUrl: './comment-modal.component.html',
  styles: [
  ]
})
export class CommentModalComponent {

  constructor(private authService: AuthService) { }

  @ViewChild('staticModal') staticModal: any;
  commentControl = new FormControl('');
  rating: number = 5;

  public showModal(): void {
    if (this.authService.isLoggedIn()) {
      this.staticModal.show();
    }
    else {
      alert("Za dodajanje komentarja se morate prijaviti!");
    }
  }

  @Output() commentSubmitted = new EventEmitter<[string, number]>();

  onSubmit() {
    if (this.commentControl.value !== null && this.rating !== null) {
      this.commentSubmitted.emit([this.commentControl.value, this.rating]); 
      //send the comment to the parent component
      console.log(this.commentControl.value, this.rating);
    }
  }
}
