import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Users } from 'prisma/prisma-client'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ user: Users }>()
    const role = request.user.role

    const admin = role.some(
      (role) => role.includes('OWNER') || role.includes('ADMIN'),
    )

    if (!admin) {
      throw new ForbiddenException('Недостаточно прав для доступа!')
    }
    return true
  }
}
