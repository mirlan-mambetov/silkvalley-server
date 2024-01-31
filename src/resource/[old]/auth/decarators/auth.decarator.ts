import { UseGuards, applyDecorators } from '@nestjs/common'
import { EnumUserRole } from 'prisma/prisma-client'
import { JwtAuthGuard } from '../guards/jwt.auth.guard'
import { RolesGuard } from '../guards/roles.guards'

export const Auth = (role: EnumUserRole = 'USER') =>
  applyDecorators(
    role === 'ADMIN'
      ? UseGuards(JwtAuthGuard, RolesGuard)
      : UseGuards(JwtAuthGuard),
  )
