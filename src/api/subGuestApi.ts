import apiClient from './apiClient.ts';
import { SubGuest, Gender } from '../types/types.ts';

// פונקציות API עבור אורחים משנה
export const subGuestApi = {
  // קבלת כל האורחים משנה
  getAllSubGuests: async (): Promise<SubGuest[]> => {
    const response = await apiClient.get('/SubGuest');
    return response.data;
  },

  // קבלת אורח משנה לפי מזהה
  getSubGuest: async (id: string): Promise<SubGuest> => {
    const response = await apiClient.get(`/SubGuest/${id}`);
    return response.data;
  },

  // הוספת אורח משנה חדש
  addSubGuest: async (subGuest: Omit<SubGuest, 'id'>): Promise<SubGuest> => {
    const response = await apiClient.post('/SubGuest', subGuest);
    return response.data;
  },

  // עדכון אורח משנה קיים
  updateSubGuest: async (id: string, subGuest: Partial<SubGuest>): Promise<SubGuest> => {
    const response = await apiClient.put(`/SubGuest/${id}`, subGuest);
    return response.data;
  },

  // מחיקת אורח משנה
  deleteSubGuest: async (id: string): Promise<void> => {
    await apiClient.delete(`/SubGuest/${id}`);
  },

  // חיפוש אורחים משנה לפי חלק מהשם
  getSubGuestsByName: async (subGuestName: string): Promise<SubGuest[]> => {
    const response = await apiClient.get('/SubGuest/name', { params: { subGuestName } });
    return response.data;
  },

  // חיפוש אורחים משנה לפי מגדר
  getSubGuestsByGender: async (gender: Gender): Promise<SubGuest[]> => {
    const response = await apiClient.get('/SubGuest/gender', { params: { gender } });
    return response.data;
  }
};
