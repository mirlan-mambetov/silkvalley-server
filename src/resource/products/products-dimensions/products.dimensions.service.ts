import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { ProductsService } from '../products.service'
import { productDimensionsDTO } from './dto/product.dimensions.dto'

@Injectable()
export class ProductsDimensionsService {
  constructor(
    private readonly Prisma: PrismaService,
    private readonly productsService: ProductsService,
  ) {}

  async create(productId: number, dto: productDimensionsDTO) {
    const product = await this.productsService.getProducById(productId)
    const isExist = await this.Prisma.productDimensions.findUnique({
      where: { productsId: productId },
    })

    if (isExist) throw new BadRequestException('Информация уже существует')

    return await this.Prisma.productDimensions.create({
      data: {
        ...dto,
        productsId: product.id,
      },
    })
  }

  async update(id: number, dto: productDimensionsDTO) {
    const isExist = await this.Prisma.productDimensions.findUnique({
      where: { id },
    })

    if (!isExist) throw new BadRequestException('Информация не существует')

    return await this.Prisma.productDimensions.update({
      where: { id },
      data: {
        ...dto,
      },
    })
  }
}
