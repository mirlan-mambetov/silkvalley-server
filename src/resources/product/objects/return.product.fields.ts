import { Prisma } from '@prisma/client'

export const returnProductFields: Prisma.ProductFindManyArgs = {
  include: {
    specification: {
      select: {
        id: true,
        attribute: true,
        product: {
          select: {
            title: true,
            id: true,
          },
        },
      },
    },
  },
}
