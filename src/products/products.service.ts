import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { generateSlug } from 'utils/generate-slug'
import { CreateProductDTO } from './dto/create.product.dto'

@Injectable()
export class ProductsService {
  constructor(private readonly Prisma: PrismaService) {}

  /**
   * @returns ALL PRODUCTS
   */
  async getAllProducts() {
    try {
      return await this.Prisma.products.findMany({
        include: {
          attributes: true,
          images: {
            select: {
              color: true,
              images: true,
              productId: true,
            },
          },
        },
      })
    } catch (err) {
      throw new NotFoundException('Товары в базе данных отсуствуют')
    }
  }

  /**
   * @param dto CreateProductDTO
   * @returns Product
   * @description Create product
   */
  async createProduct(dto: CreateProductDTO) {
    const { description, images, attributes, poster, price, title } = dto

    // GENERATE SLUG FOR PRODUCT
    const { cleanedName } = generateSlug(title)

    // CHECK ISALREADY PRODUCT IN DATABASE
    const isExist = await this.Prisma.products.findUnique({ where: { title } })

    // IF EXIST ON DATA BASE
    if (isExist) throw new BadRequestException('Данный товар уже существует')

    // ELSE CREATE PRODUCT
    const product = await this.Prisma.products.create({
      data: {
        description,
        poster,
        price,
        slug: cleanedName,
        images: {
          create: {
            color: images.color,
            images: images.images,
          },
        },
        title,
        attributes: {
          create: {
            colors: attributes.colors,
            sizes: attributes.sizes,
          },
        },
      },
    })
    return product
  }

  // GET PRODUCT BY ID
  async getProducById(id: number) {
    try {
      const product = await this.Prisma.products.findUnique({ where: { id } })
      return product
    } catch (err) {
      throw new NotFoundException('Продукт по такому идентификатору не найден')
    }
  }
}
