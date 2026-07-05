import { create } from 'zustand';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  player: { id: string; name: string } | null;
  isAuthenticated: boolean;
  setTokens: (token: string, refreshToken: string, player?: { id: string; name: string }) => void;
  clearTokens: () => void;
  setPlayer: (player: { id: string; name: string } | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  refreshToken: localStorage.getItem('refreshToken'),
  player: null,
  isAuthenticated: !!localStorage.getItem('token'),

  setTokens: (token: string, refreshToken: string, player?: { id: string; name: string }): void => {
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    set({ token, refreshToken, player: player ?? null, isAuthenticated: true });
  },

  clearTokens: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    set({ token: null, refreshToken: null, player: null, isAuthenticated: false });
  },

  setPlayer: (player: { id: string; name: string } | null): void => {
    set({ player });
  },
}));
