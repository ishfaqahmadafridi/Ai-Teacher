import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { loginUser, logout } from '../redux/authSlice';

export const Counter: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, token, loading, error } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    dispatch(loginUser({ email, token: 'dummy-jwt-token-12345' }));
  };

  return (
    <div className="max-w-[450px] mx-auto my-8 p-8 rounded-2xl bg-white/5 backdrop-blur-md shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border border-white/10 text-white font-sans">
      <h2 className="mt-0 border-b border-white/10 pb-2 text-xl font-bold text-left">
        Redux Toolkit & Interceptor Demo
      </h2>

      {user ? (
        <div className="mt-4">
          <p className="text-green-500 font-bold text-left mb-4">✓ Logged In Successfully</p>
          <div className="bg-black/20 p-4 rounded-lg mb-4 text-left">
            <p className="m-0 mb-2"><strong>Name:</strong> {user.name}</p>
            <p className="m-0 mb-2"><strong>Email:</strong> {user.email}</p>
            <p className="m-0 break-all text-xs text-gray-400">
              <strong>Token:</strong> {token}
            </p>
          </div>
          <button
            onClick={() => dispatch(logout())}
            className="w-full p-3 rounded-lg border-none bg-red-600 hover:bg-red-700 text-white font-bold cursor-pointer transition-colors"
          >
            Logout
          </button>
        </div>
      ) : (
        <form onSubmit={handleLogin} className="flex flex-col gap-4 mt-4">
          <div>
            <label className="block mb-2 text-sm text-gray-300 text-left">
              Email Address
            </label>
            <input
              type="email"
              placeholder="teacher@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-white/20 bg-black/20 text-white outline-none box-border"
            />
          </div>

          {error && <p className="text-red-500 m-0 text-sm text-left">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 rounded-lg border-none text-white font-bold transition-colors cursor-pointer bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed"
          >
            {loading ? 'Simulating API call...' : 'Login (Mock API)'}
          </button>
        </form>
      )}
    </div>
  );
};
