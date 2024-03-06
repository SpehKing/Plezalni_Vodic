import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html'
})
export class PasswordResetComponent {
  resetForm: FormGroup;
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = ''; 
  

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.resetForm.valid) {
      const email = this.resetForm.value.email;

      // Set loading to true when form is submitted
      this.loading = true;

      // Reset error and success messages on new submission
      this.errorMessage = '';
      this.successMessage = '';

      // Call the password reset endpoint in   your AuthService
      this.authService.resetPassword(email).subscribe(
        response => {
          console.log('Password reset email sent successfully:', response);
          // You can provide feedback to the user here if needed
          this.successMessage = 'Password reset email sent successfully. Check your email inbox.';
        },
        error => {
          console.error('Error sending password reset email:', error);
          // Set the error message for display
          this.errorMessage = 'An error occurred while sending the password reset email.';
        }
      ).add(() => {
        // Set loading back to false when the subscription is complete (either success or error)
        this.loading = false;
      });
    }
  }
}
