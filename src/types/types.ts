export interface Event {
  id: number;
  organizerId: string;
  eventName: string;
  eventDate: string;  
  address: string;
  details: string;
  seperation: boolean;
  invitation: string;
  photos?: PhotosFromEvent[];  
  guests?: GuestInEvent[];  
}

export interface Group {
  id: string;
  name: string;
  organizerId: string;
  guestId: string;
}
// Enum ל-Gender
export enum Gender {
  female = 1,
  male = 0
}

// טיפוס עבור Guest
export interface Guest {
  id: string;
  name: string;
  mail: string;
  gender: Gender;
}
export interface GuestInEvent {
  id: string;
  guestId: string;
  guest: Guest;  
  eventId: string;
  event_: Event;
  ok: boolean;
  group: string;
  group_: Group; 
}

  export interface Organizer {
    id: string;
    name: string;
    mail: string;
    password: string;
    events?: string[];
    groups?: string[];
}
export interface PhotosFromEvent {
  id: string;
  guestId: string;
  guest: Guest; 
  eventId: string;
  event_: Event;  
  imageUrl: string;
  blessing: string;
}

export interface Seating {
  id: string;
  eventId: string;
  event_: Event;  
  subGuestId: string;
  subGuest: SubGuest;  
  table: number;
  seat: number;
} 
export interface SubGuest {
  id: string;
  guestId: string;
  guest: Guest; 
  name: string;
  gender: Gender;  
}