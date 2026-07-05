import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';

export default function RegisterPage(): React.ReactElement {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Mật khẩu không khớp.');
      return;
    }

    setLoading(true);

    try {
      await api.register({ email, username, password });
      setSuccessMsg('Đăng ký thành công! Đang chuyển đến trang đăng nhập...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      const apiErr = err as { message?: string };
      setErrorMsg(apiErr.message ?? 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg border border-gu-gold/30 bg-gu-dark p-8 shadow-lg">
        <h1 className="mb-2 text-center font-fantasy text-3xl text-gu-gold">CỔ ĐẠO</h1>
        <p className="mb-6 text-center text-sm text-gray-400">Tạo tài khoản mới</p>

        {errorMsg && (
          <div className="mb-4 rounded border border-red-500/50 bg-red-900/20 px-4 py-2 text-sm text-red-300">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 rounded border border-green-500/50 bg-green-900/20 px-4 py-2 text-sm text-green-300">
            {successMsg}
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
            <label htmlFor="username" className="mb-1 block text-sm text-gray-300">
              Tên người dùng
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
              maxLength={50}
              placeholder="Tên hiển thị"
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
              placeholder="Tối thiểu 6 ký tự"
              className="w-full rounded border border-gray-600 bg-gu-darker px-4 py-2 text-white placeholder-gray-500 focus:border-gu-gold focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-1 block text-sm text-gray-300">
              Xác nhận mật khẩu
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Nhập lại mật khẩu"
              className="w-full rounded border border-gray-600 bg-gu-darker px-4 py-2 text-white placeholder-gray-500 focus:border-gu-gold focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-gu-gold py-2 font-semibold text-gu-darker transition hover:bg-yellow-500 disabled:opacity-50"
          >
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-400">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-gu-gold hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
