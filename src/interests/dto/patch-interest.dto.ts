import { IsBoolean, IsHexColor, IsOptional, IsString } from 'class-validator';

export class PatchInterestDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsBoolean()
  isMaintenance?: boolean;

  @IsOptional()
  @IsString()
  savedObjective?: string | null;

  @IsOptional()
  @IsHexColor()
  colorCode?: string | null;
}
