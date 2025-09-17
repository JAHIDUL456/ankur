'use client';

import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState([]);
  const [loadingIds, setLoadingIds] = useState([]);
  const router = useRouter();

  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (status === 'authenticated') {
      fetch('/api/bookings')
        .then((res) => res.json())
        .then((data) => setBookings(Array.isArray(data) ? data : []))
        .catch(() => setBookings([]));
    }
  }, [status]);

  if (status === 'loading') return null;
  if (status === 'unauthenticated') return null;

  const userInitial = (session.user?.name || '?').charAt(0).toUpperCase();

  const cancelBooking = async (id) => {
    setLoadingIds((ids) => [...ids, id]);
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBookings((prev) => prev.filter((b) => b.id !== id));
      }
    } finally {
      setLoadingIds((ids) => ids.filter((x) => x !== id));
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-semibold">
            {userInitial}
          </div>
          <span className="text-slate-900 font-medium">{session.user.name}</span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="px-4 h-10 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg"
        >
          Sign Out
        </button>
      </div>

      <h1 className="text-2xl font-extrabold mb-4 text-slate-900">My Bookings</h1>

      {bookings.length === 0 ? (
        <p className="text-slate-600">No bookings yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookings.map((b) => (
            <div key={b.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-lg text-slate-900">{b.event.title}</h2>
              <div className="mt-2 text-sm text-slate-600">
                <p>Date: {new Date(b.event.date).toLocaleString()}</p>
                <p>Venue: {b.event.venue}</p>
                <p>Seats booked: {b.quantity ?? 1}</p>
                <p>Total: {(((b.event.price || 0) * (b.quantity ?? 1))).toFixed(2)} TK</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => cancelBooking(b.id)}
                  disabled={loadingIds.includes(b.id)}
                  className={`w-full sm:w-auto px-4 h-10 rounded-lg font-medium border ${loadingIds.includes(b.id) ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' : 'bg-white text-red-600 border-red-200 hover:bg-red-50'}`}
                >
                  {loadingIds.includes(b.id) ? 'Cancelling…' : 'Cancel Booking'}
                </button>
                <a
                  href={`/events/${b.event.id}`}
                  className="w-full sm:w-auto px-4 h-10 leading-10 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-center"
                >
                  Details
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => router.push('/events')}
        className="mt-6 px-6 h-12 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium"
      >
        Show All Events
      </button>
    </div>
  );
}
