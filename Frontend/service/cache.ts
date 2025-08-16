const cache: Map<string, unknown> = new Map();

export const getFromCache = <T>(key: string): T | null => {
  return cache.has(key) ? (cache.get(key) as T) : null;
};

export const setToCache = (key: string, data: unknown): void => {
  cache.set(key, data);
};

export const clearCache = (key?: string) => {
  if (key) cache.delete(key);
  else cache.clear();
};
