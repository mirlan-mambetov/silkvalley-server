import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CreateProductImagesDto } from '../dto/create.productImages.dto'
import { ProductsService } from '../products.service'

@Injectable()
export class ProductsImagesService {
  constructor(
    private readonly Prisma: PrismaService,
    private readonly productService: ProductsService,
  ) {}

  /**
   *
   * @param productId
   * @param dto
   * @returns CREATED PRODUCT IMAGE
   */
  async create(productId: number, dto: CreateProductImagesDto) {
    const product = await this.productService.getProducById(+productId)
    const images = await this.Prisma.productImages.create({
      data: {
        productId: product.id,
        color: dto.color,
        images: dto.images,
      },
    })
    return images
  }

  /**
   * @param id
   * @param dto
   * @returns Product
   */
  async update(id: number, dto: CreateProductImagesDto) {
    const image = await this.Prisma.productImages.findUnique({ where: { id } })
    if (!image)
      throw new NotFoundException('Аттрибут картинки по такому ID не найден')
    return await this.Prisma.productImages.update({
      where: {
        id,
      },
      data: {
        color: dto.color,
        images: dto.images,
      },
    })
  }
}
