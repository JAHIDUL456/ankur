import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return new Response(JSON.stringify([]), { status: 200 });
  }

  const bookings = await prisma.booking.findMany({
    where: { userId: Number(session.user.id) },
    include: { event: true },
  });

  const withMinPrice = bookings.map(b => ({
    ...b,
    event: b.event ? { ...b.event, price: Math.max(500, Number(b.event.price || 0)) } : b.event,
  }));

  return new Response(JSON.stringify(withMinPrice), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return new Response(JSON.stringify({ error: 'Not logged in' }), { status: 401 });
  }

  const { eventId, quantity } = await req.json();
  const eventIdNum = Number(eventId);
  const qty = Number(quantity ?? 1);
  if (!Number.isFinite(eventIdNum)) {
    return new Response(JSON.stringify({ error: 'Invalid event id' }), { status: 400 });
  }
  if (!Number.isFinite(qty) || qty < 1) {
    return new Response(JSON.stringify({ error: 'Invalid quantity' }), { status: 400 });
  }

  try {
    const booking = await prisma.$transaction(async (tx) => {
      
      const updated = await tx.event.updateMany({
        where: { id: eventIdNum, seats: { gte: qty } },
        data: { seats: { decrement: qty } },
      });

      if (updated.count === 0) {
        throw new Error('Not enough seats or event not found');
      }

    
      const createdOrUpdated = await tx.booking.upsert({
        where: { userId_eventId: { userId: Number(session.user.id), eventId: eventIdNum } },
        create: { userId: Number(session.user.id), eventId: eventIdNum, quantity: qty },
        update: { quantity: { increment: qty } },
      });

      return createdOrUpdated;
    });

    return new Response(JSON.stringify(booking), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const raw = err instanceof Error ? err.message : 'Booking failed';

    
    const lower = typeof raw === 'string' ? raw.toLowerCase() : '';
    if (
      typeof raw === 'string' && (
        lower.includes('unknown arg') && lower.includes('quantity') ||
        lower.includes('unknown argument') && lower.includes('quantity') ||
        raw.includes('Failed to validate the query') ||
        lower.includes('no such column')
      )
    ) {
      try {
        const booking = await prisma.$transaction(async (tx) => {
          const updated = await tx.event.updateMany({
            where: { id: eventIdNum, seats: { gte: qty } },
            data: { seats: { decrement: qty } },
          });
          if (updated.count === 0) {
            throw new Error('Not enough seats or event not found');
          }

          
          const where = { userId_eventId: { userId: Number(session.user.id), eventId: eventIdNum } };
          const existing = await tx.booking.findUnique({ where });
          if (existing) return existing;
          const created = await tx.booking.create({
            data: { userId: Number(session.user.id), eventId: eventIdNum },
          });
          return created;
        });

        return new Response(JSON.stringify(booking), {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (fallbackErr) {
        const msg = fallbackErr instanceof Error ? fallbackErr.message : 'Booking failed';
        const status = msg.includes('Not enough') ? 400 : 500;
        return new Response(JSON.stringify({ error: msg }), { status });
      }
    }

    const status = raw.includes('seats') || raw.includes('Not enough') ? 400 : 500;
    return new Response(JSON.stringify({ error: raw }), { status });
  }
}
