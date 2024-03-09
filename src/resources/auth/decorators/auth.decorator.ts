import { UseGuards, applyDecorators } from '@nestjs/common'
import { UserRoles } from '@prisma/client'
import { JwtAuthGuard } from '../guards/jwt.guard'
import { RolesGuard } from '../guards/roles.guard'

export const Auth = (role: UserRoles = 'USER') =>
  applyDecorators(
    role.includes(UserRoles.SUPERUSER || UserRoles.OWNER)
      ? UseGuards(JwtAuthGuard, RolesGuard)
      : UseGuards(JwtAuthGuard),
  )
