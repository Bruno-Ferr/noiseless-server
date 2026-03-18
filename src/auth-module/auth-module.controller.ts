import { Body, Controller, Post, Req } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthModuleService } from './auth-module.service';

@Controller('auth')
export class AuthModuleController {
	constructor(private readonly authService: AuthModuleService) {}

	@Post('login')
	login(@Req() req: any, @Body() body: LoginDto) {
		return this.authService.login(req.body.email);
	}
}
