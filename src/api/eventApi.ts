import apiClient from './apiClient.ts';
import { Event } from '../types/types.ts'

// פונקציות API עבור אירועים
export const eventApi = {
  // קבלת כל האירועים
  getAllEvents: async (): Promise<Event[]> => {
    const response = await apiClient.get('/Event');
    return response.data;
  },

  // קבלת אירוע לפי מזהה
  getEvent: async (id: string): Promise<Event> => {
    const response = await apiClient.get(`/Event/${id}`);
    return response.data;
  },

  // הוספת אירוע חדש
  addEvent: async (event: Omit<Event, 'id'>): Promise<Event> => {
    const response = await apiClient.post('/Event', event);
    return response.data;
  },

  // עדכון אירוע קיים
  updateEvent: async (id: string, event: Partial<Event>): Promise<Event> => {
    const response = await apiClient.put(`/Event/${id}`, event);
    return response.data;
  },

  // מחיקת אירוע
  deleteEvent: async (id: string): Promise<void> => {
    await apiClient.delete(`/Event/${id}`);
  },

  // קבלת אירועים לפי מארגן
  getEventsByOrganizerId: async (organizerId: string): Promise<Event[]> => {
    const response = await apiClient.get(`/Event/organizer/${organizerId}`);
    return response.data;
  },

  // קבלת אירועים לפי טווח תאריכים
  getEventsByDateRange: async (startDate: Date, endDate: Date): Promise<Event[]> => {
    const response = await apiClient.get('/Event/date-range', {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }
    });
    return response.data;
  },

  // קבלת אירועים לפי כתובת
  getEventsByAddress: async (address: string): Promise<Event[]> => {
    const response = await apiClient.get('/Event/address', {
      params: { address }
    });
    return response.data;
  },

  // קבלת אירועים עתידיים
  getUpcomingEvents: async (): Promise<Event[]> => {
    const response = await apiClient.get('/Event/upcoming');
    return response.data;
  },

  // קבלת אירועים לפי מילת מפתח בכתובת
  getEventsByAddressKeyword: async (keyword: string): Promise<Event[]> => {
    const response = await apiClient.get('/Event/address-keyword', {
      params: { keyword }
    });
    return response.data;
  }
};
