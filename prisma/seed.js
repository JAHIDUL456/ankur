import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1️⃣ Users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const user1 = await prisma.user.create({
    data: {
      name: 'Ankur Ai',
      email: 'ankur@example.com',
      password: hashedPassword,
      role: 'USER', // add role
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Jahid',
      email: 'jahid@example.com',
      password: hashedPassword,
      role: 'USER',
    },
  });

  // 2️⃣ Events
  const event1 = await prisma.event.create({
    data: {
      title: 'Music Concert',
      description: 'Live music concert with popular bands.',
      venue: 'City Hall',
      date: new Date('2025-10-05T19:00:00'),
      price: 50,
      seats: 100,
    },
  });

  const event2 = await prisma.event.create({
    data: {
      title: 'Art Exhibition',
      description: 'Modern art gallery exhibition.',
      venue: 'Art Center',
      date: new Date('2025-10-10T11:00:00'),
      price: 30,
      seats: 50,
    },
  });

  const event3 = await prisma.event.create({
    data: {
      title: 'Tech Conference',
      description: 'Annual technology conference with talks and workshops.',
      venue: 'Convention Center',
      date: new Date('2025-11-01T09:00:00'),
      price: 100,
      seats: 200,
    },
  });

  // 3️⃣ Bookings
  await prisma.booking.create({
    data: {
      userId: user1.id,
      eventId: event1.id,
    },
  });

  console.log('Seeding finished!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
