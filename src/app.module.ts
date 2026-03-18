import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModuleModule } from './auth-module/auth-module.module';
import { ThoughtStreamModule } from './thought-stream/thought-stream.module';
import { InterestsModule } from './interests/interests.module';
import { ActiveFocusModule } from './active-focus/active-focus.module';
import { TodoModule } from './todo/todo.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    PrismaModule,
    AuthModuleModule,
    ThoughtStreamModule,
    InterestsModule,
    ActiveFocusModule,
    TodoModule,
    ProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
