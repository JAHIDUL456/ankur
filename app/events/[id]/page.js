'use client';

import { useState } from 'react';

export default function EventDetail({ params }) {
  const [message, setMessage] = useState('');

  const id = params.id; // just use params.id directly for now

  const bookTicket = async () => {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId: id }),
    });

    if (res.ok) setMessage('Booking successful!');
    else setMessage('Booking failed!');
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded shadow mt-6">
      <h1 className="text-2xl font-bold mb-4">Event Details</h1>
      <p>Event ID: {id}</p>
      <button
        onClick={bookTicket}
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
      >
        Book Ticket
      </button>
      {message && <p className="mt-2 text-blue-500">{message}</p>}
    </div>
  );
}
