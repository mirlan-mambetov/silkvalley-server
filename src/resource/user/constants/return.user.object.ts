import { Prisma } from '@prisma/client'

export const RETURN_USER_OBJECT: Prisma.UserSelect = {
  id: true,
  username: true,
  email: true,
  avatar: true,
  role: true,
  featured: {
    include: {
      images: true,
    },
  },
  createdAt: true,
  updatedAt: true,
}
