import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';

export async function DELETE(_req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return new Response(JSON.stringify({ error: 'Not logged in' }), { status: 401 });
  }

  const idNum = Number(params.id);
  if (!Number.isFinite(idNum)) {
    return new Response(JSON.stringify({ error: 'Invalid booking id' }), { status: 400 });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findFirst({
        where: { id: idNum, userId: Number(session.user.id) },
        select: { id: true, eventId: true },
      });

      if (!booking) {
        throw new Error('Booking not found');
      }

      
      const deleted = await tx.booking.delete({ where: { id: booking.id } });
      await tx.event.update({
        where: { id: booking.eventId },
        data: { seats: { increment: deleted.quantity ?? 1 } },
      });

      return { id: booking.id };
    });

    return new Response(JSON.stringify({ success: true, ...result }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Cancellation failed';
    const status = message.includes('not found') ? 404 : 500;
    return new Response(JSON.stringify({ error: message }), { status });
  }
}
