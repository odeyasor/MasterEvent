import apiClient from './apiClient.ts';
import { AxiosResponse } from 'axios';
import { Guest, Gender } from '../types/types.ts';
// Type for creating a new guest (without id)
export type GuestCreate = Omit<Guest, 'id'>;

// Type for updating a guest
export type GuestUpdate = Partial<Guest>;

const guestService = {
  // Get all guests
  getAllGuests: async (): Promise<Guest[]> => {
    const response: AxiosResponse<Guest[]> = await apiClient.get('/Guest');
    return response.data;
  },

  // Get guest by id
  getGuest: async (id: string): Promise<Guest> => {
    const response: AxiosResponse<Guest> = await apiClient.get(`/Guest/${id}`);
    return response.data;
  },

  // Create new guest
  createGuest: async (guest: GuestCreate): Promise<Guest> => {
    const response: AxiosResponse<Guest> = await apiClient.post('/Guest', guest);
    return response.data;
  },

  // Update guest
  updateGuest: async (id: string, guest: GuestUpdate): Promise<Guest> => {
    const response: AxiosResponse<Guest> = await apiClient.put(`/Guest/${id}`, guest);
    return response.data;
  },

  // Delete guest
  deleteGuest: async (id: string): Promise<void> => {
    await apiClient.delete(`/guests/${id}`);
  },

  // Get guests by name
  getGuestsByName: async (name: string): Promise<Guest[]> => {
    const response: AxiosResponse<Guest[]> = await apiClient.get('/Guest/name', {
      params: { name }
    });
    return response.data;
  },

  // Get guests by email
  getGuestsByMail: async (mail: string): Promise<Guest[]> => {
    const response: AxiosResponse<Guest[]> = await apiClient.get('/Guest/mail', {
      params: { mail }
    });
    return response.data;
  },

  // Get guests by gender
  getGuestsByGender: async (gender: Gender): Promise<Guest[]> => {
    const response: AxiosResponse<Guest[]> = await apiClient.get('/Guest/gender', {
      params: { gender }
    });
    return response.data;
  }
};

export default guestService;
