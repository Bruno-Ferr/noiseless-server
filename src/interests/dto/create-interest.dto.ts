import { IsHexColor, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateInterestDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsOptional()
  @IsHexColor()
  colorCode?: string;
}