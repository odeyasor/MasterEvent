import apiClient from './apiClient.ts';
import { Seating, SubGuest, Gender } from '../types/types.ts';

// פונקציות API עבור ישיבה
export const seatingApi = {
  // קבלת כל הישיבות
  getAllSeatings: async (): Promise<Seating[]> => {
    const response = await apiClient.get('/Seating');
    return response.data;
  },

  // קבלת ישיבה לפי מזהה
  getSeating: async (id: string): Promise<Seating> => {
    const response = await apiClient.get(`/Seating/${id}`);
    return response.data;
  },

  // הוספת ישיבה חדשה
  addSeating: async (seating: Omit<Seating, 'id'>): Promise<Seating> => {
    const response = await apiClient.post('/Seating', seating);
    return response.data;
  },

  // עדכון ישיבה קיימת
  updateSeating: async (id: string, seating: Partial<Seating>): Promise<Seating> => {
    const response = await apiClient.put(`/Seating/${id}`, seating);
    return response.data;
  },

  // מחיקת ישיבה
  deleteSeating: async (id: string): Promise<void> => {
    await apiClient.delete(`/Seating/${id}`);
  },

  // חיפוש אורחים לפי מזהה אורח
  getSubGuestsByGuestId: async (guestId: string): Promise<SubGuest[]> => {
    const response = await apiClient.get('/Seating/subguest/guest', { params: { guestId } });
    return response.data;
  },

  // חיפוש אורחים לפי שם (כולל חיפוש חלקי)
  getSubGuestsByName: async (name: string): Promise<SubGuest[]> => {
    const response = await apiClient.get('/Seating/subguest/name', { params: { name } });
    return response.data;
  },

  // חיפוש אורחים לפי מגדר
  getSubGuestsByGender: async (gender: Gender): Promise<SubGuest[]> => {
    const response = await apiClient.get('/Seating/subguest/gender', { params: { gender } });
    return response.data;
  }
};
