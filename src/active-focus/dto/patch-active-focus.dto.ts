import { IsIn, IsOptional, IsString } from 'class-validator';

export class PatchActiveFocusDto {
  @IsOptional()
  @IsString()
  weeklyObjective?: string;

  @IsOptional()
  @IsIn(['active', 'completed', 'canceled'])
  status?: 'active' | 'completed' | 'canceled';
}
