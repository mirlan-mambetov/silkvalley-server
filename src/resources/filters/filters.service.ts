import { Injectable } from '@nestjs/common'
import { EnumProductSort } from 'src/enums/Filter.enum'
import { PrismaService } from 'src/prisma.service'
import { QueryDTO } from '../data-transfer/query.dto'
import { ProductService } from '../product/product.service'

@Injectable()
export class FilterService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly productService: ProductService,
  ) {}

  async productAttributes(slug: string) {}

  async filterProducts(dto?: QueryDTO) {
    // if (dto.selectedSize)
    //   filters.push({
    //     attributes: { some: { size: { contains: dto.selectedSize } } },
    //   })
    // const products = await this.prismaService.product.findMany({
    //   where: {
    //     AND: filters,
    //     attributes: {
    //       some: {
    //         size: {
    //           equals: dto.selectedSize,
    //         },
    //       },
    //     },
    //   },
    //   orderBy: sorts,
    // })
    // return products
  }

  private sortFilter(sort: EnumProductSort) {
    // switch (sort) {
    //   case EnumProductSort.LOW_PRICE:
    //     return [{ price: 'desc' }]
    //   case EnumProductSort.HIGH_PRICE:
    //     return [{ price: 'asc' }]
    //   case EnumProductSort.NEWEST:
    //     return [{ createdAt: 'asc' }]
    //   case EnumProductSort.OLDEST:
    //     return [{ createdAt: 'desc' }]
    // }
  }

  private priceFilter(minPrice?: number, maxPrice?: number) {}
}
