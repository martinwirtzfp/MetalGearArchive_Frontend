import apiClient from './api';

export interface Organization {
  id?: number;
  name: string;
  type: string;
  description: string;
  imageUrl: string;
  headquarters?: string;
}

export const organizationService = {
  getAll: async (): Promise<Organization[]> => {
    const response = await apiClient.get<Organization[]>('/organizations');
    return response.data;
  },

  getById: async (id: number): Promise<Organization> => {
    const response = await apiClient.get<Organization>(`/organizations/${id}`);
    return response.data;
  },

  create: async (organization: Organization): Promise<Organization> => {
    const response = await apiClient.post<Organization>('/organizations', organization);
    return response.data;
  },

  update: async (id: number, organization: Organization): Promise<Organization> => {
    const response = await apiClient.put<Organization>(`/organizations/${id}`, organization);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/organizations/${id}`);
  },
};
