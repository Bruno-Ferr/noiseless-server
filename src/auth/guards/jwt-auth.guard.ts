import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly tokenSecret = process.env.AUTH_TOKEN_SECRET ?? 'noiseless-dev-secret-change-me';

  private validateToken(token: string): string {
    const [payload, signature] = token.split('.');
    if (!payload || !signature) {
      throw new UnauthorizedException('Token inválido.');
    }

    const expectedSignature = createHmac('sha256', this.tokenSecret)
      .update(payload)
      .digest('base64url');

    if (signature.length !== expectedSignature.length) {
      throw new UnauthorizedException('Assinatura do token inválida.');
    }

    if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      throw new UnauthorizedException('Assinatura do token inválida.');
    }

    let decoded: { sub?: string; exp?: number };
    try {
      decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
        sub?: string;
        exp?: number;
      };
    } catch {
      throw new UnauthorizedException('Token inválido.');
    }

    if (!decoded.sub || !decoded.exp || decoded.exp < Date.now()) {
      throw new UnauthorizedException('Sessão expirada.');
    }

    return decoded.sub;
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token ausente.');
    }

    const token = authHeader.slice('Bearer '.length).trim();
    const userId = this.validateToken(token);
    request.user = { id: userId };
    return true;
  }
}
