import apiClient from './api';

export interface Location {
  id?: number;
  name: string;
  region: string;
  description: string;
  imageUrl: string;
  coordinates?: string;
}

export const locationService = {
  getAll: async (): Promise<Location[]> => {
    const response = await apiClient.get<Location[]>('/locations');
    return response.data;
  },

  getById: async (id: number): Promise<Location> => {
    const response = await apiClient.get<Location>(`/locations/${id}`);
    return response.data;
  },

  create: async (location: Location): Promise<Location> => {
    const response = await apiClient.post<Location>('/locations', location);
    return response.data;
  },

  update: async (id: number, location: Location): Promise<Location> => {
    const response = await apiClient.put<Location>(`/locations/${id}`, location);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/locations/${id}`);
  },
};
