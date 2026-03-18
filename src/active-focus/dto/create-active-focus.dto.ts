import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateActiveFocusDto {
  @IsString()
  @IsNotEmpty()
  weeklyObjective: string;

  @IsUUID()
  @IsNotEmpty()
  interestId: string;
}