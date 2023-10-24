import { Prisma } from 'prisma/prisma-client'

export const RETURN_PRODUCT_FIELDS: Prisma.ProductsSelect = {
  attributes: true,
  category: {
    select: {
      id: true,
      name: true,
      slug: true,
      category: true,
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
  additianal_information: true,
  dimensions: true,
}
