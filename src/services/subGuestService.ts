import apiClient from '../api/apiClient.ts';
import { AxiosResponse } from 'axios';
import { SubGuest,Gender, Guest } from '../types/types';

// Type for creating a new subguest (without id)
export type SubGuestCreate = Omit<SubGuest, 'id'>;

// Type for updating a subguest
export type SubGuestUpdate = Partial<SubGuest>;

const subGuestService = {
  // Get all subguests
  getAllSubGuests: async (): Promise<SubGuest[]> => {
    const response: AxiosResponse<SubGuest[]> = await apiClient.get('/SubGuest');
    return response.data;
  },

  // Get subguest by id
  getSubGuest: async (id: string): Promise<SubGuest> => {
    const response: AxiosResponse<SubGuest> = await apiClient.get(`/SubGuest/${id}`);
    return response.data;
  },

  // Create new subguest
  createSubGuest: async (subGuest: SubGuestCreate): Promise<SubGuest> => {
    const response: AxiosResponse<SubGuest> = await apiClient.post('/SubGuest', subGuest);
    return response.data;
  },

  // Update subguest
  updateSubGuest: async (id: string, subGuest: SubGuestUpdate): Promise<SubGuest> => {
    const response: AxiosResponse<SubGuest> = await apiClient.put(`/SubGuest/${id}`, subGuest);
    return response.data;
  },

  // Delete subguest
  deleteSubGuest: async (id: string): Promise<void> => {
    await apiClient.delete(`/subguests/${id}`);
  },

  // Get subguests by guest id
  getSubGuestsByGuestId: async (guestId: string): Promise<SubGuest[]> => {
    const response: AxiosResponse<SubGuest[]> = await apiClient.get(`/SubGuest/guest/${guestId}`);
    return response.data;
  },

  // Get subguests by name
  getSubGuestsByName: async (name: string): Promise<SubGuest[]> => {
    const response: AxiosResponse<SubGuest[]> = await apiClient.get('/SubGuest/name', {
      params: { name }
    });
    return response.data;
  },

  // Get subguests by gender
  getSubGuestsByGender: async (gender: Gender): Promise<SubGuest[]> => {
    const response: AxiosResponse<SubGuest[]> = await apiClient.get('/SubGuest/gender', {
      params: { gender }
    });
    return response.data;
  },
  
  // Create multiple subguests at once
  createMultipleSubGuests: async (subGuests: SubGuestCreate[]): Promise<SubGuest[]> => {
    const response: AxiosResponse<SubGuest[]> = await apiClient.post('/SubGuest/batch', subGuests);
    return response.data;
  }
};

export default subGuestService;
