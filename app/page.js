'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    router.push('/dashboard'); 
    return null;
  }

  return (
    <div className="relative min-h-[100svh] overflow-hidden bg-gradient-to-b from-white to-slate-50">
      
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,white,transparent_65%)]"
      >
        <div className="absolute -top-24 left-1/2 h-[60vh] w-[80vw] -translate-x-1/2 rounded-full bg-[conic-gradient(at_top_left,var(--tw-gradient-stops))] from-sky-100 via-indigo-100 to-purple-100 blur-3xl" />
      </div>

      <main className="mx-auto flex max-w-3xl flex-col items-center px-6 py-28 text-center sm:py-36">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          Find and book events
        </h1>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => router.push('/events')}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-white shadow-sm transition hover:bg-black hover:shadow-md"
          >
            Browse events
          </button>
          <button
            onClick={() => router.push('/auth/signin')}
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-slate-900 transition hover:bg-slate-50"
          >
            Sign in
          </button>
        </div>
      </main>
    </div>
  );
}
