import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { ProductService } from '../product/product.service'
import { CreateProductImageDTO } from './data-transfer/create.data.transfer'
import { UpdateProductImageDTO } from './data-transfer/update.data.transfer'

@Injectable()
export class ProductImageService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly productService: ProductService,
  ) {}

  async create(productId: number, dto: CreateProductImageDTO) {
    try {
      const product = await this.productService.findOneById(productId)
      await this.prismaService.productImage.create({
        data: {
          ...dto,
          productId: product.id,
        },
      })
      return {
        message: 'Изображения успешно добавлены!',
      }
    } catch (err) {
      throw new InternalServerErrorException(err)
    }
  }

  async update(id: number, dto: UpdateProductImageDTO) {
    try {
      await this.findImageById(id)
      await this.prismaService.productImage.update({
        where: { id },
        data: {
          ...dto,
        },
      })
      return {
        message: 'Изображения успешно обновлены!',
      }
    } catch (err) {
      throw new InternalServerErrorException(err)
    }
  }

  async findImageById(id: number) {
    try {
      const image = await this.prismaService.productImage.findUnique({
        where: { id },
      })
      if (!image)
        throw new BadRequestException('Изображения по такому ID не найдены')
      return image
    } catch (err) {
      throw new InternalServerErrorException(err)
    }
  }

  async findImageByProductId(productId: number) {
    try {
      const image = await this.prismaService.productImage.findMany({
        where: {
          productId,
        },
      })
      if (!image)
        throw new BadRequestException('Изображения по такому ID не найдены')
      return image
    } catch (err) {
      throw new InternalServerErrorException(err)
    }
  }

  async findAllImages() {
    try {
      const image = await this.prismaService.productImage.findMany()
      if (!image) throw new BadRequestException('В Базе нету изображений')
      return image
    } catch (err) {
      throw new InternalServerErrorException(err)
    }
  }
}
