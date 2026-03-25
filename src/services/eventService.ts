import apiClient from './api';

export interface EventLocationRef {
  id: number;
  name: string;
}

export interface Event {
  id?: number;
  name: string;
  codeName?: string;
  eventYear: number;
  description: string;
  imageUrl: string;
  location?: EventLocationRef;
  outcome?: string;
}

export const eventService = {
  getAll: async (): Promise<Event[]> => {
    const response = await apiClient.get<Event[]>('/events');
    return response.data;
  },

  getById: async (id: number): Promise<Event> => {
    const response = await apiClient.get<Event>(`/events/${id}`);
    return response.data;
  },

  create: async (event: Event): Promise<Event> => {
    const response = await apiClient.post<Event>('/events', event);
    return response.data;
  },

  update: async (id: number, event: Event): Promise<Event> => {
    const response = await apiClient.put<Event>(`/events/${id}`, event);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/events/${id}`);
  },
};
