import apiClient from './apiClient.ts'
  import { Group } from '../types/types.ts';

export const groupService = {
  // Get all groups
  getAllGroups: () => {
    return apiClient.get<Group[]>(API_ENDPOINTS.GROUPS);
  },

  // Get a specific group by ID
  getGroup: (id: string) => {
    return apiClient.get<Group>(`${API_ENDPOINTS.GROUPS}/${id}`);
  },

  // Create a new group
  createGroup: (group: Omit<Group, 'id'>) => {
    return apiClient.post<Group>(API_ENDPOINTS.GROUPS, group);
  },

  // Update a group
  updateGroup: (id: string, group: Partial<Group>) => {
    return apiClient.put<Group>(`${API_ENDPOINTS.GROUPS}/${id}`, group);
  },

  // Delete a group
  deleteGroup: (id: string) => {
    return apiClient.delete(`${API_ENDPOINTS.GROUPS}/${id}`);
  },

  // Get groups by organizer ID
  getGroupsByOrganizer: (organizerId: string) => {
    return apiClient.get<Group[]>(API_ENDPOINTS.GROUPS_BY_ORGANIZER(organizerId));
  },

  // Get groups by name
  getGroupsByName: (name: string) => {
    return apiClient.get<Group[]>(API_ENDPOINTS.GROUPS_BY_NAME(name));
  },

  // Get groups by guest ID
  getGroupsByGuest: (guestId: string) => {
    return apiClient.get<Group[]>(API_ENDPOINTS.GROUPS_BY_GUEST(guestId));
  },

  // Get top N groups
  getTopGroups: (count: number) => {
    return apiClient.get<Group[]>(API_ENDPOINTS.TOP_GROUPS(count));
  }
};
