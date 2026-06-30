const API_BASE = import.meta.env.VITE_API_BASE || '';

export async function apiFetch(path: string, options: RequestInit = {}) {
  const url = path.startsWith('/api') ? path : `/api${path}`;

  const defaults: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const baseHeaders = new Headers(defaults);
  const extraHeaders = new Headers(options.headers as Record<string, string>);
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('mannobot_token') : '';

  if (token) {
    baseHeaders.set('Authorization', `Bearer ${token}`);
  }

  const mergedHeaders = new Headers([...baseHeaders, ...extraHeaders]);

  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: mergedHeaders,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const err = new Error(text || `HTTP ${res.status}`) as Error & { status?: number };
    err.status = res.status;
    throw err;
  }

  if (res.status === 204) return null;
  return res.json();
}

export async function login(email: string, password: string): Promise<{ access_token: string; token_type: string }> {
  const data = await apiFetch('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (data?.access_token) {
    localStorage.setItem('mannobot_token', data.access_token);
  }
  return data;
}

export function logout(): void {
  localStorage.removeItem('mannobot_token');
}

export function getToken(): string | null {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem('mannobot_token');
}

export function isAuthenticated(): boolean {
  return getToken() !== null;
}
