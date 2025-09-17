'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn('credentials', {
        redirect: true,
        email,
        password,
        callbackUrl: '/dashboard',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-extrabold text-slate-900">Sign in</h2>
            <p className="text-sm text-slate-600 mt-1">Welcome back. Please enter your details.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1 text-slate-700">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition appearance-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-slate-700">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 px-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition appearance-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full h-11 rounded-lg text-white font-medium shadow-sm transition-colors active:scale-[.99] bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 ${loading ? 'opacity-80 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>

            <p className="text-center text-sm text-slate-600">
              Don’t have an account?{' '}
              <a href="/auth/signup" className="font-medium text-indigo-600 hover:text-indigo-500">Sign up</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
