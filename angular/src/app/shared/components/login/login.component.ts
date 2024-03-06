// login.component.ts

import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  isSubmitting: boolean = false;  // Add a flag for submitting state
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(form: NgForm): void {
    if (form.valid && !this.isSubmitting) {  // Check if the form is valid and not submitting
      this.isSubmitting = true;  // Set submitting flag to true
      this.errorMessage = '';  // Clear previous error message

      this.authService.login(this.email, this.password)
        .subscribe(
          (response) => {
            console.log(response.message);
            console.log(response.user);
            localStorage.setItem('token', response.token);
            this.router.navigate(['/']);
          },
          (error) => {
            console.error(error.message);
            if (error.status === 401 && error.error.message === 'Email is not verified. Please verify your email before signing in.') {
              this.errorMessage = 'Email is not verified. Please verify your email or change your password.';
            } else {
              this.errorMessage = 'Invalid email or password.';
            }
          }
        )
        .add(() => {
          this.isSubmitting = false;  // Reset submitting flag after the request is complete
        });
    }
  }
}
