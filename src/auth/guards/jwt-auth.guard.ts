import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

const DEMO_USER_ID = '00000000-0000-0000-0000-000000000001';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const headerUserId = request.headers['x-user-id'];
    const userId = typeof headerUserId === 'string' ? headerUserId : DEMO_USER_ID;
    request.user = { id: userId };
    return true;
  }
}
