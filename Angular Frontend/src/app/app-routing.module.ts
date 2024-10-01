import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { FeedComponent } from './feed/feed.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AuthGuard } from './auth.guard';
import { TweetComponent } from './tweet/tweet.component';
import { MasseageComponent } from './masseage/masseage.component';
import { NotificationComponent } from './notification/notification.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'tweet', component: TweetComponent },
  { path: 'massage', component: MasseageComponent },
  { path: 'notification', component: NotificationComponent },
  { path: 'feed', component: FeedComponent, canActivate: [AuthGuard] },
  { path: 'profile/:id', component: ProfileComponent ,canActivate: [AuthGuard]},

  // Redirect empty path to login page
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Redirect any unknown paths to the login page
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
