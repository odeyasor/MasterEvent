import axios from 'axios';

const API_URL = 'https://localhost:7112/api/Event';

export const eventApi = {
  getAll: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  },

  getById: async (id: string) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching event:', error);
      return null;
    }
  },

  create: async (event: FormData) => {
    try {
      const response = await axios.post(API_URL, event);
      return response.data;
    } catch (error) {
      console.error('Error creating event:', error);
      return null;
    }
  },

  update: async (id: string, event: any) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, event);
      return response.data;
    } catch (error) {
      console.error('Error updating event:', error);
      return null;
    }
  },

  delete: async (id: string) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      return false;
    }
  },
};
