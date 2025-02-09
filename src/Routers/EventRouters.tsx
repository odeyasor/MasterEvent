import axios from 'axios';

const API_URL = 'https://localhost:7112/api/Event'; // כתובת ה-API שלך

export const getAllOrganizers = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data; 
  } catch (error) {
    console.error('Error fetching event:', error);
    return [];
  }
};



export const getEventById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data; 
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
};

export const createEvent = async (event: any) => {
  try {
    const response = await axios.post(API_URL, event);
    return response.data; 
  } catch (error) {
    console.error('Error creating Event:', error);
    return null;
  }
};

export const updateEvent = async (id: string, event: any) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, event);
    return response.data; 
  } catch (error) {
    console.error('Error updating Event:', error);
    return null;
  }
};

export const deleteEvent = async (id: string) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    return true; // מחזיר true אם המחיקה הצליחה
  } catch (error) {
    console.error('Error deleting Event:', error);
    return false;
  }
};