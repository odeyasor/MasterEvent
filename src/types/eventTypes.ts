export interface Event {
    id?: string;
    eventName: string;
    eventDate: string;
    address: string;
    details: string;
    separation: boolean;
    invitation?: File;
    guests?: string[];
  }
  