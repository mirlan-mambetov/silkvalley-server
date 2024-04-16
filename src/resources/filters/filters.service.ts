import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { EnumProductSort } from 'src/enums/Filter.enum'
import { PrismaService } from 'src/prisma.service'
import { QueryDTO } from '../data-transfer/query.dto'

@Injectable()
export class FiltersService {
  constructor(private readonly prismaService: PrismaService) {}

  async productAttributes(slug: string) {
    let filters = {}
    const productColors: string[] = []
    const productSizes: string[] = []

    const category = await this.prismaService.mainCategory.findUnique({
      where: { slug },
      include: {
        products: {
          select: {
            images: true,
            sizes: true,
          },
        },
      },
    })

    // Извлекаем цвета и размеры из каждого товара
    category.products.forEach((product) => {
      // Получаем все уникальные цвета изображений товара
      product.images.forEach((image) => {
        if (image.color && !productColors.includes(image.color)) {
          productColors.push(image.color)
        }
      })

      // Получаем все уникальные размеры товара
      if (product.sizes) {
        product.sizes.forEach((size) => {
          if (size && !productSizes.includes(size)) {
            productSizes.push(size)
          }
        })
      }
    })

    // Собираем фильтры
    filters = {
      sizes: productSizes,
      colors: productColors,
    }

    return filters
  }

  async filterdProducts(dto?: QueryDTO) {
    const sorts = this.sortFilter(dto.sort)
    const filters = []
    if (dto.childsCategoryId)
      filters.push({ childsCategoryId: Number(dto.childsCategoryId) })
    if (dto.secondCategoryId)
      filters.push({ secondCategoryId: Number(dto.secondCategoryId) })
    if (dto.mainCategoryId)
      filters.push({ mainCategoryId: Number(dto.mainCategoryId) })
    if (dto.maxPrice || dto.maxPrice)
      filters.push(this.priceFilter(dto.minPrice, dto.maxPrice))
    if (dto.selectedColor)
      filters.push({ orderItem: { some: { color: dto.selectedColor } } })
    if (dto.selectedSize)
      filters.push({
        orderItem: { some: { sizes: { contains: dto.selectedSize } } },
      })
    const products = await this.prismaService.product.findMany({
      where: {
        AND: filters,
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
        gte: minPrice,
      }
    }

    if (maxPrice) {
      priceFilter = {
        ...priceFilter,
        lte: maxPrice,
      }
    }
    return {
      price: priceFilter,
    }
  }
}
