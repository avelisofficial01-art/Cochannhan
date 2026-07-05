import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';
import { useAuthStore } from '../store/auth.js';

export default function LoginPage(): React.ReactElement {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setTokens = useAuthStore((s) => s.setTokens);

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const response = await api.login({ email, password });
      if (response.data) {
        setTokens(response.data.token, response.data.refreshToken);
        navigate('/');
      }
    } catch (err) {
      const apiErr = err as { message?: string };
      setErrorMsg(apiErr.message ?? 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg border border-gu-gold/30 bg-gu-dark p-8 shadow-lg">
        <h1 className="mb-2 text-center font-fantasy text-3xl text-gu-gold">CỔ ĐẠO</h1>
        <p className="mb-6 text-center text-sm text-gray-400">Đăng nhập để tiếp tục</p>

        {errorMsg && (
          <div className="mb-4 rounded border border-red-500/50 bg-red-900/20 px-4 py-2 text-sm text-red-300">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm text-gray-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              className="w-full rounded border border-gray-600 bg-gu-darker px-4 py-2 text-white placeholder-gray-500 focus:border-gu-gold focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm text-gray-300">
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="••••••"
              className="w-full rounded border border-gray-600 bg-gu-darker px-4 py-2 text-white placeholder-gray-500 focus:border-gu-gold focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-gu-gold py-2 font-semibold text-gu-darker transition hover:bg-yellow-500 disabled:opacity-50"
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-400">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-gu-gold hover:underline">
            Đăng ký
          </Link>
        </p>
      </div>
    </div>
  );
}
