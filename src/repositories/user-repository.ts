import { PrismaClient, Gender, User } from '@prisma/client';

import { UpdateUserDto } from '../dtos/user-dto.js';

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

  static async update(userId: string, data: UpdateUserDto): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: {
        profilePhoto: data.profilePhoto,
        name: data.name,
        nickname: data.nickname,
        email: data.email,
        phone: data.phone,
        birthDate: data.birthDate,
      },
    });
  }

  static async updateTags(userId: string, tagIds: string[]): Promise<void> {
    await prisma.user_Preferences.deleteMany({
      where: { user_id: userId },
    });

    await prisma.user_Preferences.createMany({
      data: tagIds.map((tagId) => ({
        user_id: userId,
        tag_id: tagId,
        weight: 1,
      })),
      skipDuplicates: true,
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
