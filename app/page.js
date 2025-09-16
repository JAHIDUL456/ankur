'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    router.push('/dashboard'); // redirect logged-in users
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">Welcome to Event Booking</h1>
      <div className="flex gap-4">
        <button
          onClick={() => router.push('/auth/signin')}
          className="px-6 py-2 bg-blue-500 text-white rounded"
        >
          Sign In
        </button>
        <button
          onClick={() => router.push('/events')}
          className="px-6 py-2 bg-green-500 text-white rounded"
        >
          Event List
        </button>
      </div>
    </div>
  );
}
