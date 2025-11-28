import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CreateEventComponent } from './components/create-event/create-event.component';
import { EventDetailsComponent } from './components/event-details/event-details.component';
import { SearchEventsComponent } from './components/search-events/search-events.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'events/create', component: CreateEventComponent, canActivate: [authGuard] },
  { path: 'events/search', component: SearchEventsComponent, canActivate: [authGuard] },
  { path: 'events/:id', component: EventDetailsComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/login' }
];