// prisma/seed.ts
import { randomUUID } from 'node:crypto';

import { PrismaClient, TagType, Weekday, Gender, Prisma } from '@prisma/client';

import { hashPassword } from '../src/utils/crypto.js';
import { hhmmToDate } from '../src/utils/time.js';

const prisma = new PrismaClient();

async function seedTags() {
  await prisma.tag.createMany({
    skipDuplicates: true,
    data: [
      { name: 'Centro', type: TagType.LOCAL },
      { name: 'Zona Sul', type: TagType.LOCAL },
      { name: 'Hambúrguer', type: TagType.CATEGORIA },
      { name: 'Pizza', type: TagType.CATEGORIA },
      { name: 'Pet-friendly', type: TagType.OCASIAO },
    ],
  });
  return prisma.tag.findMany();
}

async function seedUsers() {
  const users: Prisma.UserCreateManyInput[] = await Promise.all(
    Array.from({ length: 5 }, async (_, i) => ({
      id: `user-${i + 1}`,
      name: `Demo User ${i + 1}`,
      nickname: `user${i + 1}`,
      email: `user${i + 1}@bite.io`,
      password: await hashPassword(`user${i + 1}`),
      phone: null,
      gender: Gender.NAO_QUERO_INFORMAR,
      birthDate: new Date(`199${i + 1}-01-01`),
    })),
  );
  await prisma.user.createMany({ data: users, skipDuplicates: true });
  return prisma.user.findMany({ select: { id: true } });
}

async function seedRestaurants(tags: { id: string; type: TagType }[]) {
  const makeHours = () => ({
    createMany: {
      data: [
        Weekday.MON,
        Weekday.TUE,
        Weekday.WED,
        Weekday.THU,
        Weekday.FRI,
      ].map((w) => ({
        periodId: randomUUID(),
        weekday: w,
        opensAt: hhmmToDate('09:00'),
        closesAt: hhmmToDate('18:00'),
      })),
    },
  });

  const restaurants: { id: string; email: string }[] = [];
  for (let i = 1; i <= 5; i++) {
    const restId = `rest-${i}`;
    const email = `rest${i}@bite.io`;
    const subset = tags
      .filter(
        (t) =>
          t.type === TagType.LOCAL ||
          t.type === TagType.OCASIAO ||
          t.type === TagType.CATEGORIA,
      )
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);

    await prisma.restaurant.upsert({
      where: { email },
      create: {
        id: restId,
        name: `Restaurante ${i}`,
        cnpj: `00000000000${i}`,
        address: `Rua ${i} nº ${i * 10}`,
        email,
        phone: `5199${String(i).repeat(8)}`,
        password: await hashPassword(`rest${i}`),
        average_price: 50 + i * 5,
        description: `Restaurante de teste ${i}`,
        latitude: -30.0 - i * 0.01,
        longitude: -51.2 - i * 0.01,
        openingHours: makeHours(),
        tags: {
          create: subset.map((t) => ({ tagId: t.id })),
        },
      },
      update: {},
    });

    restaurants.push({ id: restId, email });
  }

  return prisma.restaurant.findMany({ select: { id: true, email: true } });
}

async function seedUserPreferences(
  users: { id: string }[],
  tags: { id: string; type: TagType }[],
) {
  const categoryTags = tags
    .filter((t) => t.type === TagType.CATEGORIA)
    .map((t) => t.id);
  const prefs: { user_id: string; tag_id: string; weight: number }[] = [];

  for (const u of users) {
    const chosen = categoryTags.sort(() => 0.5 - Math.random()).slice(0, 2);
    for (const tagId of chosen) {
      prefs.push({ user_id: u.id, tag_id: tagId, weight: 1 });
    }
  }

  await prisma.user_Preferences.createMany({
    data: prefs,
    skipDuplicates: true,
  });
}

async function seedCheckins(
  users: { id: string }[],
  restaurants: { id: string }[],
) {
  const checkins: { user_id: string; restaurant_id: string; time_at: Date }[] =
    [];

  for (const u of users) {
    const chosen = restaurants.sort(() => 0.5 - Math.random()).slice(0, 2);
    for (const r of chosen) {
      checkins.push({
        user_id: u.id,
        restaurant_id: r.id,
        time_at: new Date(),
      });
    }
  }

  return prisma.checkin
    .createMany({
      data: checkins,
      skipDuplicates: true,
    })
    .then(() => prisma.checkin.findMany());
}

async function seedReviews(
  checkins: { id: string; user_id: string; restaurant_id: string }[],
) {
  const reviewsData: {
    user_id: string;
    restaurant_id: string;
    stars: number;
    feedback?: string;
  }[] = [];

  for (const c of checkins) {
    if (Math.random() < 0.5) {
      const stars = Math.floor(Math.random() * 5) + 1;
      reviewsData.push({
        user_id: c.user_id,
        restaurant_id: c.restaurant_id,
        stars,
        feedback: `Feedback com ${stars} estrelas!`,
      });
    }
  }

  await prisma.review.createMany({ data: reviewsData, skipDuplicates: true });
}

async function main() {
  console.log('🌱  Seeding database…');
  const tags = await seedTags();
  const users = await seedUsers();
  const restaurants = await seedRestaurants(tags);
  await seedUserPreferences(users, tags);
  const checkins = await seedCheckins(users, restaurants);
  await seedReviews(checkins);
  console.log('✅  Seed finished');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
