import { UserRoles } from '@prisma/client'

export const checkUserRole = (role: UserRoles[]) => {
  const admin = role.some((r) => r.includes(UserRoles.ADMIN))
  const user = role.some((r) => r.includes(UserRoles.USER))
  const owner = role.some((r) => r.includes(UserRoles.OWNER))

  return {
    admin,
    user,
    owner,
  }
}
