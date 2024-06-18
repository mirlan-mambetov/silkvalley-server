import { Prisma } from '@prisma/client'

export const returnCategoryFields: Prisma.CategoryFindManyArgs = {
  include: {},
}
export const returnCategoryUniqueFields = {
  include: {
    categories: {
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        products: {
          select: {
            id: true,
          },
        },
      },
    },
    products: {
      select: {
        id: true,
      },
    },
  },
}
