import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInterestDto } from './dto/create-interest.dto';
import { PatchInterestDto } from './dto/patch-interest.dto';

@Injectable()
export class InterestsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateInterestDto) {
    return this.prisma.interest.create({
      data: {
        title: dto.title,
        category: dto.category,
        colorCode: dto.colorCode ?? null,
        isMaintenance: true,
        userId,
      },
    });
  }

  async findAllByUser(userId: string) {
    return this.prisma.interest.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async patch(userId: string, id: string, dto: PatchInterestDto) {
    const updated = await this.prisma.interest.updateMany({
      where: { id, userId },
      data: {
        title: dto.title,
        category: dto.category,
        isMaintenance: dto.isMaintenance,
        savedObjective: dto.savedObjective,
        colorCode: dto.colorCode,
      },
    });

    if (updated.count === 0) {
      return null;
    }

    return this.prisma.interest.findFirst({ where: { id, userId } });
  }

  async remove(userId: string, id: string) {
    const result = await this.prisma.interest.deleteMany({
      where: { id, userId },
    });

    return { deleted: result.count > 0 };
  }
}