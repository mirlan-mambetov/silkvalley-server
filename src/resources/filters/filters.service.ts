import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { EnumProductSort } from 'src/enums/Filter.enum'
import { PrismaService } from 'src/prisma.service'
import { QueryDTO } from '../data-transfer/query.dto'
import { ProductService } from '../product/product.service'

@Injectable()
export class FiltersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly productService: ProductService,
  ) {}

  async productAttributes(slug: string) {
    let filters = []
    const product = await this.prismaService.product.findMany({
      where: {
        OR: [
          {
            category: {
              slug,
            },
          },
          {
            secondCategory: {
              slug,
            },
          },
          {
            childsCategory: {
              slug,
            },
          },
        ],
      },
      include: { attributes: true },
    })
    const seenAttributes = new Set() // Сет для хранения уникальных атрибутов
    product.forEach((product) => {
      product.attributes.forEach((attribute) => {
        const key = `${attribute.size}_${attribute.color}` // Создание уникального ключа для атрибута
        if (!seenAttributes.has(key)) {
          // Проверка, не встречался ли атрибут ранее
          seenAttributes.add(key) // Добавление атрибута в набор
          filters.push({
            color: attribute.color,
            size: attribute.size,
          })
        }
      })
    })

    return filters
  }

  async filterdProducts(dto?: QueryDTO) {
    const sorts = this.sortFilter(dto.sort)
    const filters = []
    if (dto.childsCategoryId)
      filters.push({ childsCategory: { id: Number(dto.childsCategoryId) } })
    if (dto.secondCategoryId)
      filters.push({ secondCategory: { id: Number(dto.secondCategoryId) } })
    if (dto.mainCategoryId)
      filters.push({ category: { id: Number(dto.mainCategoryId) } })
    if (dto.maxPrice || dto.maxPrice)
      filters.push(this.priceFilter(dto.minPrice, dto.maxPrice))
    if (dto.selectedColor)
      filters.push({ attributes: { some: { color: dto.selectedColor } } })
    // if (dto.selectedSize)
    //   filters.push({
    //     attributes: { some: { size: { contains: dto.selectedSize } } },
    //   })
    const products = await this.prismaService.product.findMany({
      where: {
        AND: filters,
        attributes: {
          some: {
            size: {
              equals: dto.selectedSize,
            },
          },
        },
      },
      orderBy: sorts,
    })
    return products
  }

  sortFilter(sort: EnumProductSort): Prisma.ProductOrderByWithRelationInput[] {
    switch (sort) {
      case EnumProductSort.LOW_PRICE:
        return [{ price: 'desc' }]
      case EnumProductSort.HIGH_PRICE:
        return [{ price: 'asc' }]
      case EnumProductSort.NEWEST:
        return [{ createdAt: 'asc' }]
      case EnumProductSort.OLDEST:
        return [{ createdAt: 'desc' }]
    }
  }

  private priceFilter(minPrice?: number, maxPrice?: number) {
    let priceFilter: Prisma.IntFilter | undefined = undefined

    if (minPrice) {
      priceFilter = {
        ...priceFilter,
        gte: Number(minPrice),
      }
    }

    if (maxPrice) {
      priceFilter = {
        ...priceFilter,
        lte: Number(maxPrice),
      }
    }
    return {
      price: priceFilter,
    }
  }
}
