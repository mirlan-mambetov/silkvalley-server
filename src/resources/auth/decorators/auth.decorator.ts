import { UseGuards, applyDecorators } from '@nestjs/common'
import { UserRoles } from '@prisma/client'
import { AuthGuard } from '../guards/auth.guard'
import { RolesGuard } from '../guards/roles.guard'

export const Auth = (role: UserRoles[] = ['USER']) =>
  applyDecorators(
    role.includes(UserRoles.ADMIN) || role.includes(UserRoles.OWNER)
      ? UseGuards(AuthGuard, RolesGuard)
      : UseGuards(AuthGuard),
  )
