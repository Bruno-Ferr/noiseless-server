import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthModuleService } from './auth-module.service';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthModuleController {
	constructor(private readonly authService: AuthModuleService) {}

	@Post('register')
	register(@Body() body: RegisterDto) {
		return this.authService.register(body);
	}

	@Post('login')
	login(@Body() body: LoginDto) {
		return this.authService.login(body.email, body.password);
	}
}
