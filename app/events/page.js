'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    fetch('/api/events')
      .then((res) => res.json())
      .then((data) => setEvents(data));
  }, []);

  const handleBook = async (eventId) => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    const res = await fetch('/api/bookings/route', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId }),
    });

    if (res.ok) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Events</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((event) => (
          <div key={event.id} className="p-4 border rounded">
            <h2 className="font-bold">{event.title}</h2>
            <p>Date: {new Date(event.date).toLocaleString()}</p>
            <p>Venue: {event.venue}</p>
            <p>Price: ${event.price}</p>
            <p>Seats Available: {event.seats}</p>
            <button
              onClick={() => handleBook(event.id)}
              className="mt-2 px-4 py-1 bg-blue-500 text-white rounded"
            >
              Book
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
