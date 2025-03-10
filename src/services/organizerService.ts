import apiClient from './apiClient.ts';
import axios, { AxiosResponse } from 'axios';
import { Group, Event, Organizer } from '../types/types.ts';

// Type for creating a new organizer (without id)
export type OrganizerCreate = Omit<Organizer, 'id'>;

// Type for updating an organizer
export type OrganizerUpdate = Partial<Organizer>;

// Type for login
export interface OrganizerLogin {
  mail: string;
  password: string;
}

// Type for login response
export interface LoginResponse {
  token: string;
  organizer: Organizer;
}

const organizerService = {
  // Get all organizers
  getAllOrganizers: async (): Promise<Organizer[]> => {
    const response: AxiosResponse<Organizer[]> = await apiClient.get('/Organizer');
    return response.data;
  },

  // Get organizer by id
  getOrganizer: async (id: string): Promise<Organizer> => {
    const response: AxiosResponse<Organizer> = await apiClient.get(`/Organizer/${id}`);
    return response.data;
  },

  // Create new organizer (register)
    createOrganizer: async (organizer: OrganizerCreate): Promise<Organizer> => {
      try {
        const response: AxiosResponse<Organizer> = await apiClient.post('/Organizer', organizer);
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          console.log("Response error data:", error.response); // ✅ נבדוק מה בדיוק חוזר מהשרת
  
          const errorMessage = error.response.data?.message || error.response.data || "שגיאה ביצירת משתמש. נסה שוב.";
  
          if (typeof errorMessage === "string" && errorMessage.includes("Email already exists")) {
            throw new Error("EMAIL_EXISTS");
          }
  
          throw new Error(errorMessage);
        }
        throw new Error("שגיאת רשת או שהשרת אינו מגיב.");
      }
    },
  // Update organizer
  updateOrganizer: async (id: string, organizer: OrganizerUpdate): Promise<Organizer> => {
    const response: AxiosResponse<Organizer> = await apiClient.put(`/Organizer/${id}`, organizer);
    return response.data;
  },

  // Delete organizer
  deleteOrganizer: async (id: string): Promise<void> => {
    await apiClient.delete(`/Organizer/${id}`);
  },

  // Login organizer
  loginOrganizer: async (credentials: OrganizerLogin): Promise<LoginResponse> => {
    const response: AxiosResponse<LoginResponse> = await apiClient.post('/auth/login', credentials);
    // Store the token in localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  // Logout organizer
  logoutOrganizer: (): void => {
    localStorage.removeItem('token');
  },

  // Get organizer's events
  getOrganizerEvents: async (organizerId: string): Promise<Event[]> => {
    const response: AxiosResponse<Event[]> = await apiClient.get(`/Organizer/${organizerId}/events`);
    return response.data;
  },

  // Get organizer's groups
  getOrganizerGroups: async (organizerId: string): Promise<Group[]> => {
    const response: AxiosResponse<Group[]> = await apiClient.get(`/Organizer/${organizerId}/groups`);
    return response.data;
  }
};

export default organizerService;
