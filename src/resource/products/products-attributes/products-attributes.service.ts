import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CreateProductAttributesDto } from '../dto/create.productAttributes.dto'
import { ProductsService } from '../products.service'

@Injectable()
export class ProductsAttributesService {
  constructor(
    private readonly Prisma: PrismaService,
    private readonly productService: ProductsService,
  ) {}

  // CREATE
  async create(productId: number, dto: CreateProductAttributesDto) {
    const product = await this.productService.getProducById(+productId)
    return await this.Prisma.productAttributes.create({
      data: {
        ...dto,
        productId: product.id,
      },
    })
  }

  async update(id: number, dto: CreateProductAttributesDto) {
    const attribute = await this.Prisma.productAttributes.findUnique({
      where: { id },
    })
    if (!attribute)
      throw new NotFoundException('Аттрибут не найден по такому ID')
    return await this.Prisma.productAttributes.update({
      where: { id },
      data: {
        ...dto,
      },
    })
  }
}
