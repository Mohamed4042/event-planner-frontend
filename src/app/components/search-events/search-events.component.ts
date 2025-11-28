import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event.model';

@Component({
  selector: 'app-search-events',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './search-events.component.html',
  styleUrls: ['./search-events.component.css']
})
export class SearchEventsComponent {
  keyword = '';
  startDate = '';
  endDate = '';
  role = '';
  
  searchResults: Event[] = [];
  isLoading = false;
  hasSearched = false;
  errorMessage = '';

  constructor(
    private eventService: EventService,
    private router: Router
  ) {}

  onSearch(): void {
    this.isLoading = true;
    this.hasSearched = true;
    this.errorMessage = '';

    this.eventService.searchEvents(
      this.keyword || undefined,
      this.startDate || undefined,
      this.endDate || undefined,
      this.role || undefined
    ).subscribe({
      next: (events) => {
        this.searchResults = events;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Search error:', error);
        this.errorMessage = 'Failed to search events';
        this.isLoading = false;
      }
    });
  }

  clearSearch(): void {
    this.keyword = '';
    this.startDate = '';
    this.endDate = '';
    this.role = '';
    this.searchResults = [];
    this.hasSearched = false;
  }

  navigateToEvent(eventId: number): void {
    this.router.navigate(['/events', eventId]);
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}