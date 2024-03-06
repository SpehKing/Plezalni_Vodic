//MODULES
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CommonModule } from "@angular/common";

//COMPONENTS
import { AreaComponent } from '../shared/components/area/area.component';
import { ProfileComponent } from '../shared/components/profile/profile.component';
import { MainPageComponent } from '../shared/components/main-page/main-page.component';
import { GroupEventComponent } from '../shared/components/group-event/group-event.component';
import { LoginComponent } from '../shared/components/login/login.component';
import { SignupComponent } from '../shared/components/signup/signup.component';
import { PasswordResetComponent } from '../shared/components/password-reset/password-reset.component';
import { PasswordResetCompleteComponent } from '../shared/components/password-reset-complete/password-reset-complete.component';
import { EmailVerificationComponent } from '../shared/components/email-verification/email-verification.component';

const routes: Routes = [
    { path: '', component: MainPageComponent },
    { path: 'profile/:userId', component: ProfileComponent },
    //TODO change url route names to slovene
    { path: "plezalisce/:areaID", component: AreaComponent },
    { path: "dogodki", component: GroupEventComponent },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'password-reset', component: PasswordResetComponent },
    { path: 'password-reset-complete', component: PasswordResetCompleteComponent },
    { path: 'email-verification', component: EmailVerificationComponent, }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})

export class AppRoutingModule {}
