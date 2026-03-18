import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateThoughtStreamDto } from './dto/create-thought-stream.dto';
import { OrganizeThoughtDto } from './dto/organize-thought.dto';
import { PatchThoughtDto } from './dto/patch-thought.dto';

@Injectable()
export class ThoughtStreamService {
  constructor(private prisma: PrismaService) {}

  async capture(userId: string, createThoughtDto: CreateThoughtStreamDto) {
    return this.prisma.thoughtStream.create({
      data: {
        content: createThoughtDto.content,
        userId,
        activeFocusId: createThoughtDto.activeFocusId,
        status: 'unorganized',
      },
    });
  }

  async findAllUnorganized(userId: string) {
    return this.prisma.thoughtStream.findMany({
      where: {
        userId,
        status: 'unorganized',
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async find(
    userId: string,
    filters?: { status?: string; context?: string; interestId?: string },
  ) {
    return this.prisma.thoughtStream.findMany({
      where: {
        userId,
        status: filters?.status,
        context: filters?.context,
        interestId: filters?.interestId,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async moveToLibrary(userId: string, thoughtId: string) {
    const result = await this.prisma.thoughtStream.updateMany({
      where: { id: thoughtId, userId },
      data: { status: 'library' },
    });

    if (result.count === 0) {
      return null;
    }

    return this.prisma.thoughtStream.findFirst({ where: { id: thoughtId, userId } });
  }

  async organize(userId: string, thoughtId: string, dto: OrganizeThoughtDto) {
    const thought = await this.prisma.thoughtStream.findFirst({
      where: { id: thoughtId, userId },
    });

    if (!thought) {
      return null;
    }

    if (dto.destination === 'delete') {
      await this.prisma.thoughtStream.deleteMany({ where: { id: thoughtId, userId } });
      return { deleted: true };
    }

    if (dto.destination === 'note') {
      const updatedThought = await this.prisma.thoughtStream.update({
        where: { id: thoughtId },
        data: {
          status: 'note',
          context: dto.context,
          interestId: dto.interestId,
          tags: dto.tags ?? [],
        },
      });
      return { thought: updatedThought };
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const updatedThought = await tx.thoughtStream.update({
        where: { id: thoughtId },
        data: {
          status: 'archived',
          context: dto.context,
          interestId: dto.interestId,
          tags: dto.tags ?? [],
        },
      });

      const todo = await tx.todo.create({
        data: {
          userId,
          taskText: thought.content,
          isCompleted: false,
          context: dto.context,
          tags: dto.tags ?? [],
          interestId: dto.interestId,
          noteId: thought.id,
        },
      });

      return { thought: updatedThought, todo };
    });

    return result;
  }

  async patch(userId: string, thoughtId: string, dto: PatchThoughtDto) {
    const updated = await this.prisma.thoughtStream.updateMany({
      where: { id: thoughtId, userId },
      data: {
        status: dto.status,
        context: dto.context,
        interestId: dto.interestId,
        tags: dto.tags,
      },
    });

    if (updated.count === 0) {
      return null;
    }

    return this.prisma.thoughtStream.findFirst({ where: { id: thoughtId, userId } });
  }

  async remove(userId: string, thoughtId: string) {
    const deleted = await this.prisma.thoughtStream.deleteMany({
      where: { id: thoughtId, userId },
    });

    return { deleted: deleted.count > 0 };
  }
}