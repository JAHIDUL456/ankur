import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response(JSON.stringify([]));

  const bookings = await prisma.booking.findMany({
    where: { userId: session.user.id },
    include: { event: true },
  });

  return new Response(JSON.stringify(bookings));
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response(JSON.stringify({ error: 'Not logged in' }), { status: 401 });

  const { eventId } = await req.json();

  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event || event.seats <= 0) {
    return new Response(JSON.stringify({ error: 'Event full or not found' }), { status: 400 });
  }

  const booking = await prisma.booking.create({
    data: { userId: session.user.id, eventId },
  });

  await prisma.event.update({
    where: { id: eventId },
    data: { seats: event.seats - 1 },
  });

  return new Response(JSON.stringify(booking), { status: 201 });
}
