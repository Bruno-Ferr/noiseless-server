import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class WorkScheduleDto {
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek: number;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;
}

export class UpdateWorkSchedulesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkScheduleDto)
  workSchedules: WorkScheduleDto[];
}
