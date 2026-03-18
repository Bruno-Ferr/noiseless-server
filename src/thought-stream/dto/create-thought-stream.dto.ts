import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateThoughtStreamDto {
	@IsString()
	@IsNotEmpty()
	content: string;

	@IsOptional()
	@IsUUID()
	activeFocusId?: string;
}
