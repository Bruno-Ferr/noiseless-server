import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { InterestsService } from './interests.service';
import { CreateInterestDto } from './dto/create-interest.dto';
import { PatchInterestDto } from './dto/patch-interest.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('interests')
@UseGuards(JwtAuthGuard)
export class InterestsController {
  constructor(private readonly interestsService: InterestsService) {}

  @Post()
  create(@GetUser('id') userId: string, @Body() dto: CreateInterestDto) {
    console.log("create interest", { userId, dto });
    return this.interestsService.create(userId, dto);
  }
 //1d72efa8-346a-42a8-893d-b929737bf37a
 //9138a312-8dda-40ef-b57e-3df6d4824b37
  @Get()
  findAll(@GetUser('id') userId: string) {
    return this.interestsService.findAllByUser(userId);
  }

  @Patch(':id')
  patch(
    @GetUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: PatchInterestDto,
  ) {
    return this.interestsService.patch(userId, id, dto);
  }

  @Delete(':id')
  remove(@GetUser('id') userId: string, @Param('id') id: string) {
    return this.interestsService.remove(userId, id);
  }
}