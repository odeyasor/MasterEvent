import axios from 'axios';

const API_URL = 'https://localhost:7112/api/GuestInEvent'; // כתובת ה-API שלך

export const getAllGuestInEvents = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data; 
  } catch (error) {
    console.error('Error fetching GuestInEvent:', error);
    return [];
  }
};

export const getGuestInEventById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data; 
  } catch (error) {
    console.error('Error fetching GuestInEvent:', error);
    return null;
  }
};

export const createGuestInEvent = async (GuestInEvent: any) => {
  try {
    const response = await axios.post(API_URL, GuestInEvent);
    return response.data; 
  } catch (error) {
    console.error('Error creating GuestInEvent:', error);
    return null;
  }
};

export const updateGuestInEvent = async (id: string, GuestInEvent: any) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, GuestInEvent);
    return response.data; 
  } catch (error) {
    console.error('Error updating GuestInEvent:', error);
    return null;
  }
};

export const deleteGuestInEvent = async (id: string) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    return true; // מחזיר true אם המחיקה הצליחה
  } catch (error) {
    console.error('Error deleting GuestInEvent:', error);
    return false;
  }
};