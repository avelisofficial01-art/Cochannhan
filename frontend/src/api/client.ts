import type {
  ApiResponse,
  RegisterRequest,
  LoginResponse,
  PlayerProfile,
  PlayerStatsResponse,
} from '@co-dao/shared';

const BASE_URL = '/api';

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

  const body = (await response.json()) as ApiResponse<T>;

  if (!response.ok) {
    throw body;
  }

  return body;
}

export const api = {
  // Auth
  register: (data: RegisterRequest): Promise<ApiResponse<null>> =>
    request<null>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }): Promise<ApiResponse<LoginResponse>> =>
    request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  refresh: (refreshToken: string): Promise<ApiResponse<{ token: string; refreshToken: string }>> =>
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

  createPlayer: (name: string): Promise<ApiResponse<{ player: PlayerProfile }>> =>
    request<{ player: PlayerProfile }>('/player/create', {
      method: 'POST',
      body: JSON.stringify({ name }),
    }),
};
