import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthModuleService {
	constructor(private readonly prisma: PrismaService) {}

	private readonly tokenSecret = process.env.AUTH_TOKEN_SECRET ?? 'noiseless-dev-secret-change-me';

	private hashPassword(plainText: string): string {
		const salt = randomBytes(16).toString('hex');
		const derivedKey = scryptSync(plainText, salt, 64).toString('hex');
		return `${salt}:${derivedKey}`;
	}

	private verifyPassword(plainText: string, passwordHash: string): boolean {
		const [salt, storedHash] = passwordHash.split(':');
		if (!salt || !storedHash) {
			return false;
		}

		const derivedKey = scryptSync(plainText, salt, 64).toString('hex');
		if (storedHash.length !== derivedKey.length) {
			return false;
		}
		return timingSafeEqual(Buffer.from(storedHash, 'hex'), Buffer.from(derivedKey, 'hex'));
	}

	private signToken(userId: string) {
		const payload = Buffer.from(
			JSON.stringify({
				sub: userId,
				exp: Date.now() + 1000 * 60 * 60 * 24 * 30,
			}),
			'utf8',
		).toString('base64url');

		const signature = createHmac('sha256', this.tokenSecret).update(payload).digest('base64url');

		return `${payload}.${signature}`;
	}

	validateToken(token: string): { userId: string } {
		const [payload, signature] = token.split('.');
		if (!payload || !signature) {
			throw new UnauthorizedException('Token inválido.');
		}

		const expectedSignature = createHmac('sha256', this.tokenSecret).update(payload).digest('base64url');
		if (signature.length !== expectedSignature.length) {
			throw new UnauthorizedException('Assinatura do token inválida.');
		}
		if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
			throw new UnauthorizedException('Assinatura do token inválida.');
		}

		const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
			sub?: string;
			exp?: number;
		};

		if (!parsed.sub || !parsed.exp || parsed.exp < Date.now()) {
			throw new UnauthorizedException('Sessão expirada.');
		}

		return { userId: parsed.sub };
	}

	private toSession(user: { id: string; email: string; name: string | null }) {
		return {
			accessToken: this.signToken(user.id),
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
			},
		};
	}

	async register(payload: RegisterDto) {
		const email = payload.email.trim().toLowerCase();
		const existing = await this.prisma.user.findUnique({ where: { email } });

		if (existing) {
			if (existing.passwordHash) {
				throw new BadRequestException('E-mail já cadastrado.');
			}

			const upgraded = await this.prisma.user.update({
				where: { id: existing.id },
				data: {
					name: payload.name?.trim() || existing.name,
					passwordHash: this.hashPassword(payload.password),
				},
			});

			return this.toSession(upgraded);
		}

		const user = await this.prisma.user.create({
			data: {
				email,
				name: payload.name?.trim() || null,
				passwordHash: this.hashPassword(payload.password),
			},
		});

		return this.toSession(user);
	}

	async login(email: string, password: string) {
		const safeEmail = email.trim().toLowerCase();
		const user = await this.prisma.user.findUnique({ where: { email: safeEmail } });

		if (!user?.passwordHash || !this.verifyPassword(password, user.passwordHash)) {
			throw new UnauthorizedException('Credenciais inválidas.');
		}

		return this.toSession(user);
	}
}
