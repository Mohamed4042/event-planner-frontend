import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Event,
  EventCreate,
  Attendee,
  AttendanceUpdate,
  UserInvite,
} from '../models/event.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private apiUrl = 'http://127.0.0.1:8000/events';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  createEvent(event: EventCreate): Observable<Event> {
    return this.http.post<Event>(`${this.apiUrl}/create`, event, {
      headers: this.getHeaders(),
    });
  }

  getOrganizedEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/organized`, {
      headers: this.getHeaders(),
    });
  }

  getInvitedEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/invited`, {
      headers: this.getHeaders(),
    });
  }

  inviteUser(
    eventId: number,
    inviteData: { user_id?: number; email?: string }
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}/${eventId}/invite`, inviteData, {
      headers: this.getHeaders(),
    });
  }

  deleteEvent(eventId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${eventId}`, {
      headers: this.getHeaders(),
    });
  }

  updateAttendance(eventId: number, data: AttendanceUpdate): Observable<any> {
    return this.http.post(`${this.apiUrl}/${eventId}/attendance`, data, {
      headers: this.getHeaders(),
    });
  }

  getAttendees(eventId: number): Observable<Attendee[]> {
    return this.http.get<Attendee[]>(`${this.apiUrl}/${eventId}/attendees`, {
      headers: this.getHeaders(),
    });
  }

  searchEvents(
    keyword?: string,
    startDate?: string,
    endDate?: string,
    role?: string
  ): Observable<Event[]> {
    let params: any = {};
    if (keyword) params.keyword = keyword;
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    if (role) params.role = role;

    return this.http.get<Event[]>(`${this.apiUrl}/search`, {
      headers: this.getHeaders(),
      params,
    });
  }
}
