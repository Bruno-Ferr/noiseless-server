import { IsArray, IsIn, IsOptional, IsString, IsUUID } from 'class-validator';

export class OrganizeThoughtDto {
  @IsIn(['todo', 'note', 'delete'])
  destination: 'todo' | 'note' | 'delete';

  @IsOptional()
  @IsIn(['work', 'personal', 'study', 'project'])
  context?: 'work' | 'personal' | 'study' | 'project';

  @IsOptional()
  @IsUUID()
  interestId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
