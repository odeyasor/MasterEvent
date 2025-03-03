import apiClient from './apiClient.ts';
import { Organizer, Event, Group } from '../types/types.ts';

// פונקציות API עבור מארגנים
export const organizerApi = {
  // קבלת כל המארגנים
  getAllOrganizers: async (): Promise<Organizer[]> => {
    const response = await apiClient.get('/Organizer');
    return response.data;
  },

  // קבלת מארגן לפי מזהה
  getOrganizer: async (id: string): Promise<Organizer> => {
    const response = await apiClient.get(`/Organizer/${id}`);
    return response.data;
  },

  // הוספת מארגן חדש
  addOrganizer: async (organizer: Omit<Organizer, 'id'>): Promise<Organizer> => {
    const response = await apiClient.post('/Organizer', organizer);
    return response.data;
  },

  // עדכון מארגן קיים
  updateOrganizer: async (id: string, organizer: Partial<Organizer>): Promise<Organizer> => {
    const response = await apiClient.put(`/Organizer/${id}`, organizer);
    return response.data;
  },

  // מחיקת מארגן
  deleteOrganizer: async (id: string): Promise<void> => {
    await apiClient.delete(`/Organizer/${id}`);
  },

  // התחברות מארגן
  loginOrganizer: async (email: string, password: string): Promise<{ token: string; organizer: Organizer }> => {
    const response = await apiClient.post('/Organizer/login', { email, password });
    return response.data;
  },

  // קבלת הקבוצות של מארגן
  getOrganizerGroups: async (organizerId: string): Promise<Group[]> => {
    const response = await apiClient.get(`/Organizer/${organizerId}/groups`);
    return response.data;
  },

  // קבלת האירועים של מארגן
  getOrganizerEvents: async (organizerId: string): Promise<Event[]> => {
    const response = await apiClient.get(`/Organizer/${organizerId}/events`);
    return response.data;
  }
};
