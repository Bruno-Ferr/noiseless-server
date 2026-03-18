import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { ProfileService } from './profile.service';
import { UpdateWorkSchedulesDto } from './dto/update-work-schedules.dto';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  getProfile(@GetUser('id') userId: string) {
    return this.profileService.getProfile(userId);
  }

  @Put('work-schedules')
  updateWorkSchedules(
    @GetUser('id') userId: string,
    @Body() dto: UpdateWorkSchedulesDto,
  ) {
    console.log('put')
    return this.profileService.updateWorkSchedules(userId, dto);
  }
}
