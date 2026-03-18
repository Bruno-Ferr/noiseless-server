import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthModuleService {
	constructor(private readonly prisma: PrismaService) {}

	async login(email: string) {
		console.log("login attempt", { email });
		const safeEmail = (email ?? '').trim().toLowerCase();
		const userEmail = safeEmail || `demo+${Date.now()}@noiseless.local`;

		const user = await this.prisma.user.upsert({
			where: { email: userEmail },
			update: {},
			create: { email: userEmail },
		});

		return {
			accessToken: `dev-token-${user.id}`,
			user: {
				id: user.id,
				email: user.email,
			},
		};
	}
}
