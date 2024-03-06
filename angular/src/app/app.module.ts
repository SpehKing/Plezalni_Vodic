//DEFAULT-MODULES
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

//NGX-BOOTSTRAP-MODULES
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { RatingModule } from 'ngx-bootstrap/rating';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';

//ANGULAR-MATERIAL
import {MatRadioModule} from '@angular/material/radio';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

//SLOVENIAN LANGUAGE
import { registerLocaleData } from '@angular/common';
import localeSl from '@angular/common/locales/sl';

registerLocaleData(localeSl);

//COMPONENTS
import { MainPageComponent } from "./shared/components/main-page/main-page.component";
import { MapComponent } from './shared/components/map/map.component';
import { FrameworkComponent } from './shared/components/framework/framework.component';
import { AboutComponent } from './shared/components/about/about.component';
import { ProfileComponent } from "./shared/components/profile/profile.component";
import { UserClimbsComponent } from './shared/components/user-climbs/user-climbs.component';
import { AreaComponent } from './shared/components/area/area.component';
import { TableComponent } from "./shared/components/table/table.component";
import { AddClimbModalComponent } from './shared/components/add-climb-modal/add-climb-modal.component';
import { CommentComponent } from './shared/components/comment/comment.component';
import { CommentModalComponent } from './shared/components/comment-modal/comment-modal.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { GroupEventComponent } from './shared/components/group-event/group-event.component';
import { EventListComponent } from './shared/components/event-list/event-list.component';
import { LoginComponent } from './shared/components/login/login.component';
import { SignupComponent } from './shared/components/signup/signup.component';
import { PasswordResetComponent } from './shared/components/password-reset/password-reset.component';
import { PasswordResetCompleteComponent } from './shared/components/password-reset-complete/password-reset-complete.component';
import { EmailVerificationComponent } from './shared/components/email-verification/email-verification.component';
import { ClimbingListComponent } from './shared/components/climbing-list/climbing-list.component';
import { SingleEventComponent } from "./shared/components/single-event/single-event.component";
import { UserChartComponent } from "./shared/components/user-chart/user-chart.component";

//Pipes
import { FirstSentencePipe } from './shared/pipes/first-sentence.pipe';
import { DateFormatPipe } from './shared/pipes/date-format.pipe';
import { DateEventFormatPipe } from "./shared/pipes/date-format-event.pipe";
import { AddEurPipe } from "./shared/pipes/currency.pipe";
import { PluralParticipantePipe } from "./shared/pipes/plural-participant.pipe";
import { ShowClosestDateFirstPipe } from "./shared/pipes/show-closest-date-first.pipe";



@NgModule({
  declarations: [
    MainPageComponent,
    ProfileComponent,
    FrameworkComponent,
    AboutComponent,
    UserClimbsComponent,
    AreaComponent,
    TableComponent,
    AddClimbModalComponent,
    CommentComponent,
    CommentModalComponent,
    NavbarComponent,
    FooterComponent,
    GroupEventComponent,
    EventListComponent,
    NavbarComponent,
    FooterComponent,
    MapComponent,
    ClimbingListComponent,
    MainPageComponent,
    LoginComponent,
    SignupComponent,
    PasswordResetComponent,
    PasswordResetCompleteComponent,
    EmailVerificationComponent,
    FrameworkComponent,
    FirstSentencePipe,
    DateFormatPipe,
    SingleEventComponent,
    DateEventFormatPipe,
    AddEurPipe,
    PluralParticipantePipe,
    ShowClosestDateFirstPipe,
    UserChartComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CarouselModule.forRoot(),
    AccordionModule.forRoot(),
    BrowserAnimationsModule,
    RatingModule.forRoot(),
    HttpClientModule,
    PaginationModule.forRoot(),
    ModalModule.forRoot(),
    ToastrModule.forRoot(),
    RouterModule.forRoot([
      { path: '', component: MainPageComponent },
      { path: 'profile/:userId', component: ProfileComponent },
      { path: 'plezalisce/:areaID', component: AreaComponent },
      { path: 'dogodki', component: GroupEventComponent },
      { path: 'dogodki', component: EventListComponent },
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent },
      { path: 'password-reset', component: PasswordResetComponent },
      { path: 'password-reset-complete', component: PasswordResetCompleteComponent },
      { path: 'email-verification', component: EmailVerificationComponent },
      { path: 'dogodki/:id', component: SingleEventComponent },
      { path: 'oNas', component: AboutComponent }

    ]),
    MatRadioModule,
    BsDatepickerModule.forRoot(),
    MatFormFieldModule,
    FormsModule,
    MatInputModule
  ],
  providers: [],
  bootstrap: [FrameworkComponent]
})

export class AppModule {}