// password-reset.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset-complete.component.html'
})
export class PasswordResetCompleteComponent implements OnInit {
  resetForm: FormGroup;
  email: string = '';
  code: string = '';
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    // Get email and code from the route parameters
    this.route.queryParams.subscribe((params) => {
      this.email = params['email'];
      this.code = params['code'];
    });
  }

  onSubmit() {

    if (this.resetForm.valid) {
      const newPassword = this.resetForm.value.newPassword;
      const confirmPassword = this.resetForm.value.confirmPassword;

      if (newPassword === confirmPassword) {
        // Set loading to true when form is submitted
        this.loading = true;

        // Reset error message on new submission
        this.errorMessage = '';
        // Call the password reset completion endpoint in your AuthService
        this.authService
          .completePasswordReset(this.email, this.code, newPassword)
          .subscribe(
            (response) => {
              console.log('Password reset successful:', response);
              // Set success message for display
            this.successMessage = 'Password reset successful. Redirecting...';

            // Use setTimeout to wait for 2 seconds and then redirect to the login page
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
            },
            (error) => {
              console.error('Error completing password reset:', error);
              // Set the error message for display
              this.errorMessage = 'An error occurred while completing the password reset.';
            }
          )
          .add(() => {
            // Set loading back to false when the subscription is complete (either success or error)
            this.loading = false;
          });
      } else {
        // Passwords don't match, provide feedback to the user
        console.error('Passwords do not match.');
        this.errorMessage = 'Passwords do not match.';
      }
    }
  }
}
