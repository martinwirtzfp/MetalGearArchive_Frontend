import apiClient from './api';

export interface Game {
  id?: number;
  name: string;
  releaseYear: number;
  platforms: string;
  synopsis: string;
  imageUrl: string;
  videoUrl?: string;
}

export const gameService = {
  getAll: async (): Promise<Game[]> => {
    const response = await apiClient.get<Game[]>('/games');
    return response.data;
  },

  getById: async (id: number): Promise<Game> => {
    const response = await apiClient.get<Game>(`/games/${id}`);
    return response.data;
  },

  create: async (game: Game): Promise<Game> => {
    const response = await apiClient.post<Game>('/games', game);
    return response.data;
  },

  update: async (id: number, game: Game): Promise<Game> => {
    const response = await apiClient.put<Game>(`/games/${id}`, game);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/games/${id}`);
  },
};
