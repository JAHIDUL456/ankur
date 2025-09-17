import prisma from '@/lib/prisma';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const events = await prisma.event.findMany({ orderBy: { id: 'desc' } });
    const withMinPrice = events.map(e => ({ ...e, price: Math.max(500, Number(e.price || 0)) }));
    return new Response(JSON.stringify(withMinPrice), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('GET /api/events error:', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch events' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const price = Math.max(500, Number(data?.price ?? 0));
    const event = await prisma.event.create({ data: { ...data, price } });
    return new Response(JSON.stringify(event), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('POST /api/events error:', err);
    return new Response(JSON.stringify({ error: 'Failed to create event' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
