import { Controller, Post, Get, Body, Patch, Param, Query, UseGuards, Delete } from '@nestjs/common';
import { TodosService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { PatchTodoDto } from './dto/patch-todo.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('todos')
@UseGuards(JwtAuthGuard)
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  create(@GetUser('id') userId: string, @Body() dto: CreateTodoDto) {
    return this.todosService.create(userId, dto);
  }

  @Get()
  findAll(
    @GetUser('id') userId: string,
    @Query('context') context?: string,
    @Query('interestId') interestId?: string,
    @Query('completed') completed?: string,
  ) {
    return this.todosService.find(userId, {
      context,
      interestId,
      completed,
    });
  }

  @Patch(':id')
  patch(@GetUser('id') userId: string, @Param('id') id: string, @Body() dto: PatchTodoDto) {
    return this.todosService.patch(userId, id, dto);
  }

  @Delete(':id')
  remove(@GetUser('id') userId: string, @Param('id') id: string) {
    return this.todosService.remove(userId, id);
  }

  @Delete('clean')
  clean(@GetUser('id') userId: string, @Query('days') days?: string) {
    return this.todosService.removeOldCompleted(userId, days);
  }
}