import { Module } from '@nestjs/common';
import { ActiveFocusService } from './active-focus.service';
import { ActiveFocusController } from './active-focus.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ActiveFocusController],
  providers: [ActiveFocusService],
})
export class ActiveFocusModule {}
