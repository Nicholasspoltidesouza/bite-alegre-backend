import { randomUUID } from 'node:crypto';

import { PrismaClient, TagType, Weekday, Gender, Prisma } from '@prisma/client';

import { hashPassword } from '../src/utils/crypto.js';
import { hhmmToDate } from '../src/utils/time.js';

const prisma = new PrismaClient();

async function seedTags() {
  await prisma.tag.createMany({
    skipDuplicates: true,
    data: [
      { name: 'Restaurante', type: TagType.LOCAL },
      { name: 'Bar', type: TagType.LOCAL },
      { name: 'Pastelaria', type: TagType.LOCAL },
      { name: 'Boteco', type: TagType.LOCAL },
      { name: 'Pub temático', type: TagType.LOCAL },
      { name: 'Café colonial', type: TagType.LOCAL },
      { name: 'Hambúrguer', type: TagType.CATEGORIA },
      { name: 'Sanduíche', type: TagType.CATEGORIA },
      { name: 'Saudável', type: TagType.CATEGORIA },
      { name: 'Rodízio', type: TagType.CATEGORIA },
      { name: 'Buffet Livre', type: TagType.CATEGORIA },
      { name: 'Massas', type: TagType.CATEGORIA },
      { name: 'Japones', type: TagType.CATEGORIA },
      { name: 'Churrasco', type: TagType.CATEGORIA },
      { name: 'Vegetariano', type: TagType.CATEGORIA },
      { name: 'Vegano', type: TagType.CATEGORIA },
      { name: 'Pizza', type: TagType.CATEGORIA },
      { name: 'Amigos', type: TagType.OCASIAO },
      { name: 'Date', type: TagType.OCASIAO },
      { name: 'Família', type: TagType.OCASIAO },
      { name: 'Café', type: TagType.OCASIAO },
      { name: 'Almoço', type: TagType.OCASIAO },
      { name: 'Janta', type: TagType.OCASIAO },
      { name: 'Lanche', type: TagType.OCASIAO },
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
      influencer: true,
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
      influencer: true,
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

async function seedRestaurants(
  tags: { id: string; name: string; type: TagType }[],
) {
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
      tags: tags.filter((t) =>
        ['Pizza', 'Restaurante', 'Família', 'Janta', 'Almoço'].includes(t.name),
      ),
      dishes: [
        {
          name: 'Pizza Margherita',
          dish_price: new Prisma.Decimal(45.0),
          dish_photo:
            'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          main_dish: true,
          description:
            'Molho de tomate, mussarela, manjericão e azeite de oliva.',
        },
        {
          name: 'Pizza Calabresa',
          dish_price: new Prisma.Decimal(50.0),
          dish_photo:
            'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          main_dish: false,
          description:
            'Calabresa fatiada, cebola roxa, molho de tomate e queijo.',
        },
        {
          name: 'Pizza 4 Queijos',
          dish_price: new Prisma.Decimal(50.0),
          dish_photo:
            'https://images.unsplash.com/photo-1662805524663-7851d77cc133?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          main_dish: false,
          description: 'Pizza com quatro tipos de queijo e molho de tomate.',
        },
      ],
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
      tags: tags.filter((t) =>
        [
          'Hambúrguer',
          'Restaurante',
          'Amigos',
          'Família',
          'Janta',
          'Date',
        ].includes(t.name),
      ),
      dishes: [
        {
          name: 'Le Grand Angus',
          dish_price: new Prisma.Decimal(42.0),
          dish_photo:
            'https://images.unsplash.com/photo-1550547660-d9450f859349',
          main_dish: true,
          description:
            'Hambúrguer de carne Angus 180g com queijo emmental, cebola caramelizada e maionese da casa.',
        },
        {
          name: 'Burger Veggie',
          dish_price: new Prisma.Decimal(38.0),
          dish_photo:
            'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          main_dish: false,
          description:
            'Hambúrguer vegetariano com falafel, tahine e rúcula no pão de beterraba.',
        },
      ],
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
      tags: tags.filter((t) =>
        [
          'Vegetariano',
          'Saudável',
          'Restaurante',
          'Amigos',
          'Família',
          'Almoço',
          'Lanche',
        ].includes(t.name),
      ),
      dishes: [
        {
          name: 'Estrogonofe de Grão-de-Bico',
          dish_price: new Prisma.Decimal(29.9),
          dish_photo:
            'https://images.unsplash.com/photo-1609595781576-1580ff3ee291?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          main_dish: true,
          description:
            'Grão-de-bico cozido em creme de castanha com cogumelos, servido com arroz integral e batata palha.',
        },
        {
          name: 'Salada Thai Vegana',
          dish_price: new Prisma.Decimal(25.0),
          dish_photo:
            'https://images.unsplash.com/photo-1643310765760-ac258fad80a8?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          main_dish: false,
          description:
            'Mix de folhas, cenoura, pepino, amendoim e molho agridoce à base de tamarindo.',
        },
      ],
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
      tags: tags.filter((t) =>
        ['Japones', 'Rodízio', 'Restaurante', 'Janta', 'Date'].includes(t.name),
      ),
      dishes: [
        {
          name: 'Combinado Takêdo (30 peças)',
          dish_price: new Prisma.Decimal(98.0),
          dish_photo:
            'https://images.unsplash.com/photo-1607886098701-91274ad78cf9?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          main_dish: true,
          description:
            'Seleção de sushis e sashimis variados com salmão, atum, peixe branco e uramakis.',
        },
        {
          name: 'Temaki de Salmão com Cebolinha',
          dish_price: new Prisma.Decimal(28.0),
          dish_photo:
            'https://plus.unsplash.com/premium_photo-1668146932065-d08643791942?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          main_dish: false,
          description:
            'Cone de alga recheado com salmão fresco, cebolinha e gergelim.',
        },
      ],
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
      tags: tags.filter((t) =>
        [
          'Churrasco',
          'Rodízio',
          'Restaurante',
          'Almoço',
          'Família',
          'Amigos',
        ].includes(t.name),
      ),
      dishes: [
        {
          name: 'Picanha na Brasa',
          dish_price: new Prisma.Decimal(89.0),
          dish_photo:
            'https://images.unsplash.com/photo-1565299715199-866c917206bb?q=80&w=1980&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          main_dish: true,
          description: 'Fatiada ao ponto, acompanhada de farofa, vinagrete.',
        },
        {
          name: 'Buffet de Saladas',
          dish_price: new Prisma.Decimal(32.0),
          dish_photo:
            'https://images.unsplash.com/photo-1720443000468-89d509202615?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          main_dish: false,
          description:
            'Buffet livre de saladas variadas e acompanhamentos frescos.',
        },
      ],
    },
    {
      profilePhoto:
        'https://media.istockphoto.com/id/458546943/pt/foto/close-up-de-basquetebol-mcdonalds-outdoor-contra-o-c%C3%A9u-azul.jpg?s=612x612&w=0&k=20&c=8TpFIf9coKN5uQ_yHnel4noEG3xZiR4l9t6xQpWL5IQ=',
      bannerphoto:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcsNJgHNDqkf35tg5B-fOBsl18fLRwzmhSrg&s',
      name: 'Mc Donalds',
      address: '3895 Stevens Creek Blvd, Santa Clara, CA 95051, United States',
      cnpj: '000000000006',
      email: 'mcdonalds@bite.io',
      phone: '5132076773',
      average_price: 50,
      latitude: 37.323708,
      longitude: -121.9690399,
      description: 'Mc Donalds from Santa Clara city.',
      tags: tags.filter((t) =>
        [
          'Hambúrguer',
          'Restaurante',
          'Amigos',
          'Família',
          'Café',
          'Janta',
          'Lanche',
          'Almoço',
        ].includes(t.name),
      ),
      dishes: [
        {
          name: 'Big Mac',
          dish_price: new Prisma.Decimal(20.0),
          dish_photo:
            'https://api-middleware-mcd.mcdonaldscupones.com/media/image/product$kzXCTbnv/200/200/original?country=br',
          main_dish: true,
          description:
            'Dois hambúrgueres, alface, queijo, molho especial, cebola, picles em um pão com gergelim.',
        },
        {
          name: 'Mc Lanche Feliz',
          dish_price: new Prisma.Decimal(25.0),
          dish_photo:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpzEDfj5MdaJ8UPen-PGJr897nPfG1K-1QxA&s',
          main_dish: false,
          description:
            'Hambúrguer, batata-frita, Danoninho e suco natural. Esolha seu brinquedo!',
        },
      ],
    },
    {
      profilePhoto:
        'https://dynl.mktgcdn.com/p/g56WqN2fCQULR397Cm0ssv5rWQtopQPUmxTQNviRknI/450x450.jpg',
      bannerphoto:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcsNJgHNDqkf35tg5B-fOBsl18fLRwzmhSrg&s',
      name: 'Five Guys',
      address: '3555 Stevens Creek Blvd, Santa Clara, CA 95051, United States',
      cnpj: '000000000006',
      email: 'five.guys@bite.io',
      phone: '5132076787',
      average_price: 50,
      latitude: 37.323702,
      longitude: -121.9690395,
      description: 'Five guys from Santa Clara city.',
      tags: tags.filter((t) =>
        [
          'Hambúrguer',
          'Restaurante',
          'Amigos',
          'Família',
          'Janta',
          'Lanche',
          'Almoço',
        ].includes(t.name),
      ),
      dishes: [
        {
          name: 'Bacon Cheeseburger',
          dish_price: new Prisma.Decimal(24.9),
          dish_photo:
            'https://tb-static.uber.com/prod/image-proc/processed_images/4cab48192e564746535574989e0d8c71/66345bbe137cfe4e15769c434c6c397c.jpeg',
          main_dish: true,
          description:
            'Fresh patties hot off the grill with American-style cheese and crispy apple-wood smoked bacon. Placed on a soft, toasted sesame seed bun. Choose as many toppings as you want.',
        },
        {
          name: 'Cheese Dog',
          dish_price: new Prisma.Decimal(28.9),
          dish_photo:
            'https://media.timeout.com/images/105276299/750/562/image.jpg',
          main_dish: false,
          description:
            'All-beef hot dog, split and grilled lengthwise for a caramelized exterior with a layer of American-style cheese on top and any of your favorite toppings.',
        },
      ],
    },
    {
      profilePhoto:
        'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/06/c8/71/72/subway.jpg?w=900&h=500&s=1',
      bannerphoto:
        'https://s3-media0.fl.yelpcdn.com/bphoto/1ffrIuas_Ko2KBago71cWA/348s.jpg',
      name: 'Subway Santa Clara',
      address: '2068 El Camino Real, Santa Clara, CA 95050, United States',
      cnpj: '000000000007',
      email: 'subway.1@bite.io',
      phone: '5132076781',
      average_price: 29.99,
      latitude: 37.323512,
      longitude: -121.9690195,
      description: 'Subway, the best sandwiches in Santa Clara city.',
      tags: tags.filter((t) =>
        [
          'Sanduíche',
          'Saudável',
          'Vegetariano',
          'Restaurante',
          'Amigos',
          'Família',
          'Janta',
          'Lanche',
          'Almoço',
        ].includes(t.name),
      ),
      dishes: [
        {
          name: 'Frango Defumado com Cream Cheese',
          dish_price: new Prisma.Decimal(19.0),
          dish_photo:
            'https://sbw-cms.zamp.com.br/foto_mobile_sanduiches_frango_defumado_com_cream_cheese_9ec86261b4/foto_mobile_sanduiches_frango_defumado_com_cream_cheese_9ec86261b4.jpg',
          main_dish: true,
          description:
            'Monte o seu saboroso sanduíche com pão, vegetais, queijos e molhos à sua escolha, tudo acompanhado pelo irresistível Frango Defumado com Cream Cheese.',
        },
        {
          name: 'BMT Italiano',
          dish_price: new Prisma.Decimal(17.9),
          dish_photo:
            'https://sbw-cms.zamp.com.br/foto_desktop_sanduiches_embutidos_bmt_italiano_a0cef6fafc/foto_desktop_sanduiches_embutidos_bmt_italiano_a0cef6fafc.jpg',
          main_dish: false,
          description:
            'Escolha o pão, os vegetais, o queijo e os molhos que mais gosta para combinar com a explosão de sabor do trio clássico: pepperoni, presunto e salame, em um sanduíche irresistível.',
        },
      ],
    },
  ];

  for (let i = 0; i < restaurantData.length; i++) {
    const r = restaurantData[i];
    const restId = `rest-${i + 1}`;

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
          create: r.tags.map((t) => ({ tagId: t.id })),
        },
        restaurantDishes: {
          create: r.dishes,
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
    const chosen = categoryTags.sort(() => 0.5 - Math.random()).slice(0, 5);
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

async function seedPublications(restaurants: { id: string }[]) {
  const users = [{ id: 'user-1' }, { id: 'user-2' }];

  const sampleDescriptions = [
    'Delicioso prato do dia! Venha experimentar.',
    'Happy Hour com promoções incríveis.',
    'Novo cardápio disponível. Confira as novidades!',
    'Evento especial neste final de semana.',
    'Desconto exclusivo para nossos seguidores!',
    'Lugar perfeito para aquele date de dia dos namorados!',
    'Para você sair com sua família.',
  ];
  const sampleURL = [
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Zm9vZ',
    'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGZvb2R8ZW58MHx8MHx8fDA%3D',
    'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://img.lacadordeofertas.com.br/site/MTA1MDBfL3RtcC9waHBrNDVzUDZfMTUyODIyMTEwMg==.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcsNJgHNDqkf35tg5B-fOBsl18fLRwzmhSrg&s',
    'https://images.unsplash.com/photo-1582182601206-3b5943913295?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudCUyMHBvcnRvJTIwYWxlZ3JlfGVufDB8fDB8fHww',
    'https://images.unsplash.com/photo-1731939906436-7a7b4d62d711?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cmVzdGF1cmFudCUyMHBvcnRvJTIwYWxlZ3JlfGVufDB8fDB8fHww',
  ];

  const publicationsData: {
    user_id: string;
    restaurant_id: string;
    description: string;
    feedback?: string;
    url: string;
  }[] = [];

  for (const user of users) {
    const numPublications = Math.floor(Math.random() * 3) + 2;
    const shuffledRestaurants = [...restaurants].sort(
      () => 0.5 - Math.random(),
    );

    for (
      let i = 0;
      i < numPublications && i < shuffledRestaurants.length;
      i++
    ) {
      const restaurant = shuffledRestaurants[i];
      const description =
        sampleDescriptions[
          Math.floor(Math.random() * sampleDescriptions.length)
        ];
      const url = sampleURL[Math.floor(Math.random() * sampleURL.length)];

      publicationsData.push({
        user_id: user.id,
        restaurant_id: restaurant.id,
        description,
        url,
      });
    }
  }

  await prisma.publication.createMany({
    data: publicationsData,
  });

  return prisma.publication.findMany();
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
    'Muito bom.',
    'Meu restaurante preferido.',
    'Meh.',
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

async function seedFavorites(
  users: { id: string }[],
  restaurants: { id: string }[],
) {
  const favorites: { user_id: string; restaurant_id: string; time_at: Date }[] =
    [];

  for (const u of users) {
    const chosen = restaurants.sort(() => 0.5 - Math.random()).slice(0, 3);
    for (const r of chosen) {
      favorites.push({
        user_id: u.id,
        restaurant_id: r.id,
        time_at: new Date(),
      });
    }
  }

  await prisma.favorite.createMany({
    data: favorites,
    skipDuplicates: true,
  });
}

async function main() {
  console.log('🌱  Seeding database…');
  const tags = await seedTags();
  const users = await seedUsers();
  const restaurants = await seedRestaurants(tags);
  await seedUserPreferences(users, tags);
  const checkins = await seedCheckins(users, restaurants);
  await seedReviews(checkins);
  await seedPublications(restaurants);
  await seedFavorites(users, restaurants);
  console.log('✅  Seed finished');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
