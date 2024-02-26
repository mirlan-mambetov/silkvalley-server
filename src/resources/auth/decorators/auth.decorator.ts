import { UseGuards, applyDecorators } from '@nestjs/common'
import { UserRoles } from '@prisma/client'
import { JwtAuthGuard } from '../guards/jwt.guard'
import { RolesGuard } from '../guards/roles.guard'

export const Auth = (role: UserRoles = 'USER') =>
  applyDecorators(
    role === 'ADMIN'
      ? UseGuards(JwtAuthGuard, RolesGuard)
      : UseGuards(JwtAuthGuard),
  )
