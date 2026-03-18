import { PartialType } from '@nestjs/mapped-types';
import { CreateThoughtStreamDto } from './create-thought-stream.dto';

export class UpdateThoughtStreamDto extends PartialType(CreateThoughtStreamDto) {}
