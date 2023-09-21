import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CreateProductAttributesDto } from '../dto/create.productAttributes.dto'
import { ProductsService } from '../products.service'

@Injectable()
export class ProductsAttributesService {
  constructor(
    private readonly Prisma: PrismaService,
    private readonly productService: ProductsService,
  ) {}

  async findById(id: number) {
    const attribute = await this.Prisma.productAttributes.findUnique({
      where: { id },
    })
    if (!attribute)
      throw new BadRequestException('Аттрибут по такому ID не найден')
    return attribute
  }

  // CREATE
  async create(productId: number, dto: CreateProductAttributesDto) {
    try {
      const product = await this.productService.getProducById(+productId)
      if (!product.attributes.length) {
        await this.Prisma.productAttributes.create({
          data: {
            ...dto,
            productId: product.id,
          },
        })
      } else {
        await this.Prisma.productAttributes.updateMany({
          where: { productId: product.id },
          data: { ...dto },
        })
      }
    } catch (err) {
      throw new InternalServerErrorException(err)
    }
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
