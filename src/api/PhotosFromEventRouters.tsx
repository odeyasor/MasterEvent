import axios from 'axios';

const API_URL = 'https://localhost:7112/api/PhotosFromEvent'; // כתובת ה-API שלך

export const getAllPhotosFromEvents = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data; 
  } catch (error) {
    console.error('Error fetching PhotosFromEvent:', error);
    return [];
  }
};

export const getPhotosFromEventById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data; 
  } catch (error) {
    console.error('Error fetching PhotosFromEvent:', error);
    return null;
  }
};

export const createPhotosFromEvent = async (PhotosFromEvent: any) => {
  try {
    const response = await axios.post(API_URL, PhotosFromEvent);
    return response.data; 
  } catch (error) {
    console.error('Error creating PhotosFromEvent:', error);
    return null;
  }
};

export const updatePhotosFromEvent = async (id: string, PhotosFromEvent: any) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, PhotosFromEvent);
    return response.data; 
  } catch (error) {
    console.error('Error updating PhotosFromEvent:', error);
    return null;
  }
};

export const deletePhotosFromEvent = async (id: string) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    return true; // מחזיר true אם המחיקה הצליחה
  } catch (error) {
    console.error('Error deleting PhotosFromEvent:', error);
    return false;
  }
};