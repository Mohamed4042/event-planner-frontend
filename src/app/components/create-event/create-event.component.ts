
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { EventService } from '../../services/event.service';
import { EventCreate } from '../../models/event.model';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent {
  event: EventCreate = {
    title: '',
    date: '',
    time: '',
    location: '',
    description: ''
  };

  errorMessage = '';
  successMessage = '';
  isLoading = false;

  constructor(
    private eventService: EventService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.event.title || !this.event.date || !this.event.time || 
        !this.event.location || !this.event.description) {
      this.errorMessage = 'All fields are required';
      return;
    }

    this.isLoading = true;
    this.eventService.createEvent(this.event).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Event created successfully!';
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1500);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.detail || 'Failed to create event';
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/dashboard']);
  }
}