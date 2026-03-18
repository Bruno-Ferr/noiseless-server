import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateActiveFocusDto } from './dto/create-active-focus.dto';
import { PatchActiveFocusDto } from './dto/patch-active-focus.dto';

@Injectable()
export class ActiveFocusService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateActiveFocusDto) {
    const activeCount = await this.prisma.activeFocus.count({
      where: {
        userId,
        status: 'active',
      },
    });

    if (activeCount >= 2) {
      throw new BadRequestException(
        'Limite de 2 focos ativos atingido. Conclua ou arquive um foco antes de iniciar outro.',
      );
    }

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 14);

    return this.prisma.activeFocus.create({
      data: {
        weeklyObjective: dto.weeklyObjective,
        interestId: dto.interestId,
        userId,
        status: 'active',
        endDate,
      },
    });
  }

  async findAllActive(userId: string) {
    return this.prisma.activeFocus.findMany({
      where: { userId, status: 'active' },
      orderBy: { startDate: 'desc' },
    });
  }

  async patch(userId: string, id: string, dto: PatchActiveFocusDto) {
    const result = await this.prisma.activeFocus.updateMany({
      where: { id, userId },
      data: {
        weeklyObjective: dto.weeklyObjective,
        status: dto.status,
      },
    });

    if (result.count === 0) {
      return null;
    }

    return this.prisma.activeFocus.findFirst({ where: { id, userId } });
  }

  async completeFocus(userId: string, id: string) {
    const result = await this.prisma.activeFocus.updateMany({
      where: { id, userId },
      data: { status: 'completed' },
    });

    if (result.count === 0) {
      return null;
    }

    return this.prisma.activeFocus.findFirst({ where: { id, userId } });
  }
}