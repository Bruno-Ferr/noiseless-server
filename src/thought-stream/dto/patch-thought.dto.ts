import { IsArray, IsIn, IsOptional, IsString, IsUUID } from 'class-validator';

export class PatchThoughtDto {
  @IsOptional()
  @IsIn(['unorganized', 'note', 'library', 'archived'])
  status?: 'unorganized' | 'note' | 'library' | 'archived';

  @IsOptional()
  @IsIn(['work', 'personal', 'study', 'project'])
  context?: 'work' | 'personal' | 'study' | 'project';

  @IsOptional()
  @IsUUID()
  interestId?: string | null;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
