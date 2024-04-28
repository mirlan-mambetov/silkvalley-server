import { Prisma } from '@prisma/client'

export const returnProductFields: Prisma.ProductFindManyArgs = {
  include: {
    attributes: true,
  },
  // При следующей миграции сделать сортировку по дате обновления
  // orderBy:{

  // }
}
export const returnProductUniqueFields = {
  include: {
    category: {
      select: {
        id: true,
        name: true,
      },
    },
    secondCategory: {
      select: {
        id: true,
        name: true,
      },
    },
    specifications: true,
    attributes: true,
  },
}
