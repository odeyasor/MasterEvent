import apiClient from './apiClient.ts';
import { AxiosResponse } from 'axios';
import { Group } from '../types/types';

// Type for creating a new group (without id)
export type GroupCreate = Omit<Group, 'id'>;

// Type for updating a group
export type GroupUpdate = Partial<Group>;

const groupService = {
  // Get all groups
  getAllGroups: async (): Promise<Group[]> => {
    const response: AxiosResponse<Group[]> = await apiClient.get('/Group');
    return response.data;
  },

  // Get group by id
  getGroup: async (id: string): Promise<Group> => {
    const response: AxiosResponse<Group> = await apiClient.get(`/Group/${id}`);
    return response.data;
  },

  // Create new group
  createGroup: async (group: GroupCreate): Promise<Group> => {
    const response: AxiosResponse<Group> = await apiClient.post('/Group', group);
    return response.data;
  },

  // Update group
  updateGroup: async (id: string, group: GroupUpdate): Promise<Group> => {
    const response: AxiosResponse<Group> = await apiClient.put(`/Group/${id}`, group);
    return response.data;
  },

  // Delete group
  deleteGroup: async (id: string): Promise<void> => {
    await apiClient.delete(`/Group/${id}`);
  },

  // Get groups by organizer id
  getGroupsByOrganizerId: async (organizerId: string): Promise<Group[]> => {
    const response: AxiosResponse<Group[]> = await apiClient.get(`/Group/organizer/${organizerId}`);
    return response.data;
  },

  // Get groups by name
  getGroupsByName: async (name: string): Promise<Group[]> => {
    const response: AxiosResponse<Group[]> = await apiClient.get('/Group/name', {
      params: { name }
    });
    return response.data;
  },

  // Get groups by guest id
  getGroupsByGuestId: async (guestId: string): Promise<Group[]> => {
    const response: AxiosResponse<Group[]> = await apiClient.get(`/Group/guest/${guestId}`);
    return response.data;
  },

  // Get top groups
  getTopGroups: async (count: number): Promise<Group[]> => {
    const response: AxiosResponse<Group[]> = await apiClient.get('/Group/top', {
      params: { count }
    });
    return response.data;
  }
};

export default groupService;
