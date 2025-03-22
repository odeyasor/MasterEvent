import apiClient from '../api/apiClient.ts';
import { AxiosResponse } from 'axios';
import { Seating } from '../types/types';

// Type for creating a new seating (without id)
export type SeatingCreate = Omit<Seating, 'id'>;

// Type for updating a seating
export type SeatingUpdate = Partial<Seating>;

const seatingService = {
  // Get all seatings
  getAllSeatings: async (): Promise<Seating[]> => {
    const response: AxiosResponse<Seating[]> = await apiClient.get('/Seating');
    return response.data;
  },

  // Get seating by id
  getSeating: async (id: string): Promise<Seating> => {
    const response: AxiosResponse<Seating> = await apiClient.get(`/Seating/${id}`);
    return response.data;
  },

  // Create new seating
  createSeating: async (seating: SeatingCreate): Promise<Seating> => {
    const response: AxiosResponse<Seating> = await apiClient.post('/Seating', seating);
    return response.data;
  },

  // Update seating
  updateSeating: async (id: string, seating: SeatingUpdate): Promise<Seating> => {
    const response: AxiosResponse<Seating> = await apiClient.put(`/Seating/${id}`, seating);
    return response.data;
  },

  // Delete seating
  deleteSeating: async (id: string): Promise<void> => {
    await apiClient.delete(`/Seating/${id}`);
  },

  // Get seatings by event id
  getSeatsByEventId: async (eventId: string): Promise<Seating[]> => {
    const response: AxiosResponse<Seating[]> = await apiClient.get(`/Seating/event/${eventId}`);
    return response.data;
  },

  // Get all tables for an event
  getTablesByEventId: async (eventId: string): Promise<number[]> => {
    const response: AxiosResponse<number[]> = await apiClient.get(`/Seating/event/${eventId}/tables`);
    return response.data;
  },

  // Assign multiple seats at once
  assignMultipleSeats: async (seatings: SeatingCreate[]): Promise<Seating[]> => {
    const response: AxiosResponse<Seating[]> = await apiClient.post('/Seating/batch', seatings);
    return response.data;
  }
};

export default seatingService;
