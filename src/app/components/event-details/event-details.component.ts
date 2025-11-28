import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EventService } from '../../services/event.service';
import { Event, Attendee, AttendanceUpdate } from '../../models/event.model';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css'],
})
export class EventDetailsComponent implements OnInit {
  eventId!: number;
  event: Event | null = null;
  attendees: Attendee[] = [];
  isOrganizer = false;
  isLoading = true;
  errorMessage = '';
  successMessage = '';

  inviteUserId = '';
  inviteUserEmail = '';
  inviteMethod: 'id' | 'email' = 'email';
  selectedStatus: 'Going' | 'Maybe' | 'Not Going' = 'Maybe';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.eventId = +params['id'];
      this.loadEventDetails();
    });
  }

  loadEventDetails(): void {
    this.isLoading = true;
    // Load attendees to check if user is organizer
    this.eventService.getAttendees(this.eventId).subscribe({
      next: (attendees) => {
        this.attendees = attendees;
        this.isOrganizer = attendees.some((a) => a.role === 'organizer');
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading event details:', error);
        this.isLoading = false;
        // this.errorMessage = 'Failed to load event details';
      },
    });
  }

  inviteUser(): void {
    let inviteData: { user_id?: number; email?: string } = {};

    if (this.inviteMethod === 'id') {
      if (!this.inviteUserId) {
        this.errorMessage = 'Please enter a user ID';
        return;
      }
      inviteData.user_id = +this.inviteUserId;
    } else {
      if (!this.inviteUserEmail) {
        this.errorMessage = 'Please enter a user email';
        return;
      }
      inviteData.email = this.inviteUserEmail;
    }

    this.eventService.inviteUser(this.eventId, inviteData).subscribe({
      next: (response) => {
        this.successMessage = response.message || 'User invited successfully!';
        this.inviteUserId = '';
        this.inviteUserEmail = '';
        this.loadEventDetails();
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      error: (error) => {
        this.errorMessage = error.error?.detail || 'Failed to invite user';
        setTimeout(() => (this.errorMessage = ''), 3000);
      },
    });
  }

  updateAttendance(): void {
    const data: AttendanceUpdate = { status: this.selectedStatus };
    this.eventService.updateAttendance(this.eventId, data).subscribe({
      next: (response) => {
        this.successMessage = `Attendance updated to: ${this.selectedStatus}`;
        this.loadEventDetails();
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      error: (error) => {
        this.errorMessage =
          error.error?.detail || 'Failed to update attendance';
        setTimeout(() => (this.errorMessage = ''), 3000);
      },
    });
  }

  deleteEvent(): void {
    if (!confirm('Are you sure you want to delete this event?')) {
      return;
    }

    this.eventService.deleteEvent(this.eventId).subscribe({
      next: (response) => {
        this.successMessage = 'Event deleted successfully!';
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1500);
      },
      error: (error) => {
        this.errorMessage = error.error?.detail || 'Failed to delete event';
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
