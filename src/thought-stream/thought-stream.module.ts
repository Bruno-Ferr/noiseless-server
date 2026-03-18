import { Module } from '@nestjs/common';
import { ThoughtStreamService } from './thought-stream.service';
import { ThoughtStreamController } from './thought-stream.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ThoughtStreamController],
  providers: [ThoughtStreamService],
})
export class ThoughtStreamModule {}
