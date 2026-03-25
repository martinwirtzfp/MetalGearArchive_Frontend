import apiClient from './api';

export interface CharacterGameRef {
  id: number;
  name: string;
}

export interface Character {
  id?: number;
  name: string;
  role: string;
  nationality: string;
  age: string;
  gender: string;
  description: string;
  imageUrl: string;
  appearances?: CharacterGameRef[];
}

export const characterService = {
  getAll: async (): Promise<Character[]> => {
    const response = await apiClient.get<Character[]>('/characters');
    return response.data;
  },

  getById: async (id: number): Promise<Character> => {
    const response = await apiClient.get<Character>(`/characters/${id}`);
    return response.data;
  },

  create: async (character: Character): Promise<Character> => {
    const response = await apiClient.post<Character>('/characters', character);
    return response.data;
  },

  update: async (id: number, character: Character): Promise<Character> => {
    const response = await apiClient.put<Character>(`/characters/${id}`, character);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/characters/${id}`);
  },
};
