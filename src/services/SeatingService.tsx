import axios from 'axios';

const API_URL = 'https://localhost:7112/api/Seating'; // כתובת ה-API שלך

export const getAllSeatings = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data; 
  } catch (error) {
    console.error('Error fetching Seating:', error);
    return [];
  }
};

export const getSeatingById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data; 
  } catch (error) {
    console.error('Error fetching Seating:', error);
    return null;
  }
};

export const createSeating = async (Seating: any) => {
  try {
    const response = await axios.post(API_URL, Seating);
    return response.data; 
  } catch (error) {
    console.error('Error creating Seating:', error);
    return null;
  }
};

export const updateSeating = async (id: string, Seating: any) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, Seating);
    return response.data; 
  } catch (error) {
    console.error('Error updating Seating:', error);
    return null;
  }
};

export const deleteSeating = async (id: string) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    return true; // מחזיר true אם המחיקה הצליחה
  } catch (error) {
    console.error('Error deleting Seating:', error);
    return false;
  }
};