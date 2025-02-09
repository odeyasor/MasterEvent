import axios from 'axios';

const API_URL = 'https://localhost:7112/api/SubGuest'; // כתובת ה-API שלך

export const getAllSubGuests = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data; 
  } catch (error) {
    console.error('Error fetching SubGuest:', error);
    return [];
  }
};

export const getSubGuestById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data; 
  } catch (error) {
    console.error('Error fetching SubGuest:', error);
    return null;
  }
};

export const createSubGuest = async (SubGuest: any) => {
  try {
    const response = await axios.post(API_URL, SubGuest);
    return response.data; 
  } catch (error) {
    console.error('Error creating SubGuest:', error);
    return null;
  }
};

export const updateSubGuest= async (id: string, SubGuest: any) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, SubGuest);
    return response.data; 
  } catch (error) {
    console.error('Error updating SubGuest:', error);
    return null;
  }
};

export const deleteSubGuest = async (id: string) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    return true; // מחזיר true אם המחיקה הצליחה
  } catch (error) {
    console.error('Error deleting SubGuest:', error);
    return false;
  }
};