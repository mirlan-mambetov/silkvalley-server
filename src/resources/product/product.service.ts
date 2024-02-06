import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import slugify from 'slugify'
import { generateProductId } from 'src/helpers/generate.id'
import { IProduct } from 'src/interfaces/Product.interface'
import { PrismaService } from 'src/prisma.service'
import { CreateProductDTO } from './data-transfer/create.data.transfer'
import { UpdateProductDTO } from './data-transfer/update.data.transfer'
import { returnProductFields } from './objects/return.product.fields'

@Injectable()
export class ProductService {
  constructor(private readonly prismaSevice: PrismaService) {}

  /**
   *
   * @param dto
   * @param posterPath
   * @returns Созданный продукт (Товар)
   * @description Создание продукта (Товара)
   */
  async create(dto: CreateProductDTO) {
    try {
      const productData = this.savedFields<Prisma.ProductCreateInput>(dto)
      return await this.prismaSevice.product.create({
        data: productData,
      })
    } catch (err) {
      throw new BadRequestException()
    }
  }

  /**
   *
   * @param id Принмает параметром ID продукта
   * @param dto Входные данные для обновление продукта
   * @returns Обновленный продукт (Товар)
   */
  async update(id: number, dto: UpdateProductDTO) {
    await this.findOneById(id)
    const productData = this.savedFields<Prisma.ProductUpdateInput>(dto)
    return await this.prismaSevice.product.update({
      where: { id },
      data: productData,
    })
  }

  async delete() {}

  async findOneByAlias() {}

  async findOneById(id: number) {
    const product = await this.prismaSevice.product.findUnique({
      where: {
        id,
      },
      include: {
        specification: {
          include: {
            attribute: true,
          },
        },
      },
    })
    if (product) return product
    else throw new NotFoundException()
  }

  async findAll() {
    return await this.prismaSevice.product.findMany(returnProductFields)
  }

  async findSimilar() {}

  /**
   * @description Генерирует поля для создания или обновления продукта на основе входных данных.
   * @param dto Входные данные для создания или обновления продукта.
   * @returns Поля для создания или обновления продукта.
   */
  private savedFields<T>(dto: IProduct): T {
    const aliasName = dto.title
      ? slugify(dto.title, { lower: true, locale: 'eng' })
      : null
    const PRODUCT_ID = generateProductId()

    const fields: Prisma.ProductCreateInput | Prisma.ProductUpdateInput = {
      alias: aliasName || undefined,
      articleNumber: PRODUCT_ID || undefined,
      description: dto.description ? dto.description.trim() : undefined,
      poster: dto.poster ? dto.poster : undefined,
      price: dto.price ? +dto.price : undefined,
      subtitle: dto.subtitle ? dto.subtitle.trim().toLowerCase() : undefined,
      title: dto.title ? dto.title.trim() : undefined,
    }
    if (dto.discount !== undefined) fields.discount = dto.discount
    if (dto.isHit !== undefined) fields.isHit = dto.isHit
    if (dto.isNew !== undefined) fields.isNew = dto.isNew
    if (dto.rating !== undefined) fields.rating = dto.rating
    if (dto.video !== undefined) fields.video = dto.video

    return fields as T
  }
}
