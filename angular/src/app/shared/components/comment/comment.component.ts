import { Component, Input, ViewChild } from '@angular/core';
import { Comment } from "../../classes/comment";
import { CommentModalComponent } from '../comment-modal/comment-modal.component';
import { Router } from '@angular/router';
import { AreaDataService } from "../../services/area-data.service";
import { UserDataService } from '../../services/user-data.service';
import { AuthService } from "../../services/auth.service";


// Decorator defining the component's metadata
@Component({
  selector: 'app-comment', // Selector used to identify this component
  templateUrl: './comment.component.html', // URL of the component's template
  styles: [] // Inline styles for this component
})
export class CommentComponent {   
  // Inputs allow data to be passed to this component from its parent component
  @Input() comments: Comment[] = []; // Array of comments
  @Input() areaId: string = ""; // ID of the area related to the comments



  // Constructor to inject dependencies
  constructor(
    private router: Router,
    private areaDataService: AreaDataService,
    private userDataService: UserDataService,
    private authService: AuthService) { }

  // ViewChild allows to reference another component within this template
  @ViewChild(CommentModalComponent) commentComponentModal!: CommentModalComponent;

  public createComment(comment: string, rating: number): void {
    let userData = localStorage.getItem('user');
    //Why this, why not userId ????
    let currentAuthor = userData ? JSON.parse(userData).name + " " +JSON.parse(userData).surname : null;
    console.log("current author: ", currentAuthor);
    if (currentAuthor) {
      let final_comment = new Comment(currentAuthor, rating, comment);
      this.areaDataService.createComment(this.areaId, final_comment).subscribe((data: Comment) => {
        this.comments.push(data);
        console.log(data);
      });
    }
  }

  public deleteComment(comment: Comment) {
    const userJson = localStorage.getItem("user");
    let localUserId: string | null = null;
    if (userJson) {
      let localUser = JSON.parse(userJson);
      localUserId = localUser?._id;
    }
    // Fetch the author ID from the server
    this.userDataService.getUsersId(comment.author.split(" ")[0], comment.author.split(" ")[1]).subscribe(commentAuthorId => {
      console.log("Comment author id:", commentAuthorId.userId);
      console.log("Local user id:", localUserId);
  
      // Compare the IDs to verify if the logged-in user is the author of the comment
      if (commentAuthorId.userId === localUserId) {
        // Delete the comment if the user is the author
        this.areaDataService.deleteComment(this.areaId, comment).subscribe((data) => {
          console.log("Comment deleted");
          console.log(data);
           
          // Remove the comment from the array of comments
          const index = this.comments.indexOf(comment);
          if (index > -1) {
            this.comments.splice(index, 1);
          }
        });
      }
      else {
        alert("To ni vaš komentar!"); 
      }
    });
  }
  
  

  goToUserProfile(username: string) {
    console.log(`Navigating to user profile with username: ${username}`);
    const [firstName, lastName] = username.split(" ");
  
    this.userDataService.getUsersId(firstName, lastName).subscribe(({ userId }) => {
      if (userId) {
        this.router.navigate(['profile/', userId]);
      } else {
        console.error('User ID not found');
      }
    });
  }
  
  // Method to open the modal for adding a new comment
  openAddCommentModal(): void {
    this.commentComponentModal.commentSubmitted.subscribe((comment_rating: [string, number]) => {

      this.createComment(comment_rating[0], comment_rating[1]); // Create the comment and send it to area-data.service.ts
    });
    this.commentComponentModal.showModal(); // Display the modal
  }

}
