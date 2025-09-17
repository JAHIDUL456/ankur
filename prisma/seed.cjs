
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@example.com';
  const password = 'admin123';
  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.upsert({
    where: { email },
    update: { password: hashed, role: 'ADMIN' },
    create: { name: 'Admin', email, password: hashed, role: 'ADMIN' },
  });

  
  const launchData = {
    title: 'Launch Party',
    description: 'Celebrate the launch with us!',
    date: new Date(),
    venue: 'Main Hall',
    price: 1000,
    seats: 100,
  };
  const existingLaunch = await prisma.event.findFirst({ where: { title: launchData.title } });
  if (existingLaunch) {
    await prisma.event.update({ where: { id: existingLaunch.id }, data: launchData });
  } else {
    await prisma.event.create({ data: launchData });
  }

 
  const moreEvents = [
    {
      title: 'Tech Conference 2025',
      description: 'A full-day conference on emerging technologies and AI.',
      date: new Date('2025-01-15T10:00:00Z'),
      venue: 'Convention Center',
      price: 2500,
      seats: 500,
    },
    {
      title: 'Summer Music Fest',
      description: 'Live performances by top artists across multiple stages.',
      date: new Date('2025-06-20T16:00:00Z'),
      venue: 'Open Air Grounds',
      price: 1800,
      seats: 2000,
    },
    {
      title: 'Art & Design Expo',
      description: 'Explore contemporary art and interactive design exhibits.',
      date: new Date('2025-03-08T11:00:00Z'),
      venue: 'City Gallery',
      price: 750,
      seats: 300,
    },
    {
      title: 'Startup Pitch Night',
      description: 'Early-stage founders pitch to investors and mentors.',
      date: new Date('2025-02-10T18:30:00Z'),
      venue: 'Innovation Hub',
      price: 500,
      seats: 150,
    },
    {
      title: 'Global Street Food Carnival',
      description: 'Taste authentic street food from around the world.',
      date: new Date('2025-04-12T12:00:00Z'),
      venue: 'Riverside Park',
      price: 300,
      seats: 800,
    },
  ];

  for (const data of moreEvents) {
    const existing = await prisma.event.findFirst({ where: { title: data.title } });
    if (existing) {
      await prisma.event.update({ where: { id: existing.id }, data });
    } else {
      await prisma.event.create({ data });
    }
  }
}

main()
  .then(() => console.log('Seed completed'))
  .catch((e) => {
    console.error('Seed error:', e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
