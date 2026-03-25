import { Preferences } from '@capacitor/preferences';

const KEY_PREFIX = 'mga:';

export const deviceStore = {
  async setJSON<T>(key: string, value: T): Promise<void> {
    await Preferences.set({ key: `${KEY_PREFIX}${key}`, value: JSON.stringify(value) });
  },

  async getJSON<T>(key: string, fallback: T): Promise<T> {
    const result = await Preferences.get({ key: `${KEY_PREFIX}${key}` });
    if (!result.value) {
      return fallback;
    }

    try {
      return JSON.parse(result.value) as T;
    } catch {
      return fallback;
    }
  },
};
