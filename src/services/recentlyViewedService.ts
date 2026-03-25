import { deviceStore } from './deviceStore';

export type EntityKind = 'personajes' | 'juegos' | 'eventos' | 'lugares' | 'organizaciones';

export interface RecentlyViewedItem {
  id: number;
  name: string;
  path: string;
  entity: EntityKind;
  timestamp: number;
}

const STORAGE_KEY = 'recently-viewed';
const MAX_ITEMS = 25;

export const recentlyViewedService = {
  async add(item: Omit<RecentlyViewedItem, 'timestamp'>): Promise<void> {
    const current = await deviceStore.getJSON<RecentlyViewedItem[]>(STORAGE_KEY, []);
    const nextItem: RecentlyViewedItem = { ...item, timestamp: Date.now() };
    const deduped = current.filter((entry) => !(entry.entity === item.entity && entry.id === item.id));
    const next = [nextItem, ...deduped].slice(0, MAX_ITEMS);
    await deviceStore.setJSON(STORAGE_KEY, next);
  },

  async list(): Promise<RecentlyViewedItem[]> {
    return deviceStore.getJSON<RecentlyViewedItem[]>(STORAGE_KEY, []);
  },
};
