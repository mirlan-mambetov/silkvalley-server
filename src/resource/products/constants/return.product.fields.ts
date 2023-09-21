import { Prisma } from 'prisma/prisma-client'

export const RETURN_PRODUCT_FIELDS: Prisma.ProductsSelect = {
  attributes: true,
  category: {
    select: {
      id: true,
      name: true,
    },
  },
  images: {
    select: {
      id: true,
      color: true,
      images: true,
      productId: true,
    },
  },
}
