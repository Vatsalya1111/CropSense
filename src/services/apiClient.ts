const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

function currentLanguage(): 'en' | 'hi' {
  try {
    const settings = JSON.parse(localStorage.getItem('agrisense_settings') || '{}') as { language?: string };
    return settings.language === 'hi' ? 'hi' : 'en';
  } catch {
    return 'en';
  }
}

export async function apiGet<T>(resource: string): Promise<T> {
  const query = new URLSearchParams({ language: currentLanguage() });
  const response = await fetch(`${API_BASE_URL}/${resource.replace(/^\//, '')}?${query}`);
  if (!response.ok) {
    throw new Error(`CropSense API request failed (${response.status}) for ${resource}`);
  }
  return response.json() as Promise<T>;
}
