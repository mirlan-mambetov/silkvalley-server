import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CreateProductImagesDto } from '../dto/create.productImages.dto'
import { ProductsService } from '../products.service'

@Injectable()
export class ProductsImagesService {
  constructor(
    private readonly prismaSevice: PrismaService,
    private readonly productService: ProductsService,
  ) {}

  /**
   * @param id
   * @returns Product Images
   */
  async getById(id: number) {
    const images = await this.prismaSevice.productImages.findUnique({
      where: { id },
    })
    if (!images)
      throw new NotFoundException('Изображения по такому ID не найдены')
    return images
  }

  /**
   * @param color
   * @returns Product Images by color
   */
  async findWithColor(productId: number, color: string) {
    try {
      const images = await this.prismaSevice.productImages.findMany({
        where: {
          productId: Number(productId),
          AND: {
            color: color,
          },
        },
      })
      if (!images)
        throw new BadRequestException('По такому цвету не нашлись изображения')
      return images
    } catch (err) {
      throw new InternalServerErrorException(err)
    }
  }

  /**
   *
   * @param productId
   * @param dto
   * @returns CREATED PRODUCT IMAGE
   */
  async create(productId: number, dto: CreateProductImagesDto) {
    const product = await this.productService.getProducById(+productId)
    const images = await this.prismaSevice.productImages.create({
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
    const image = await this.prismaSevice.productImages.findUnique({
      where: { id },
    })
    if (!image)
      throw new NotFoundException('Аттрибут картинки по такому ID не найден')
    return await this.prismaSevice.productImages.update({
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