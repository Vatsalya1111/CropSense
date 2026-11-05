const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

let language: 'en' | 'hi' = 'en';

export function setApiLanguage(nextLanguage: 'en' | 'hi'): void {
  language = nextLanguage;
}

function currentLanguage(): 'en' | 'hi' {
  return language;
}

export async function apiGet<T>(resource: string): Promise<T> {
  const query = new URLSearchParams({ language: currentLanguage() });
  const response = await fetch(`${API_BASE_URL}/${resource.replace(/^\//, '')}?${query}`);
  if (!response.ok) {
    throw new Error(`CropSense API request failed (${response.status}) for ${resource}`);
  }
  return response.json() as Promise<T>;
}

export async function apiPut<T>(resource: string, body: unknown): Promise<T> {
  const query = new URLSearchParams({ language: currentLanguage() });
  const response = await fetch(`${API_BASE_URL}/${resource.replace(/^\//, '')}?${query}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    const detail = payload?.detail;
    throw new Error(typeof detail === 'string' ? detail : `CropSense API request failed (${response.status}) for ${resource}`);
  }
  return response.json() as Promise<T>;
}
