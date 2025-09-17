'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [quantities, setQuantities] = useState({});
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const res = await fetch('/api/events');
        if (!res.ok) throw new Error('Failed to load events');
        const data = await res.json();
        setEvents(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Error fetching events:', e);
        setEvents([]);
      }
    };
    loadEvents();
  }, []);

  const handleBook = async (eventId) => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }
    if (status === 'loading') {
      return; 
    }

    const qty = Math.max(1, Math.min(Number(quantities[eventId] || 1), (events.find(e => e.id === eventId)?.seats ?? 1)));
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId, quantity: qty }),
    });

    if (res.ok) {
      router.push('/dashboard');
    } else {
      
      const data = await res.json().catch(() => ({}));
      alert(data.error || 'Booking failed');
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <button
        type="button"
        aria-label="Go back"
        onClick={() => router.back()}
        className="mb-4 inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition"
      >
        ← Back
      </button>
      <h1 className="text-3xl font-extrabold mb-6 text-slate-900">
        All Events
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(Array.isArray(events) ? events : []).map((event) => (
          <div key={event.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <h2 className="font-semibold text-lg text-slate-900">
                {event.title}
              </h2>
              <span className="text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                {event.price} TK
              </span>
            </div>
            <div className="mt-2 text-sm text-slate-600">
              <p>Date: {new Date(event.date).toLocaleString()}</p>
              <p>Venue: {event.venue}</p>
              <p className="mt-1">Seats Available: {event.seats}</p>
            </div>
              <div className="mt-4 flex flex-wrap gap-3 items-center">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-sm text-slate-700">Seats</span>
                  <div className="inline-flex items-center rounded-lg border border-slate-300 bg-slate-50 overflow-hidden shadow-sm">
                    <button
                      type="button"
                      aria-label="Decrease seats"
                      onClick={() =>
                        setQuantities((q) => {
                          const cur = Number(q[event.id] ?? 1);
                          const next = Math.max(1, cur - 1);
                          return { ...q, [event.id]: next };
                        })
                      }
                      disabled={(quantities[event.id] ?? 1) <= 1}
                      className={`h-10 px-3 text-slate-700 hover:bg-slate-100 focus:outline-none focus:bg-slate-100 ${
                        (quantities[event.id] ?? 1) <= 1 ? 'opacity-40 cursor-not-allowed' : ''
                      }`}
                    >
                      −
                    </button>
                    <div className="h-10 w-12 flex items-center justify-center bg-white text-slate-900 font-medium border-x border-slate-300">
                      {quantities[event.id] ?? 1}
                    </div>
                    <button
                      type="button"
                      aria-label="Increase seats"
                      onClick={() =>
                        setQuantities((q) => {
                          const cur = Number(q[event.id] ?? 1);
                          const cap = Math.max(1, event.seats);
                          const next = Math.min(cap, cur + 1);
                          return { ...q, [event.id]: next };
                        })
                      }
                      disabled={(quantities[event.id] ?? 1) >= Math.max(1, event.seats)}
                      className={`h-10 px-3 text-slate-700 hover:bg-slate-100 focus:outline-none focus:bg-slate-100 ${
                        (quantities[event.id] ?? 1) >= Math.max(1, event.seats) ? 'opacity-40 cursor-not-allowed' : ''
                      }`}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => handleBook(event.id)}
                  disabled={event.seats <= 0}
                  className={`w-full sm:w-auto px-4 py-2 rounded-lg text-white font-medium transition-colors active:scale-[.99] shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 ${event.seats <= 0 ? 'bg-slate-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'}`}
                >
                  {event.seats <= 0 ? 'Sold Out' : 'Book'}
                </button>
                <a
                  href={`/events/${event.id}`}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition text-center"
                >
                  Details
                </a>
              </div>
          </div>
        ))}
      </div>
    </div>
  );
}
