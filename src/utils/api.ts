// Base URL for backend API when frontend (e.g. GitHub Pages) is hosted separately from backend (e.g. Render)
// Leave empty for same-origin deployment (when frontend & backend run together on Render or localhost).
const rawBaseUrl = (import.meta as any).env?.VITE_API_URL || '';
export const API_BASE_URL = typeof rawBaseUrl === 'string' ? rawBaseUrl.replace(/\/+$/, '') : '';

export function apiUrl(path: string): string {
  if (!path) return API_BASE_URL;
  if (/^https?:\/\//i.test(path)) return path;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

export function resolveUploadUrl(url?: string): string {
  if (!url) return '';
  if (!API_BASE_URL) return url;
  if (url.startsWith('/uploads/')) {
    return `${API_BASE_URL}${url}`;
  }
  return url;
}

// Recursively resolve any /uploads/... URLs inside SiteDatabase when using a separate backend origin
export function normalizeDatabaseUrls<T>(obj: T): T {
  if (!API_BASE_URL || !obj) return obj;
  if (typeof obj === 'string') {
    return (obj.startsWith('/uploads/') ? `${API_BASE_URL}${obj}` : obj) as unknown as T;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => normalizeDatabaseUrls(item)) as unknown as T;
  }
  if (typeof obj === 'object') {
    const out: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj as Record<string, any>)) {
      out[key] = normalizeDatabaseUrls(value);
    }
    return out as T;
  }
  return obj;
}
