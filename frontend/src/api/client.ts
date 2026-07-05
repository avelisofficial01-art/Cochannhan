import type {
  ApiResponse,
  RegisterRequest,
  LoginResponse,
  PlayerProfile,
  PlayerStatsResponse,
} from '@co-dao/shared';

const BASE_URL = '/api';

// ── Refresh token management ──────────────────────────────────────

let refreshPromise: Promise<boolean> | null = null;

async function tryRefreshToken(): Promise<boolean> {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      return false;
    }

    const body = (await res.json()) as ApiResponse<{
      token: string;
      refreshToken: string;
    }>;

    if (body.success && body.data) {
      localStorage.setItem('token', body.data.token);
      localStorage.setItem('refreshToken', body.data.refreshToken);
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

async function ensureFreshToken(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = tryRefreshToken().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}

// ── Core request ──────────────────────────────────────────────────

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) ?? {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    const refreshed = await ensureFreshToken();
    if (refreshed) {
      // Retry once with the new token
      const newToken = localStorage.getItem('token');
      const retryHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...((options.headers as Record<string, string>) ?? {}),
      };
      if (newToken) {
        retryHeaders['Authorization'] = `Bearer ${newToken}`;
      }

      const retryResponse = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: retryHeaders,
      });

      if (retryResponse.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        throw new Error('Unauthorized');
      }

      const body = (await retryResponse.json()) as ApiResponse<T>;
      if (!retryResponse.ok) throw body;
      return body;
    }

    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  const body = (await response.json()) as ApiResponse<T>;

  if (!response.ok) {
    throw body;
  }

  return body;
}

// ── fetchWithAuth — for components that call API directly ─────────

/**
 * A drop-in replacement for `fetch` that auto-attaches the auth
 * Bearer header and transparently refreshes the token on 401.
 */
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) ?? {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    const refreshed = await ensureFreshToken();
    if (refreshed) {
      const newToken = localStorage.getItem('token');
      const retryHeaders: Record<string, string> = {
        ...((options.headers as Record<string, string>) ?? {}),
      };
      if (newToken) {
        retryHeaders['Authorization'] = `Bearer ${newToken}`;
      }

      const retryResponse = await fetch(url, { ...options, headers: retryHeaders });
      if (retryResponse.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        throw new Error('Unauthorized');
      }
      return retryResponse;
    }

    // Refresh failed — redirect to login
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  return response;
}

// ── Public API ────────────────────────────────────────────────────

export const api = {
  // Auth
  register: (data: RegisterRequest): Promise<ApiResponse<null>> =>
    request<null>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (
    data: { email: string; password: string },
  ): Promise<ApiResponse<LoginResponse>> =>
    request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  refresh: (
    refreshToken: string,
  ): Promise<ApiResponse<{ token: string; refreshToken: string }>> =>
    request<{ token: string; refreshToken: string }>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }),

  logout: (): Promise<ApiResponse<null>> =>
    request<null>('/auth/logout', { method: 'POST' }),

  // Player
  getProfile: (): Promise<ApiResponse<PlayerProfile>> =>
    request<PlayerProfile>('/player/profile'),

  getStats: (): Promise<ApiResponse<PlayerStatsResponse>> =>
    request<PlayerStatsResponse>('/player/stats'),

  createPlayer: (
    name: string,
  ): Promise<ApiResponse<{ player: PlayerProfile }>> =>
    request<{ player: PlayerProfile }>('/player/create', {
      method: 'POST',
      body: JSON.stringify({ name }),
    }),
};
