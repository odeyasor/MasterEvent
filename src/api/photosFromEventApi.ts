import apiClient from './apiClient.ts';
import { PhotosFromEvent } from '../types/types.ts';

// פונקציות API עבור תמונות מאירועים
export const photosFromEventApi = {
  // קבלת כל התמונות מאירועים
  getAllPhotos: async (): Promise<PhotosFromEvent[]> => {
    const response = await apiClient.get('/PhotosFromEvent');
    return response.data;
  },

  // קבלת תמונה לפי מזהה
  getPhoto: async (id: string): Promise<PhotosFromEvent> => {
    const response = await apiClient.get(`/PhotosFromEvent/${id}`);
    return response.data;
  },

  // הוספת תמונה חדשה לאירוע
  addPhoto: async (photo: Omit<PhotosFromEvent, 'id'>): Promise<PhotosFromEvent> => {
    const response = await apiClient.post('/PhotosFromEvent', photo);
    return response.data;
  },

  // עדכון תמונה קיימת
  updatePhoto: async (id: string, photo: Partial<PhotosFromEvent>): Promise<PhotosFromEvent> => {
    const response = await apiClient.put(`/PhotosFromEvent/${id}`, photo);
    return response.data;
  },

  // מחיקת תמונה
  deletePhoto: async (id: string): Promise<void> => {
    await apiClient.delete(`/PhotosFromEvent/${id}`);
  },

  // חיפוש תמונות לפי מזהה אורח
  getPhotosByGuestId: async (guestId: string): Promise<PhotosFromEvent[]> => {
    const response = await apiClient.get('/PhotosFromEvent/guest', { params: { guestId } });
    return response.data;
  },

  // חיפוש תמונות לפי מזהה אירוע
  getPhotosByEventId: async (eventId: string): Promise<PhotosFromEvent[]> => {
    const response = await apiClient.get('/PhotosFromEvent/event', { params: { eventId } });
    return response.data;
  },

  // חיפוש תמונות לפי ברכה
  getPhotosByBlessing: async (blessingText: string): Promise<PhotosFromEvent[]> => {
    const response = await apiClient.get('/PhotosFromEvent/blessing', { params: { blessingText } });
    return response.data;
  },

  // חיפוש תמונות לפי אירוע ומיון לפי שם האורח
  getPhotosByEventSortedByGuestName: async (eventId: string): Promise<PhotosFromEvent[]> => {
    const response = await apiClient.get('/PhotosFromEvent/event/guest', { params: { eventId } });
    return response.data;
  },

  // חיפוש תמונות עם מיון לפי תאריך (הפונקציה תומכת בסינון לפי תאריך בעתיד)
  getPhotosSortedByNewest: async (): Promise<PhotosFromEvent[]> => {
    const response = await apiClient.get('/PhotosFromEvent/sorted/newest');
    return response.data;
  },

  // חיפוש עם דילוג והגבלה (Pagination)
  getPhotosPaged: async (skip: number, take: number): Promise<PhotosFromEvent[]> => {
    const response = await apiClient.get('/PhotosFromEvent/paged', { params: { skip, take } });
    return response.data;
  },

  // בדיקה אם קיימות תמונות מאירוע מסוים
  areTherePhotosFromEvent: async (eventId: string): Promise<boolean> => {
    const response = await apiClient.get('/PhotosFromEvent/exist', { params: { eventId } });
    return response.data;
  }
};
