const PREFIX = "finflow:";

export const storage = {
  get<T = string>(key: string): T | null {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      if (raw === null) return null;
      return JSON.parse(raw) as T;
    } catch {
      return localStorage.getItem(PREFIX + key) as unknown as T;
    }
  },

  set(key: string, value: unknown): void {
    localStorage.setItem(PREFIX + key, typeof value === "string" ? value : JSON.stringify(value));
  },

  remove(key: string): void {
    localStorage.removeItem(PREFIX + key);
  },

  clear(): void {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => localStorage.removeItem(k));
  },
};
