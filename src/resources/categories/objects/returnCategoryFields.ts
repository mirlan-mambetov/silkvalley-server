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
