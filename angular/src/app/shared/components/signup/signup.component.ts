
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
declare let window: any;


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
})

export class SignupComponent {
  signupForm: FormGroup;
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService,private router: Router) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      birthday: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, this.emailValidator]],
      password: ['', [Validators.required, Validators.minLength(6), this.passwordValidator]],
      publicKey: ['']
    });
  }
  ngOnInit() { // Add ngOnInit lifecycle hook
    this.getPublicAddress();
  }

  async getPublicAddress() { // Add this method to get the public address from MetaMask
    if (typeof window.ethereum !== 'undefined') {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      this.signupForm.get('publicKey')?.setValue(account);
    }
  }

  emailValidator(control: any) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(control.value) ? null : { invalidEmail: true };
  }

  // Custom password validator using regular expression
  passwordValidator(control: any) {
    // Password must contain at least one uppercase letter, one lowercase letter, and one digit
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    return passwordPattern.test(control.value) ? null : { invalidPassword: true };
  }

  onSubmit() {
    console.log('Submit button clicked');
    console.log('Form values:', this.signupForm.value);
    console.log('Form:', this.signupForm);

    if (this.signupForm.get('name')) {
      console.log('Name control status:', this.signupForm.get('name')?.status);
      console.log('Name control errors:', this.signupForm.get('name')?.errors);
    }
    
    if (this.signupForm.get('surname')) {
      console.log('Surname control status:', this.signupForm.get('surname')?.status);
      console.log('Surname control errors:', this.signupForm.get('surname')?.errors);
    }
    
    if (this.signupForm.get('birthday')) {
      console.log('Birthday control status:', this.signupForm.get('birthday')?.status);
      console.log('Birthday control errors:', this.signupForm.get('birthday')?.errors);
    }
    
    if (this.signupForm.get('email')) {
      console.log('Email control status:', this.signupForm.get('email')?.status);
      console.log('Email control errors:', this.signupForm.get('email')?.errors);
    }
    
    if (this.signupForm.get('password')) {
      console.log('Password control status:', this.signupForm.get('password')?.status);
      console.log('Password control errors:', this.signupForm.get('password')?.errors);
    }

    if (!this.signupForm.get('publicKey')) {
     this.signupForm.get('publicKey')?.setValue('');
    }else{
      console.log('publicKey control status:', this.signupForm.get('publicKey')?.status);
      console.log('publicKey control errors:', this.signupForm.get('publicKey')?.errors);
    }
    
    if (this.signupForm.valid) {
      // Set loading to true when form is submitted
      this.loading = true;

      // Reset error and success messages on new submission
      this.errorMessage = '';
      this.successMessage = '';
      // Call the register method in AuthService to send data to the server
      this.authService.register(this.signupForm.value).subscribe(
        response => {
          console.log('Registration successful:', response);
          // Provide feedback to the user
          this.successMessage = 'Registration successful. Please check your email for verification. Redirecting you back to login.';
                  // Delay redirection to login after 5 seconds
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 5000); // 5000 milliseconds = 5 seconds
        },
        error => {
          console.error('Registration failed:', error);
          // Set the error message for display
          this.errorMessage = 'Registration failed. Please try again.';
        }
      ).add(() => {
        // Set loading back to false when the subscription is complete (either success or error)
        this.loading = false;
      });
    }
  }
}