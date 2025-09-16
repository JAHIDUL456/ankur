'use client';

import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push('/');
      return;
    }

    fetch('/api/bookings')
      .then((res) => res.json())
      .then((data) => setBookings(data));
  }, [session]);

  if (!session) return null;

  const userInitial = session.user.name.charAt(0).toUpperCase();

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gray-700 text-white rounded-full flex items-center justify-center">
            {userInitial}
          </div>
          <span>{session.user.name}</span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="px-4 py-1 bg-red-500 text-white rounded"
        >
          Sign Out
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-4">My Bookings</h1>

      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookings.map((b) => (
            <div key={b.id} className="p-4 border rounded">
              <h2 className="font-bold">{b.event.title}</h2>
              <p>Date: {new Date(b.event.date).toLocaleString()}</p>
              <p>Venue: {b.event.venue}</p>
              <p>Price: ${b.event.price}</p>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => router.push('/events')}
        className="mt-4 px-6 py-2 bg-green-500 text-white rounded"
      >
        Show All Events
      </button>
    </div>
  );
}
