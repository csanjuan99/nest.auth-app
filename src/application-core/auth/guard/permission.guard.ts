import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions: string[] = this.reflector.getAllAndOverride<
      string[]
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);
    if (!requiredPermissions) {
      throw new ForbiddenException();
    }
    const { user } = context.switchToHttp().getRequest();
    return requiredPermissions.some((permission: string) =>
      user.permissions?.includes(permission),
    );
  }
}
