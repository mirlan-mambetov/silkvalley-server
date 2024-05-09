import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { User } from 'prisma/prisma-client'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ user: User }>()
    const role = request.user.role

    const admin = role.some((role) => role !== 'OWNER' || 'ADMIN')
    if (admin) {
      throw new HttpException(
        'Недостаточно прав для доступа',
        HttpStatus.FORBIDDEN,
      )
    }
    return true
  }
}
