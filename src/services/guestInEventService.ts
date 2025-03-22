import apiClient from '../api/apiClient.ts';
import { AxiosResponse } from 'axios';
import { GuestInEvent } from '../types/types';

// Type for creating a new guest in event (without id)
export type GuestInEventCreate = Omit<GuestInEvent, 'id'>;

// Type for updating a guest in event
export type GuestInEventUpdate = Partial<GuestInEvent>;

const guestInEventService = {
  // קבלת כל האורחים באירוע
  getAllGuestInEvents: async (): Promise<GuestInEvent[]> => {
    const response: AxiosResponse<GuestInEvent[]> = await apiClient.get('/GuestInEvent');
    return response.data;
  },

  // קבלת אורח לפי ID
  getGuestInEvent: async (id: string): Promise<GuestInEvent> => {
    const response: AxiosResponse<GuestInEvent> = await apiClient.get(`/GuestInEvent/${id}`);
    return response.data;
  },

  // יצירת אורח חדש באירוע
  createGuestInEvent: async (guestInEvent: GuestInEventCreate): Promise<GuestInEvent> => {
    const response: AxiosResponse<GuestInEvent> = await apiClient.post('/GuestInEvent', guestInEvent);
    return response.data;
  },

  // עדכון אורח באירוע
  updateGuestInEvent: async (id: string, guestInEvent: GuestInEventUpdate): Promise<GuestInEvent> => {
    const response: AxiosResponse<GuestInEvent> = await apiClient.put(`/GuestInEvent/${id}`, guestInEvent);
    return response.data;
  },

  // מחיקת אורח מאירוע
  deleteGuestInEvent: async (id: string): Promise<void> => {
    await apiClient.delete(`/GuestInEvent/${id}`);
  },

  // קבלת רשימת האורחים באירוע לפי eventId
  getGuestInEventsByEventId: async (eventId: string): Promise<GuestInEvent[]> => {
    const response: AxiosResponse<GuestInEvent[]> = await apiClient.get(`/GuestInEvent/event/${eventId}`);
    return response.data;
  },

  // קבלת רשימת האורחים המאושרים בלבד באירוע
  getConfirmedGuests: async (eventId: string): Promise<GuestInEvent[]> => {
    const response: AxiosResponse<GuestInEvent[]> = await apiClient.get(`/GuestInEvent/confirmed/${eventId}`);
    return response.data;
  },

   // סידור אורחים לשולחנות לפי eventId ומספר מקומות בשולחן
   assignGuestsToTables: async (eventId: number, seatsPerTable: number): Promise<Record<number, GuestInEvent[]>> => {
    const response: AxiosResponse<Record<number, GuestInEvent[]>> = await apiClient.get(
      `/GuestInEvent/assign-tables?eventId=${eventId}&seatsPerTable=${seatsPerTable}`
    );
    return response.data;
  }

};

export default guestInEventService;
