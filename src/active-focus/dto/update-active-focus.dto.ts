import { PartialType } from '@nestjs/mapped-types';
import { CreateActiveFocusDto } from './create-active-focus.dto';

export class UpdateActiveFocusDto extends PartialType(CreateActiveFocusDto) {}
