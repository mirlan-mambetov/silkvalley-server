import { Prisma } from '@prisma/client'

export const returnCategoryFields: Prisma.MainCategoryFindManyArgs = {
  include: {
    childCategories: true,
    products: {
      select: {
        id: true,
      },
    },
  },
}
export const returnCategoryUniqueFields = {
  include: {
    childCategories: {
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
