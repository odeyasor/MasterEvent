// מבנה הנתונים של המייל
export type EmailRequest = {
  eventId: string;
  subject: string;
  body: string;
  toEmail:string;
};
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
  id: number;
  name: string;
  organizerId: number;
}
// Enum ל-Gender
export enum Gender {
  female = 1,
  male = 0
}

// טיפוס עבור Guest
export interface Guest {
  id: number;
  name: string;
  mail: string;
  gender: Gender;
  groupId: Number;
}
export interface GuestInEvent {
  id: string;
  guestId: string;
  eventId: string;
  ok: boolean;
  groupId: Number;
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
  eventId: string;
  imageUrl: string;
  blessing: string;
}

export interface Seating {
  id: string;
  eventId: string;
  subGuestId: string;
  table: number;
  seat: number;
} 
export interface SubGuest {
  id: string;
  guestId: string;
  name: string;
  gender: Gender;  
}