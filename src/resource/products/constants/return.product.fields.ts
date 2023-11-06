import { Prisma } from 'prisma/prisma-client'
import { RETURN_USER_OBJECT } from 'src/resource/user/constants/return.user.object'

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
  brand: true,
  reviews: {
    select: {
      id: true,
      description: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          ...RETURN_USER_OBJECT,
          createdAt: false,
          updatedAt: false,
          featured: false,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  },
}
