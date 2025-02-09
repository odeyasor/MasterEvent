// services/organizerService.ts
import axios from 'axios';

const API_URL = 'https://localhost:7112/api/Organizer'; // כתובת ה-API שלך

export const getAllOrganizers = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data; // מחזיר את רשימת המארגנים
  } catch (error) {
    console.error('Error fetching organizers:', error);
    return [];
  }
};

export const getOrganizerById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data; // מחזיר את המארגן לפי מזהה
  } catch (error) {
    console.error('Error fetching organizer:', error);
    return null;
  }
};

export const createOrganizer = async (organizer: any) => {
  try {
    const response = await axios.post(API_URL, organizer);
    return response.data; // מחזיר את המארגן שנוצר
  } catch (error) {
    console.error('Error creating organizer:', error);
    return null;
  }
};

export const updateOrganizer = async (id: string, organizer: any) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, organizer);
    return response.data; // מחזיר את המארגן אחרי עדכון
  } catch (error) {
    console.error('Error updating organizer:', error);
    return null;
  }
};

export const deleteOrganizer = async (id: string) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    return true; // מחזיר true אם המחיקה הצליחה
  } catch (error) {
    console.error('Error deleting organizer:', error);
    return false;
  }
};
