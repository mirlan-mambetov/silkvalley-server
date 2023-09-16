import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import Slugify from 'slugify'
import { PrismaService } from 'src/prisma.service'
import { MESSAGE_PRODUCT_FOUND } from './constants/message.constants'
import { RETURN_PRODUCT_FIELDS } from './constants/return.product.fields'
import { CreateProductDTO } from './dto/create.product.dto'
import { UpdateProductDTO } from './dto/update.product.dto'

@Injectable()
export class ProductsService {
  constructor(private readonly Prisma: PrismaService) {}

  /**
   * @returns ALL PRODUCTS
   */
  async getAllProducts() {
    try {
      return await this.Prisma.products.findMany({
        include: { ...RETURN_PRODUCT_FIELDS },
      })
    } catch (err) {
      throw new NotFoundException('Товары в базе данных отсуствуют')
    }
  }

  /**
   * @param id
   * @returns Product
   */
  async getProducById(id: number) {
    const product = await this.Prisma.products.findUnique({
      where: { id },
      include: RETURN_PRODUCT_FIELDS,
    })
    if (!product)
      throw new NotFoundException('Продукт по такому идентификатору не найден')
    return product
  }

  /**
   * @param slug
   * @returns Product
   */
  async getProductBySlug(slug: string) {
    const product = await this.Prisma.products.findUnique({
      where: { slug },
      include: RETURN_PRODUCT_FIELDS,
    })
    if (!product)
      throw new NotFoundException('Продукт по такому SLUG не найден')
    return product
  }

  /**
   * @param dto CreateProductDTO
   * @returns Product
   * @description Create product
   */
  async createProduct(dto: CreateProductDTO) {
    const { description, poster, brand, price, title } = dto

    // GENERATE SLUG FOR PRODUCT
    const slugName = Slugify(title, {
      lower: true,
      trim: true,
    })

    // CHECK ISALREADY PRODUCT IN DATABASE
    const isExist = await this.Prisma.products.findUnique({ where: { title } })

    // // IF EXIST ON DATA BASE
    if (isExist) throw new BadRequestException(MESSAGE_PRODUCT_FOUND)

    // ELSE CREATE PRODUCT
    const product = await this.Prisma.products.create({
      data: {
        title,
        slug: slugName,
        description,
        poster,
        price,
        brand,
      },
    })
    return product
  }

  /**
   * @param id
   * @param dto
   * @param imgId
   * @returns Created Product
   */
  async updateProduct(id: number, dto: UpdateProductDTO) {
    try {
      const {
        brand,
        description,
        discount,
        poster,
        price,
        rating,
        title,
        video,
      } = dto
      await this.getProducById(id)
      return await this.Prisma.products.update({
        where: { id },
        data: {
          title,
          description,
          discount,
          brand,
          price,
          rating,
          poster,
          video,
        },
      })
    } catch (err) {
      console.log(err)
    }
  }
  async deleteProduct(id: number) {
    return await this.Prisma.products.delete({ where: { id } })
  }
}
