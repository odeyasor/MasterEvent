import axios from 'axios';

const API_URL = 'https://localhost:7112/api/Guest'; // כתובת ה-API שלך

export const getAllGuests = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data; 
  } catch (error) {
    console.error('Error fetching Guest:', error);
    return [];
  }
};

export const getGuestById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data; 
  } catch (error) {
    console.error('Error fetching Guest:', error);
    return null;
  }
};

export const createGuest = async (Guest: any) => {
  try {
    const response = await axios.post(API_URL, Guest);
    return response.data; 
  } catch (error) {
    console.error('Error creating Guest:', error);
    return null;
  }
};

export const updateGuest = async (id: string, Guest: any) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, Guest);
    return response.data; 
  } catch (error) {
    console.error('Error updating Guest:', error);
    return null;
  }
};

export const deleteGuest = async (id: string) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    return true; // מחזיר true אם המחיקה הצליחה
  } catch (error) {
    console.error('Error deleting Guest:', error);
    return false;
  }
};