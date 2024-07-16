import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { EnumProductSort } from 'src/enums/Filter.enum'
import { PrismaService } from 'src/prisma.service'
import { QueryDTO } from '../data-transfer/query.dto'
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

  /**
   *
   * @param query
   * @returns
   */
  async filterProducts(query?: QueryDTO) {
    let filters = {}
    if (query.category) {
      filters = {
        categories: {
          some: {
            categoryId: Number(query.category),
          },
        },
      }
    }
    let sort = this.sortFilter(query.sort)
    const products = await this.prismaService.product.findMany({
      where: {
        AND: filters,
      },
      include: {
        variants: {
          include: {
            color: true,
            specifications: true,
          },
        },
      },
      orderBy: sort,
    })
    return products
  }

  private sortFilter(
    sort: EnumProductSort,
  ):
    | Prisma.ProductOrderByWithRelationInput
    | Prisma.ProductOrderByWithRelationInput[] {
    switch (sort) {
      case EnumProductSort.HIGH:
        return { defaultPrice: 'asc' }
      case EnumProductSort.LOW:
        return { defaultPrice: 'desc' }
      case EnumProductSort.NEWEST:
        return { createdAt: 'asc' }
      case EnumProductSort.OLDEST:
        return { createdAt: 'desc' }
    }
  }
}
