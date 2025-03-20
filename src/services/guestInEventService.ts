import apiClient from '../api/apiClient.ts';
import { AxiosResponse } from 'axios';
import { GuestInEvent } from '../types/types';

// Type for creating a new guest in event (without id)
export type GuestInEventCreate = Omit<GuestInEvent, 'id'>;

// Type for updating a guest in event
export type GuestInEventUpdate = Partial<GuestInEvent>;

const guestInEventService = {
  // Get all guest in events
  getAllGuestInEvents: async (): Promise<GuestInEvent[]> => {
    const response: AxiosResponse<GuestInEvent[]> = await apiClient.get('/GuestInEvent');
    return response.data;
  },

  // Get guest in event by id
  getGuestInEvent: async (id: string): Promise<GuestInEvent> => {
    const response: AxiosResponse<GuestInEvent> = await apiClient.get(`/GuestInEvent/${id}`);
    return response.data;
  },

  // Create new guest in event
  createGuestInEvent: async (guestInEvent: GuestInEventCreate): Promise<GuestInEvent> => {
    console.log("Sending to server:", guestInEvent);
    const response: AxiosResponse<GuestInEvent> = await apiClient.post('/GuestInEvent', guestInEvent);
    console.log("no");
    return response.data;
  },

  // Update guest in event
  updateGuestInEvent: async (id: string, guestInEvent: GuestInEventUpdate): Promise<GuestInEvent> => {
    const response: AxiosResponse<GuestInEvent> = await apiClient.put(`/GuestInEvent/${id}`, guestInEvent);
    return response.data;
  },

  // Delete guest in event
  deleteGuestInEvent: async (id: string): Promise<void> => {
    await apiClient.delete(`/GuestInEvent/${id}`);
  },

  // Get guest in events by event id
  getGuestInEventsByEventId: async (eventId: string): Promise<GuestInEvent[]> => {
    const response: AxiosResponse<GuestInEvent[]> = await apiClient.get(`/GuestInEvent/event/${eventId}`);
    return response.data;
  },

  // Get guest in events by guest id
  getGuestInEventsByGuestId: async (guestId: string): Promise<GuestInEvent[]> => {
    const response: AxiosResponse<GuestInEvent[]> = await apiClient.get(`/GuestInEvent/guest/${guestId}`);
    return response.data;
  },

  // Get guest in events by group
  getGuestInEventsByGroup: async (group: string): Promise<GuestInEvent[]> => {
    const response: AxiosResponse<GuestInEvent[]> = await apiClient.get(`/GuestInEvent/group/${group}`);
    return response.data;
  },

// בקשת GET לאירוע עם eventId ספציפי
getConfirmedGuests: async (eventId: string): Promise<GuestInEvent[]> => {
  console.log(eventId);
  const response: AxiosResponse<GuestInEvent[]> = await apiClient.get(`/GuestInEvent/confirmed/${eventId}`);
  console.log(response.data);

  return response.data;
}

};

export default guestInEventService;
