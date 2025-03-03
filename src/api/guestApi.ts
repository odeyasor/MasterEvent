import apiClient from './apiClient.ts';
import { Guest, Gender } from '../types/types.ts';

// פונקציות API עבור אורחים
export const guestApi = {
  // קבלת כל האורחים
  getAllGuests: async (): Promise<Guest[]> => {
    const response = await apiClient.get('/Guest');
    return response.data;
  },

  // קבלת אורח לפי מזהה
  getGuest: async (id: string): Promise<Guest> => {
    const response = await apiClient.get(`/Guest/${id}`);
    return response.data;
  },

  // הוספת אורח חדש
  addGuest: async (guest: Omit<Guest, 'id'>): Promise<Guest> => {
    const response = await apiClient.post('/Guest', guest);
    return response.data;
  },

  // עדכון אורח קיים
  updateGuest: async (id: string, guest: Partial<Guest>): Promise<Guest> => {
    const response = await apiClient.put(`/Guest/${id}`, guest);
    return response.data;
  },

  // מחיקת אורח
  deleteGuest: async (id: string): Promise<void> => {
    await apiClient.delete(`/Guest/${id}`);
  },

  // קבלת אורחים לפי שם
  getGuestsByName: async (name: string): Promise<Guest[]> => {
    const response = await apiClient.get('/Guest/by-name', {
      params: { name }
    });
    return response.data;
  },

  // קבלת אורחים לפי מייל
  getGuestsByMail: async (mail: string): Promise<Guest[]> => {
    const response = await apiClient.get('/Guest/by-mail', {
      params: { mail }
    });
    return response.data;
  },

  // קבלת אורחים לפי מגדר
  getGuestsByGender: async (gender: Gender): Promise<Guest[]> => {
    const response = await apiClient.get('/Guest/by-gender', {
      params: { gender }
    });
    return response.data;
  }
};
