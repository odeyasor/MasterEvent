import apiClient from './apiClient.ts';
import { AxiosResponse } from 'axios';
import { Event, SubGuest } from '../types/types';
// Type for creating a new event (without id)
export type EventCreate = Omit<Event, 'id'>;

// Type for updating an event
export type EventUpdate = Partial<Event>;

const eventService = {
  // Get all events
  getAllEvents: async (): Promise<Event[]> => {
    const response: AxiosResponse<Event[]> = await apiClient.get('/Event');
    return response.data;
  },

  // Get event by id
  getEvent: async (id: string): Promise<Event> => {
    const response: AxiosResponse<Event> = await apiClient.get(`/Event/${id}`);
    return response.data;
  },

  // Create new event
  createEvent: async (event: EventCreate): Promise<Event> => {
    const response: AxiosResponse<Event> = await apiClient.post('/Event', event);
    return response.data;
  },

  // Update event
  updateEvent: async (id: string, event: EventUpdate): Promise<Event> => {
    console.log("🔄 Updating event:", id, event);

    const response: AxiosResponse<Event> = await apiClient.put(`/Event/${id}`, event);
    return response.data;
  },

  // Delete event
  deleteEvent: async (id: string): Promise<void> => {
    await apiClient.delete(`/Event/${id}`);
  },

  // Get events by organizer id
  getEventsByOrganizerId: async (organizerId: string): Promise<Event[]> => {
    const response: AxiosResponse<Event[]> = await apiClient.get(`/Event/organizer/${organizerId}`);
    console.log("Response from API:", response.data);  // לבדוק מה מגיע
    return response.data;
  },
  GetGuestsByEventId: async (eventId: number): Promise<SubGuest[]> => {
    const response:AxiosResponse<SubGuest[]> = await apiClient.get(`/Event/guests/${eventId}`);
    return response.data;
  },
  // Get events by date range
  getEventsByDateRange: async (startDate: string, endDate: string): Promise<Event[]> => {
    const response: AxiosResponse<Event[]> = await apiClient.get('/Event/daterange', {
      params: { startDate, endDate }
    });
    return response.data;
  },

  // Get events by address or keyword
  getEventsByAddress: async (address: string): Promise<Event[]> => {
    const response: AxiosResponse<Event[]> = await apiClient.get('/Event/address', {
      params: { address }
    });
    return response.data;
  },

  // Get upcoming events
  getUpcomingEvents: async (): Promise<Event[]> => {
    const response: AxiosResponse<Event[]> = await apiClient.get('/Event/upcoming');
    return response.data;
  }
};

export default eventService;
