import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ThoughtStreamService } from './thought-stream.service';
import { CreateThoughtStreamDto } from './dto/create-thought-stream.dto';
import { OrganizeThoughtDto } from './dto/organize-thought.dto';
import { PatchThoughtDto } from './dto/patch-thought.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('thoughts')
@UseGuards(JwtAuthGuard) // Protege todas as rotas de captura
export class ThoughtStreamController {
  constructor(private readonly thoughtStreamService: ThoughtStreamService) {}

  @Post('capture')
  async capture(
    @GetUser('id') userId: string,
    @Body() createThoughtDto: CreateThoughtStreamDto,
  ) {
    return this.thoughtStreamService.capture(userId, createThoughtDto);
  }

  @Get('inbox')
  async getInbox(@GetUser('id') userId: string) {
    return this.thoughtStreamService.findAllUnorganized(userId);
  }

  @Get()
  async list(
    @GetUser('id') userId: string,
    @Query('status') status?: string,
    @Query('context') context?: string,
    @Query('interestId') interestId?: string,
  ) {
    return this.thoughtStreamService.find(userId, {
      status,
      context,
      interestId,
    });
  }

  @Patch(':id/library')
  async archiveToLibrary(@GetUser('id') userId: string, @Param('id') id: string) {
    return this.thoughtStreamService.moveToLibrary(userId, id);
  }

  @Patch(':id')
  async patch(
    @GetUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: PatchThoughtDto,
  ) {
    return this.thoughtStreamService.patch(userId, id, dto);
  }

  @Patch(':id/organize')
  async organize(
    @GetUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: OrganizeThoughtDto,
  ) {
    return this.thoughtStreamService.organize(userId, id, dto);
  }

  @Delete(':id')
  async remove(@GetUser('id') userId: string, @Param('id') id: string) {
    return this.thoughtStreamService.remove(userId, id);
  }
}