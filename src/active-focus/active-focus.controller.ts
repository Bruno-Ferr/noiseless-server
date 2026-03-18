import { Controller, Post, Get, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { ActiveFocusService } from './active-focus.service';
import { CreateActiveFocusDto } from './dto/create-active-focus.dto';
import { PatchActiveFocusDto } from './dto/patch-active-focus.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('foci')
@UseGuards(JwtAuthGuard)
export class ActiveFocusController {
  constructor(private readonly activeFocusService: ActiveFocusService) {}

  @Post()
  create(@GetUser('id') userId: string, @Body() dto: CreateActiveFocusDto) {
    return this.activeFocusService.create(userId, dto);
  }

  @Get('active')
  getActive(@GetUser('id') userId: string) {
    return this.activeFocusService.findAllActive(userId);
  }

  @Patch(':id')
  patch(@GetUser('id') userId: string, @Param('id') id: string, @Body() dto: PatchActiveFocusDto) {
    return this.activeFocusService.patch(userId, id, dto);
  }

  @Patch(':id/complete')
  complete(@GetUser('id') userId: string, @Param('id') id: string) {
    return this.activeFocusService.completeFocus(userId, id);
  }
}