export function normalizeRTDBUrl(input: string): string {
  if (!input) return '';
  let urlStr = input.trim();
  if (!urlStr.startsWith('http://') && !urlStr.startsWith('https://')) {
    urlStr = 'https://' + urlStr;
  }
  
  try {
    const url = new URL(urlStr);
    
    if (!url.hostname.endsWith('firebaseio.com') && !url.hostname.endsWith('firebasedatabase.app')) {
      throw new Error('Invalid Firebase RTDB URL: must be a firebaseio.com or firebasedatabase.app domain.');
    }
    
    // Normalize to base URL without trailing slash
    return `https://${url.hostname}`;
  } catch (e: any) {
    throw new Error(`Invalid URL format: ${e.message}`);
  }
}

export function generateSafeTestPath(): string {
  return `/rtdb_inspector_test/${Date.now()}_${Math.floor(Math.random() * 1000000)}.json`;
}

export async function fetchWithTimeout(resource: URL | string, options: RequestInit = {}) {
  const timeoutMs = (options as any).timeout || 5000;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal
    });
    return response;
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw err;
  } finally {
    clearTimeout(id);
  }
}
