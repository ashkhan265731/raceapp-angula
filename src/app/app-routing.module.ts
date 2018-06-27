import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { EventHomeComponent } from './event-home/event-home.component';
import { RegistrationConfirmationComponent } from './registration-confirmation/registration-confirmation.component';

const routes: Routes = [
  {
    path: 'home', component: HomeComponent
  },
  {
    path: 'event_home', component: EventHomeComponent
  },
  {
    path: '', redirectTo: 'home', pathMatch: 'full'
  },
  {
    path: 'forgotpass', component: ForgotPasswordComponent
  },
  {
    path: 'resetpass/:email/:token', component: PasswordResetComponent
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'register', component: RegisterComponent
  },
  {
    path: 'reg-confirmation', component: RegistrationConfirmationComponent
  },
  {
    path: 'producer', loadChildren: './producer/producer.module#ProducerModule'
  },
  {
    path: 'user', loadChildren: './user/user.module#UserModule'
  },
  {
    path: '**', redirectTo: 'home', pathMatch: 'full'
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],

exports: [RouterModule]
})
export class AppRoutingModule { }
