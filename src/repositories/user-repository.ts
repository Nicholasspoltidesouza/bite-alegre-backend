import { PrismaClient, Gender, User } from '@prisma/client';

const prisma = new PrismaClient();

export class UserRepository {
  static async create(
    name: string,
    nickname: string,
    email: string,
    password: string,
    gender: Gender,
    birthDate: Date,
    phone?: string,
    profilePhoto?: string,
    influencer?: boolean,
  ) {
    return prisma.user.create({
      data: {
        profilePhoto,
        name,
        nickname,
        email,
        password,
        phone,
        gender,
        birthDate,
        influencer,
      },
    });
  }

  static async getAllowedGenders() {
    return Object.values(Gender);
  }

  static async findAll() {
    return prisma.user.findMany();
  }

  static async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  static async findByNickname(nickname: string) {
    return await prisma.user.findUnique({
      where: { nickname },
    });
  }

  static async findById(id: string) {
    if (!id) {
      throw new Error('User ID is required');
    }
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  static async findByName(nickname: string) {
    return await prisma.user.findMany({
      where: {
        nickname: {
          contains: nickname,
          mode: 'insensitive',
        },
      },
    });
  }

  static async findOne(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
      include: {
        review: {
          include: {
            restaurant: true,
          },
        },
        checkin: {
          include: {
            restaurant: true,
          },
        },
      },
    });
  }
}
