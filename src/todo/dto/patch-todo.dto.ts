import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class PatchTodoDto {
  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;

  @IsOptional()
  @IsString()
  taskText?: string;

  @IsOptional()
  @IsIn(['work', 'personal', 'study', 'project'])
  context?: 'work' | 'personal' | 'study' | 'project';

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsUUID()
  interestId?: string | null;

  @IsOptional()
  @IsDateString()
  dueDate?: string | null;
}
