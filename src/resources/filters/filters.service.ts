import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { EnumProductSort } from 'src/enums/Filter.enum'
import { PrismaService } from 'src/prisma.service'
import { QueryFilterDTO } from '../data-transfer/query.dto'
import { ProductService } from '../product/product.service'
import { IFilterDTO } from './data-transfer'

@Injectable()
export class FilterService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly productService: ProductService,
  ) {}

  /**
   * @returns []
   */
  async productAttributes(query: IFilterDTO) {
    let data = {}
    const attributes = await this.prismaService.$queryRaw`
    SELECT DISTINCT ON (c.color, v.size)
      c.color, v.size, v.is_hit AS "isHit", v.is_new AS "isNew"
    FROM "product_variant" v
    JOIN "product" p ON p.id = v."productId"
    JOIN "product_category" pc ON pc."product_id" = p.id
    LEFT JOIN "colors" c ON c."variant_id" = v.id
    WHERE pc."category_id" = ${+query.category}`

    const categories = await this.prismaService.category.findMany({
      where: {
        parentId: Number(query.category),
      },
    })

    data = {
      attributes,
      categories,
    }
    return data
  }

  async findVariantAttributes(id: number) {
    let data = {}

    const attributes = await this.prismaService.productVariant.findMany({
      where: {
        product: {
          categories: {
            some: {
              category: {
                id,
              },
            },
          },
        },
      },
      select: {
        articleNumber: true,
        color: {
          select: {
            color: true,
          },
        },
        sales: true,
        size: true,
        rating: true,
        isHit: true,
        isNew: true,
        discount: true,
        price: true,
      },
      distinct: 'size',
    })
    const categories = await this.prismaService.category.findMany({
      where: {
        parentId: +id,
      },
    })
    data = {
      attributes,
      categories,
    }
    return data
  }

  /**
   *
   * @param query
   * @returns
   */
  async filterProducts(query?: QueryFilterDTO) {
    const filters: any = []

    if (query.color) {
      filters.push({
        color: {
          color: query.color,
        },
      })
    }

    if (query.size) {
      filters.push({
        size: query.size,
      })
    }

    let sort = this.sortFilter(query.sort)
    const variants = await this.prismaService.productVariant.findMany({
      where: {
        AND: [
          ...filters,
          {
            product: {
              categories: {
                some: {
                  categoryId: Number(query.category),
                },
              },
            },
          },
        ],
      },
      include: {
        color: true,
        product: {
          select: {
            id: true,
            slug: true,
            title: true,
            subtitle: true,
            description: true,
            poster: true,
          },
        },
      },
      orderBy: sort,
    })
    return variants
    // const products = await this.prismaService.product.findMany({
    //   where: {
    //     AND: filters,
    //   },
    //   include: {
    //     categories: {
    //       select: {
    //         category: true,
    //       },
    //     },
    //     variants: {
    //       include: {
    //         color: true,
    //         specifications: true,
    //       },
    //     },
    //   },
    //   orderBy: sort,
    // })
    // return products
  }

  private sortFilter(
    sort: EnumProductSort,
  ): Prisma.ProductVariantOrderByWithRelationInput {
    switch (sort) {
      case EnumProductSort.HIGH:
        return { price: 'asc' }
      case EnumProductSort.LOW:
        return { price: 'desc' }
      case EnumProductSort.NEWEST:
        return { createdAt: 'asc' }
      case EnumProductSort.OLDEST:
        return { createdAt: 'desc' }
    }
  }
}
