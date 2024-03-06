import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-email-verification',
  template: `
    <div class="verification-message">
      <h2>Email Verified Successfully!</h2>
      <p>You are being redirected back to login.</p>
    </div>
  `,
  styles: [
    `
      .verification-message {
        text-align: center;
        margin-top: 100px;
      }
    `,
  ],
})
export class EmailVerificationComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    // Wait for 4 seconds and then navigate to the login page
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 6000);
  }
}
