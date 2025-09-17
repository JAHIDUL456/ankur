import prisma from '@/lib/prisma';

export const runtime = 'nodejs';

export async function GET(_req, { params }) {
  const idNum = Number(params.id);
  if (!Number.isFinite(idNum)) {
    return new Response(JSON.stringify({ error: 'Invalid id' }), { status: 400 });
  }

  try {
    const event = await prisma.event.findUnique({ where: { id: idNum } });
    if (!event) {
      return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
    }
    const withMinPrice = { ...event, price: Math.max(500, Number(event.price || 0)) };
    return new Response(JSON.stringify(withMinPrice), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('GET /api/events/[id] error:', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch event' }), { status: 500 });
  }
}
