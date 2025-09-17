'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        router.replace('/auth/signin');
        return;
      }

      let data = {};
      try { data = await res.json(); } catch (_) {}

      if (res.status === 409) {
        setError('Account already exists. Redirecting to sign in…');
        setTimeout(() => router.replace('/auth/signin'), 1200);
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-extrabold text-slate-900">Create your account</h1>
            <p className="text-sm text-slate-600 mt-1">Join and start booking events</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm mb-1 text-slate-700">Name</label>
              <input
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-11 px-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition appearance-none"
                required
              />
            </div>
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
              {loading ? 'Creating account…' : 'Sign Up'}
            </button>

            {error && <p className="text-center text-sm text-red-500">{error}</p>}

            <p className="text-center text-sm text-slate-600">
              Already have an account?{' '}
              <a href="/auth/signin" className="font-medium text-indigo-600 hover:text-indigo-500">Sign in</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
