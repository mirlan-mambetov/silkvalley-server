import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { Users } from 'prisma/prisma-client'

export const CurrentUser = createParamDecorator(
  (data: keyof Users, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    const user = request.user
    if (!user) {
      console.error('User is undefined in CurrentUser decorator')
      return
    }
    return data ? user[data] : user
  },
)
