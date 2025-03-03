import apiClient from './apiClient.ts';
import { Group } from '../types/types.ts';

// פונקציות API עבור קבוצות
export const groupApi = {
  // קבלת כל הקבוצות
  getAllGroups: async (): Promise<Group[]> => {
    const response = await apiClient.get('/Group');
    return response.data;
  },

  // קבלת קבוצה לפי מזהה
  getGroup: async (id: string): Promise<Group> => {
    const response = await apiClient.get(`/Group/${id}`);
    return response.data;
  },

  // הוספת קבוצה חדשה
  addGroup: async (group: Omit<Group, 'id'>): Promise<Group> => {
    const response = await apiClient.post('/Group', group);
    return response.data;
  },

  // עדכון קבוצה קיימת
  updateGroup: async (id: string, group: Partial<Group>): Promise<Group> => {
    const response = await apiClient.put(`/Group/${id}`, group);
    return response.data;
  },

  // מחיקת קבוצה
  deleteGroup: async (id: string): Promise<void> => {
    await apiClient.delete(`/Group/${id}`);
  },

  // קבלת קבוצות לפי מארגן
  getGroupsByOrganizerId: async (organizerId: string): Promise<Group[]> => {
    const response = await apiClient.get('/Group/by-organizer', {
      params: { organizerId }
    });
    return response.data;
  },

  // קבלת קבוצות לפי שם
  getGroupsByName: async (name: string): Promise<Group[]> => {
    const response = await apiClient.get('/Group/by-name', {
      params: { name }
    });
    return response.data;
  },

  // קבלת קבוצות לפי אורח
  getGroupsByGuestId: async (guestId: string): Promise<Group[]> => {
    const response = await apiClient.get('/Group/by-guest', {
      params: { guestId }
    });
    return response.data;
  },

  // קבלת מספר מוגבל של קבוצות
  getTopGroups: async (count: number): Promise<Group[]> => {
    const response = await apiClient.get('/Group/top', {
      params: { count }
    });
    return response.data;
  }
};
