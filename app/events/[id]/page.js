'use client';

import { use, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function EventDetail({ params }) {
  // Unwrap params using React.use() for Next.js migration compatibility
  const unwrappedParams = use(params);
  const id = unwrappedParams?.id;
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/events/${id}`);
        if (!res.ok) throw new Error('Failed to load event');
        const data = await res.json();
        setEvent(data);
      } catch (e) {
        console.error(e);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const bookTicket = async () => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }
    if (status === 'loading') {
      return; 
    }

    setMessage('');
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId: id, quantity: Math.max(1, Math.min(Number(quantity || 1), event?.seats ?? 1)) }),
    });

    if (res.ok) setMessage('Booking successful!');
    else {
      const data = await res.json().catch(() => ({}));
      setMessage(data.error || 'Booking failed!');
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!event) return <div className="p-6">Event not found.</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded shadow mt-6">
      <h1 className="text-2xl font-bold mb-2">{event.title}</h1>
      {event.description && <p className="mb-2">{event.description}</p>}
      <p>Date: {new Date(event.date).toLocaleString()}</p>
      <p>Venue: {event.venue}</p>
      <p>Price: {event.price} TK</p>
      <p className="mt-1">Seats Available: {event.seats}</p>
      <div className="mt-3">
        <label className="block text-sm mb-1 text-slate-700">Quantity</label>
        <input
          type="number"
          min={1}
          max={Math.max(1, event.seats)}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-24 h-11 px-3 rounded-lg border border-slate-300 bg-white text-slate-900 outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500"
        />
      </div>
      <button
        onClick={bookTicket}
        disabled={event.seats <= 0}
        className={`mt-4 px-4 py-2 rounded text-white ${event.seats <= 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600'}`}
      >
        {event.seats <= 0 ? 'Sold Out' : 'Book Ticket'}
      </button>
      {message && <p className="mt-2 text-blue-600">{message}</p>}
    </div>
  );
}
