export interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  organizer_id: number;
}

export interface EventCreate {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
}

export interface Attendee {
  user_id: number;
  role: string;
  status: string;
}

export interface AttendanceUpdate {
  status: 'Going' | 'Maybe' | 'Not Going';
}

export interface UserInvite {
  user_id?: number;
  email?: string;
}
