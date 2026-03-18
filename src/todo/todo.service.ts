import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { PatchTodoDto } from './dto/patch-todo.dto';

@Injectable()
export class TodosService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateTodoDto) {
    return this.prisma.todo.create({
      data: {
        taskText: dto.taskText,
        context: dto.context,
        tags: dto.tags ?? [],
        interestId: dto.interestId,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        noteId: dto.noteId,
        userId,
      },
    });
  }

  async find(
    userId: string,
    filters?: { context?: string; interestId?: string; completed?: string },
  ) {
    return this.prisma.todo.findMany({
      where: {
        userId,
        context: filters?.context,
        interestId: filters?.interestId,
        isCompleted:
          filters?.completed === undefined
            ? undefined
            : filters.completed === 'true',
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async patch(userId: string, id: string, dto: PatchTodoDto) {
    const updated = await this.prisma.todo.updateMany({
      where: { id, userId },
      data: {
        isCompleted: dto.isCompleted,
        taskText: dto.taskText,
        context: dto.context,
        tags: dto.tags,
        interestId: dto.interestId,
        dueDate:
          dto.dueDate === undefined
            ? undefined
            : dto.dueDate === null
              ? null
              : new Date(dto.dueDate),
      },
    });

    if (updated.count === 0) {
      return null;
    }

    return this.prisma.todo.findFirst({ where: { id, userId } });
  }

  async remove(userId: string, id: string) {
    const deleted = await this.prisma.todo.deleteMany({
      where: { id, userId },
    });

    return { deleted: deleted.count > 0 };
  }

  async removeOldCompleted(userId: string, days?: string) {
    const daysValue = Number(days ?? 7);
    const millis = Number.isFinite(daysValue) ? daysValue * 24 * 60 * 60 * 1000 : 604800000;
    const deleted = await this.prisma.todo.deleteMany({
      where: {
        userId,
        isCompleted: true,
        updatedAt: { lt: new Date(Date.now() - millis) },
      },
    });

    return { deletedCount: deleted.count };
  }
}