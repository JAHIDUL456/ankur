import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET() {
  const events = await prisma.event.findMany();
  return new Response(JSON.stringify(events), { status: 200 });
}

export async function POST(req) {
  const data = await req.json();
  const event = await prisma.event.create({ data });
  return new Response(JSON.stringify(event), { status: 201 });
}
