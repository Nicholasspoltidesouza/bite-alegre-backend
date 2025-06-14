import { PrismaClient, Gender, User, Prisma } from '@prisma/client';

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

  static async updateTags(userId: string, newTagIds: string[]): Promise<void> {
    const existingPrefs = await prisma.user_Preferences.findMany({
      where: { user_id: userId },
      select: { id: true, tag_id: true },
    });

    const existingTagIds = new Set(existingPrefs.map((pref) => pref.tag_id));
    const newTagIdSet = new Set(newTagIds);
    const tagsToAdd = newTagIds.filter((tagId) => !existingTagIds.has(tagId));

    const tagsToRemove = existingPrefs
      .filter((pref) => !newTagIdSet.has(pref.tag_id))
      .map((pref) => pref.tag_id);

    if (tagsToAdd.length > 0) {
      await prisma.user_Preferences.createMany({
        data: tagsToAdd.map((tagId) => ({
          user_id: userId,
          tag_id: tagId,
          weight: 1,
        })),
        skipDuplicates: true,
      });
    }

    if (tagsToRemove.length > 0) {
      await prisma.user_Preferences.deleteMany({
        where: {
          user_id: userId,
          tag_id: { in: tagsToRemove },
        },
      });
    }
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

  static async findOneBasic(id: string): Promise<PartialUserForEdit | null> {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        profilePhoto: true,
        name: true,
        nickname: true,
        email: true,
        phone: true,
        influencer: true,
      },
    });
  }

  static async findOne(id: string): Promise<UserWithDetails | null> {
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
        favorites: {
          include: {
            restaurant: {
              select: { id: true, profilePhoto: true, review: true },
            },
          },
        },
      },
    });
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const userWithDetailsArgs = Prisma.validator<Prisma.UserDefaultArgs>()({
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
    favorites: {
      include: {
        restaurant: { select: { id: true, profilePhoto: true, review: true } },
      },
    },
  },
});

type PartialUserForEdit = {
  id: string;
  profilePhoto: string | null;
  name: string;
  nickname: string;
  email: string;
  phone: string | null;
  influencer: boolean | null;
};

type UserWithDetails = Prisma.UserGetPayload<typeof userWithDetailsArgs>;
