import axios from 'axios';

const API_URL = 'https://localhost:7112/api/Group'; // כתובת ה-API שלך

export const getAllGroups = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data; 
  } catch (error) {
    console.error('Error fetching Group:', error);
    return [];
  }
};

export const getGroupById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data; 
  } catch (error) {
    console.error('Error fetching Group:', error);
    return null;
  }
};

export const createGroup = async (Group: any) => {
  try {
    const response = await axios.post(API_URL, Group);
    return response.data; 
  } catch (error) {
    console.error('Error creating Group:', error);
    return null;
  }
};

export const updateGroup = async (id: string, Group: any) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, Group);
    return response.data; 
  } catch (error) {
    console.error('Error updating Group:', error);
    return null;
  }
};

export const deleteGroup = async (id: string) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    return true; // מחזיר true אם המחיקה הצליחה
  } catch (error) {
    console.error('Error deleting Group:', error);
    return false;
  }
};