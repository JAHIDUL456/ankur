import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';


export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return new Response(JSON.stringify({ error: 'Not logged in' }), { status: 401 });
  }

  const me = await prisma.user.findUnique({ where: { id: Number(session.user.id) } });
  if (!me || me.role !== 'ADMIN') {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  let from = 500;
  let to = 1000;
  try {
    const body = await req.json().catch(() => null);
    if (body && Number.isFinite(Number(body.from)) && Number.isFinite(Number(body.to))) {
      from = Number(body.from);
      to = Number(body.to);
    }
  } catch (_) {}

  const result = await prisma.event.updateMany({ where: { price: from }, data: { price: to } });
  return new Response(JSON.stringify({ from, to, updated: result.count }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
