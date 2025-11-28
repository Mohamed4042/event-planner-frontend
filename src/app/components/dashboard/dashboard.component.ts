import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  organizedEvents: Event[] = [];
  invitedEvents: Event[] = [];
  isLoadingOrganized = true;
  isLoadingInvited = true;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private eventService: EventService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOrganizedEvents();
    this.loadInvitedEvents();
  }

  loadOrganizedEvents(): void {
    this.isLoadingOrganized = true;
    this.eventService.getOrganizedEvents().subscribe({
      next: (events) => {
        this.organizedEvents = events;
        this.isLoadingOrganized = false;
      },
      error: (error) => {
        console.error('Error loading organized events:', error);
        this.isLoadingOrganized = false;
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
      },
    });
  }

  loadInvitedEvents(): void {
    this.isLoadingInvited = true;
    this.eventService.getInvitedEvents().subscribe({
      next: (events) => {
        this.invitedEvents = events;
        this.isLoadingInvited = false;
      },
      error: (error) => {
        console.error('Error loading invited events:', error);
        this.isLoadingInvited = false;
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
      },
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateToCreateEvent(): void {
    this.router.navigate(['/events/create']);
  }

  navigateToEventDetails(eventId: number): void {
    this.router.navigate(['/events', eventId]);
  }

  navigateToSearch(): void {
    this.router.navigate(['/events/search']);
  }
}
