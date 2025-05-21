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
  const users: Prisma.UserCreateManyInput[] = [
    {
      profilePhoto:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop',
      id: 'user-1',
      name: 'Ana Souza',
      nickname: 'anasz',
      email: 'ana@bite.io',
      password: await hashPassword('ana123'),
      phone: null,
      gender: Gender.FEMININO,
      birthDate: new Date('1992-05-14'),
    },
    {
      profilePhoto:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop',
      id: 'user-2',
      name: 'Carlos Lima',
      nickname: 'carlao',
      email: 'carlos@bite.io',
      password: await hashPassword('carlos123'),
      phone: null,
      gender: Gender.MASCULINO,
      birthDate: new Date('1989-11-22'),
    },
    {
      profilePhoto:
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop',
      id: 'user-3',
      name: 'Fernanda Dias',
      nickname: 'fefe',
      email: 'fernanda@bite.io',
      password: await hashPassword('fernanda123'),
      phone: null,
      gender: Gender.FEMININO,
      birthDate: new Date('1995-08-07'),
    },
    {
      profilePhoto:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1887&auto=format&fit=crop',
      id: 'user-4',
      name: 'João Pedro',
      nickname: 'jp',
      email: 'joao@bite.io',
      password: await hashPassword('joao123'),
      phone: null,
      gender: Gender.MASCULINO,
      birthDate: new Date('1990-02-15'),
    },
    {
      profilePhoto:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1888&auto=format&fit=crop',
      id: 'user-5',
      name: 'Luciana Ribeiro',
      nickname: 'lu_r',
      email: 'luciana@bite.io',
      password: await hashPassword('luciana123'),
      phone: null,
      gender: Gender.FEMININO,
      birthDate: new Date('1993-06-30'),
    },
    {
      profilePhoto:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1887&auto=format&fit=crop',
      id: 'user-6',
      name: 'Guilherme Medeiros',
      nickname: 'gmedeiros',
      email: 'guilherme@bite.io',
      password: await hashPassword('guilherme123'),
      phone: null,
      gender: Gender.MASCULINO,
      birthDate: new Date('1994-04-18'),
    },
    {
      profilePhoto:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop',
      id: 'user-7',
      name: 'Juliana Costa',
      nickname: 'ju',
      email: 'juliana@bite.io',
      password: await hashPassword('juliana123'),
      phone: null,
      gender: Gender.FEMININO,
      birthDate: new Date('1996-12-01'),
    },
    {
      profilePhoto:
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1887&auto=format&fit=crop',
      id: 'user-8',
      name: 'Ricardo Neves',
      nickname: 'rick',
      email: 'ricardo@bite.io',
      password: await hashPassword('ricardo123'),
      phone: null,
      gender: Gender.MASCULINO,
      birthDate: new Date('1988-03-09'),
    },
    {
      profilePhoto:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1888&auto=format&fit=crop',
      id: 'user-9',
      name: 'Marina Leal',
      nickname: 'marileal',
      email: 'marina@bite.io',
      password: await hashPassword('marina123'),
      phone: null,
      gender: Gender.FEMININO,
      birthDate: new Date('1991-07-22'),
    },
    {
      profilePhoto:
        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1887&auto=format&fit=crop',
      id: 'user-10',
      name: 'Thiago Rocha',
      nickname: 'thiagor',
      email: 'thiago@bite.io',
      password: await hashPassword('thiago123'),
      phone: null,
      gender: Gender.MASCULINO,
      birthDate: new Date('1993-09-11'),
    },
  ];

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

  const restaurantData = [
    {
      profilePhoto:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEIq6ZWfCoYhGJKpvoxLjHiCJJw32nToHSvg&s',
      bannerPhoto:
        'https://img.lacadordeofertas.com.br/site/MTA1MDBfL3RtcC9waHBrNDVzUDZfMTUyODIyMTEwMg==.jpg',
      name: 'Nono Ludovico',
      address: 'Av. Lavras, 328 - Petrópolis',
      cnpj: '000000000001',
      email: 'bella@bite.io',
      phone: '5133337050',
      average_price: 125,
      latitude: -30.038390655384863,
      longitude: -51.18821504472203,
      description: 'Autêntica pizzaria italiana com forno a lenha.',
    },
    {
      profilePhoto:
        'https://static.ifood-static.com.br/image/upload/t_high/logosgde/64a6e849-6097-4a8a-bc98-3808bffc0020/201907011608_rgRY_i.jpg',
      bannerphoto:
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop',
      name: 'Le Grand Burger',
      address: 'R. Marquês do Pombal, 191 - Moinhos de Vento',
      cnpj: '000000000002',
      email: 'legrandburger@bite.io',
      phone: '5133951520',
      average_price: 80,
      latitude: -30.020163952610563,
      longitude: -51.202484304272005,
      description: 'Hambúrguer artesanal com carne angus e pão brioche.',
    },
    {
      profilePhoto:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-TtS0UjWA09d3SkG43n4npsIl8ZOPWiWFgA&s',
      bannerphoto:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6jTLXCJEhmEiau0nonF5S-W25d1iCpiqjcQ&s',
      name: 'Espaço Veganista',
      address: 'R. Vasco da Gama, 52 - Bom Fim',
      cnpj: '000000000003',
      email: 'veg@bite.io',
      phone: '5130128992',
      average_price: 40,
      latitude: -30.031380551062014,
      longitude: -51.211654773584264,
      description: 'Restaurante vegetariano com pratos criativos.',
    },
    {
      profilePhoto:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBI9y46X5uk941Jy_nrJl2Wq6e19git7aAxA&s',
      bannerphoto:
        'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1770&auto=format&fit=crop',
      name: 'Takêdo',
      address: 'R. Carvalho Monteiro, 397 - Bela Vista',
      cnpj: '000000000004',
      email: 'takedo@bite.io',
      phone: '5133885097',
      average_price: 230,
      latitude: -30.029031211895866,
      longitude: -51.18181966009222,
      description: 'Sushi bar moderno com rodízio e opções à la carte.',
    },
    {
      profilePhoto:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPseCUH2Nftc9nxwU2VZ9hVDFcXXMdkt8Xbw&s',
      bannerphoto:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcsNJgHNDqkf35tg5B-fOBsl18fLRwzmhSrg&s',
      name: 'Churrascaria Barranco',
      address: 'Av. Protásio Alves, 1578 - Alto Petrópolis',
      cnpj: '000000000005',
      email: 'barranco@bite.io',
      phone: '5132076773',
      average_price: 120,
      latitude: -30.0405049355526,
      longitude: -51.192216017763535,
      description: 'Churrasco tradicional com variedade de cortes premium.',
    },
  ];

  for (let i = 0; i < restaurantData.length; i++) {
    const r = restaurantData[i];
    const restId = `rest-${i + 1}`;
    const subset = tags
      .filter((t) =>
        [TagType.LOCAL, TagType.OCASIAO, TagType.CATEGORIA].includes(t.type),
      )
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);

    await prisma.restaurant.upsert({
      where: { email: r.email },
      create: {
        id: restId,
        profilePhoto: r.profilePhoto,
        bannerPhoto: r.bannerphoto,
        name: r.name,
        cnpj: r.cnpj,
        address: r.address,
        email: r.email,
        phone: r.phone,
        password: await hashPassword(`rest${i + 1}`),
        average_price: r.average_price,
        description: r.description,
        latitude: r.latitude,
        longitude: r.longitude,
        openingHours: makeHours(),
        tags: {
          create: subset.map((t) => ({ tagId: t.id })),
        },
      },
      update: {},
    });
  }

  return prisma.restaurant.findMany({ select: { id: true } });
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
    const chosen = restaurants.sort(() => 0.5 - Math.random()).slice(0, 3);
    for (const r of chosen) {
      checkins.push({
        user_id: u.id,
        restaurant_id: r.id,
        time_at: new Date(),
      });
    }
  }

  await prisma.checkin.createMany({
    data: checkins,
    skipDuplicates: true,
  });

  return prisma.checkin.findMany();
}

async function seedReviews(
  checkins: { id: string; user_id: string; restaurant_id: string }[],
) {
  const sampleFeedbacks = [
    'Excelente atendimento e comida deliciosa!',
    'Gostei bastante do ambiente.',
    'A pizza poderia estar mais quente.',
    'Hambúrguer suculento, recomendo!',
    'Bom custo-benefício e localização ótima.',
    'Serviço rápido e eficiente.',
    'Os pratos são bem servidos.',
    'O ambiente é barulhento, mas a comida compensa.',
    'Faltou opções no cardápio.',
    'Voltarei com certeza!',
  ];

  const reviewsData: {
    user_id: string;
    restaurant_id: string;
    stars: number;
    feedback?: string;
  }[] = [];

  for (const c of checkins) {
    if (Math.random() < 0.9) {
      const stars = Math.floor(Math.random() * 5) + 1;
      const feedback =
        sampleFeedbacks[Math.floor(Math.random() * sampleFeedbacks.length)];
      reviewsData.push({
        user_id: c.user_id,
        restaurant_id: c.restaurant_id,
        stars,
        feedback,
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
