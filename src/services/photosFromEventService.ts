import apiClient from '../api/apiClient.ts';
import { AxiosResponse } from 'axios';
import { PhotosFromEvent, Guest, Event } from '../types/types';

// Type for creating a new photo (without id)
export type PhotosFromEventCreate = Omit<PhotosFromEvent, 'id'>;

// Type for updating a photo
export type PhotosFromEventUpdate = Partial<PhotosFromEvent>;

const photosFromEventService = {
  // Get all photos
  getAllPhotos: async (): Promise<PhotosFromEvent[]> => {
    const response: AxiosResponse<PhotosFromEvent[]> = await apiClient.get('/PhotosFromEvent');
    return response.data;
  },

  // Get photo by id
  getPhoto: async (id: string): Promise<PhotosFromEvent> => {
    const response: AxiosResponse<PhotosFromEvent> = await apiClient.get(`/PhotosFromEvent/${id}`);
    return response.data;
  },

  // Create new photo
  createPhoto: async (photo: PhotosFromEventCreate): Promise<PhotosFromEvent> => {
    const response: AxiosResponse<PhotosFromEvent> = await apiClient.post('/PhotosFromEvent', photo);
    return response.data;
  },

  // Update photo
  updatePhoto: async (id: string, photo: PhotosFromEventUpdate): Promise<PhotosFromEvent> => {
    const response: AxiosResponse<PhotosFromEvent> = await apiClient.put(`/PhotosFromEvent/${id}`, photo);
    return response.data;
  },

  // Delete photo
  deletePhoto: async (id: string): Promise<void> => {
    await apiClient.delete(`/PhotosFromEvent/${id}`);
  },

  // Get photos by guest id
  getPhotosByGuestId: async (guestId: string): Promise<PhotosFromEvent[]> => {
    const response: AxiosResponse<PhotosFromEvent[]> = await apiClient.get(`/PhotosFromEvent/guest/${guestId}`);
    return response.data;
  },

  // Get photos by event id
  getPhotosByEventId: async (eventId: string): Promise<PhotosFromEvent[]> => {
    const response: AxiosResponse<PhotosFromEvent[]> = await apiClient.get(`/PhotosFromEvent/event/${eventId}`);
    return response.data;
  },

  // Get photos by guest and event
  getPhotosByGuestAndEvent: async (guestId: string, eventId: string): Promise<PhotosFromEvent[]> => {
    const response: AxiosResponse<PhotosFromEvent[]> = await apiClient.get('/PhotosFromEvent/guestEvent', {
      params: { guestId, eventId }
    });
    return response.data;
  },

  // Get photos with guest and event data
  getPhotosWithGuestAndEvent: async (): Promise<PhotosFromEvent[]> => {
    const response: AxiosResponse<PhotosFromEvent[]> = await apiClient.get('/PhotosFromEvent/withDetails');
    return response.data;
  },

  // Get photos by blessing
  getPhotosByBlessing: async (blessingText: string): Promise<PhotosFromEvent[]> => {
    const response: AxiosResponse<PhotosFromEvent[]> = await apiClient.get('/PhotosFromEvent/blessing', {
      params: { blessingText }
    });
    return response.data;
  },

  // Get photos by event sorted by guest name
  getPhotosByEventSortedByGuestName: async (eventId: string): Promise<PhotosFromEvent[]> => {
    const response: AxiosResponse<PhotosFromEvent[]> = await apiClient.get(`/PhotosFromEvent/event/${eventId}/sortedByGuest`);
    return response.data;
  },

  // Get photos sorted by newest
  getPhotosSortedByNewest: async (): Promise<PhotosFromEvent[]> => {
    const response: AxiosResponse<PhotosFromEvent[]> = await apiClient.get('/PhotosFromEvent/newest');
    return response.data;
  },

  // Get photos with pagination
  getPhotosPaged: async (skip: number, take: number): Promise<PhotosFromEvent[]> => {
    const response: AxiosResponse<PhotosFromEvent[]> = await apiClient.get('/PhotosFromEvent/paged', {
      params: { skip, take }
    });
    return response.data;
  },

  // Upload photo (file upload with additional data)
  uploadPhoto: async (file: File, data: Omit<PhotosFromEventCreate, 'imageUrl'>): Promise<PhotosFromEvent> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('guestId', data.guestId);
    formData.append('eventId', data.eventId);
    formData.append('blessing', data.blessing);

    const response: AxiosResponse<PhotosFromEvent> = await apiClient.post('/PhotosFromEvent/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
};

export default photosFromEventService;
