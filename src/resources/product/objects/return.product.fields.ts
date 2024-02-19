import { Prisma } from '@prisma/client'

export const returnProductFields: Prisma.ProductFindManyArgs = {
  include: {
    specifications: {
      select: {
        id: true,
        attributes: true,
        product: {
          select: {
            title: true,
            id: true,
          },
        },
      },
    },
    images: true,
  },
  // При следующей миграции сделать сортировку по дате обновления
  // orderBy:{

  // }
}
export const returnProductUniqueFields = {
  include: {
    specifications: {
      include: {
        attributes: true,
      },
    },
    images: true,
    mainCategory: {
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
  },
}
