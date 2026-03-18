import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateWorkSchedulesDto } from './dto/update-work-schedules.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    const [workSchedules, interests, activeFoci] = await Promise.all([
      this.prisma.workSchedule.findMany({
        where: { userId },
        orderBy: { dayOfWeek: 'asc' },
      }),
      this.prisma.interest.findMany({
        where: { userId },
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.activeFocus.findMany({
        where: { userId },
        orderBy: { startDate: 'desc' },
      }),
    ]);

    console.log({ workSchedules, interests, activeFoci });
    return {
      workSchedules,
      interests,
      activeFoci,
    };
  }

  async updateWorkSchedules(userId: string, dto: UpdateWorkSchedulesDto) {
    await this.prisma.$transaction([
      this.prisma.workSchedule.deleteMany({ where: { userId } }),
      this.prisma.workSchedule.createMany({
        data: (dto.workSchedules ?? []).map((s) => ({
          userId,
          dayOfWeek: s.dayOfWeek,
          startTime: s.startTime,
          endTime: s.endTime,
        })),
      }),
    ]);

    return this.prisma.workSchedule.findMany({
      where: { userId },
      orderBy: { dayOfWeek: 'asc' },
    });
  }
}
