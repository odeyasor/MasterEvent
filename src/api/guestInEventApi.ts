import apiClient from './apiClient.ts';
import { GuestInEvent } from '../types/types.ts';

// פונקציות API עבור אורחים באירועים
export const guestInEventApi = {
  // קבלת כל האורחים באירועים
  getAllGuestsInEvents: async (): Promise<GuestInEvent[]> => {
    const response = await apiClient.get('/GuestInEvent');
    return response.data;
  },

  // קבלת אורח באירוע לפי מזהה
  getGuestInEvent: async (id: string): Promise<GuestInEvent> => {
    const response = await apiClient.get(`/GuestInEvent/${id}`);
    return response.data;
  },

  // הוספת אורח לאירוע
  addGuestInEvent: async (guestInEvent: Omit<GuestInEvent, 'id'>): Promise<GuestInEvent> => {
    const response = await apiClient.post('/GuestInEvent', guestInEvent);
    return response.data;
  },

  // עדכון פרטי אורח באירוע
  updateGuestInEvent: async (id: string, guestInEvent: Partial<GuestInEvent>): Promise<GuestInEvent> => {
    const response = await apiClient.put(`/GuestInEvent/${id}`, guestInEvent);
    return response.data;
  },

  // מחיקת אורח מאירוע
  deleteGuestInEvent: async (id: string): Promise<void> => {
    await apiClient.delete(`/GuestInEvent/${id}`);
  },

  // קבלת אורחים לפי אירוע
  getGuestsByEvent: async (eventId: string): Promise<GuestInEvent[]> => {
    const response = await apiClient.get(`/GuestInEvent/by-event/${eventId}`);
    return response.data;
  },

  // קבלת אירועים של אורח
  getEventsByGuest: async (guestId: string): Promise<GuestInEvent[]> => {
    const response = await apiClient.get(`/GuestInEvent/by-guest/${guestId}`);
    return response.data;
  },

  // עדכון סטטוס אישור הגעה
  updateAttendanceStatus: async (id: string, ok: boolean): Promise<GuestInEvent> => {
    const response = await apiClient.patch(`/GuestInEvent/${id}/status`, { ok });
    return response.data;
  },

  // הקצאת קבוצה לאורח באירוע
  assignGroupToGuestInEvent: async (id: string, groupId: string): Promise<GuestInEvent> => {
    const response = await apiClient.patch(`/GuestInEvent/${id}/group`, { group: groupId });
    return response.data;
  }
};
