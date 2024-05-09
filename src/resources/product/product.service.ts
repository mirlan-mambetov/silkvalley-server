import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { createSlugName } from 'src/helpers/create.slug-name'
import { generateProductId } from 'src/helpers/generate.id'
import { IProduct } from 'src/interfaces/Product.interface'
import { PrismaService } from 'src/prisma.service'
import { UploadService } from '../upload/upload.service'
import { CreateProductDTO } from './data-transfer/create.data.transfer'
import { UpdateProductDTO } from './data-transfer/update.data.transfer'
import { returnProductUniqueFields } from './objects/return.product.fields'

@Injectable()
export class ProductService {
  constructor(
    private readonly prismaSevice: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

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

      const data: any = {
        ...productData,
        category: {
          connect: { id: dto.categoryId },
        },
        secondCategory: {
          connect: { id: dto.secondCategoryId },
        },
      }
      if (dto.childsCategoryId) {
        data.childsCategory = { connect: { id: dto.childsCategoryId } }
      }
      await this.prismaSevice.product.create({
        data,
      })

      return {
        message: 'Товар успешно добавлен',
      }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  /**
   *
   * @param id Принмает параметром ID продукта
   * @param dto Входные данные для обновление продукта
   * @returns Обновленный продукт (Товар)
   */
  async update(id: number, dto: UpdateProductDTO) {
    try {
      await this.findOneById(id)
      const productData = this.savedFields<Prisma.ProductUpdateInput>(dto)
      await this.prismaSevice.product.update({
        where: { id },
        data: productData,
      })
      return {
        message: 'Товар успешно обновлен',
      }
    } catch (err) {
      throw new InternalServerErrorException(new BadRequestException(err))
    }
  }

  /**
   *
   * @param alias Вывод продукта по [alias]
   * @returns Возвращает один продукт, если найден
   */
  async findOneByAlias(alias: string) {
    try {
      const product = await this.prismaSevice.product.findUnique({
        where: { alias },
        ...returnProductUniqueFields,
      })

      if (!product)
        throw new NotFoundException(`Продук по такому "${alias}" не найден`)
      return product
    } catch (error) {
      throw new NotFoundException(error.response)
    }
  }

  /**
   *
   * @param alias Вывод продукта по [id]
   * @returns Возвращает один продукт, если найден
   */
  async findOneById(id: number) {
    try {
      const product = await this.prismaSevice.product.findUnique({
        where: {
          id,
        },
        include: {
          attributes: true,
          category: { select: { name: true } },
          secondCategory: { select: { name: true } },
          childsCategory: { select: { name: true } },
        },
      })
      if (!product)
        throw new BadRequestException('Продукт по такому ID не найден')
      return product
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async findByCategorySlug(
    mainCategorySlug?: string,
    secondCategorySlug?: string,
  ) {
    let whereCondition = {}
    if (mainCategorySlug) {
      whereCondition = {
        mainCategory: {
          slug: mainCategorySlug,
        },
      }
    } else if (secondCategorySlug) {
      whereCondition = {
        secondCategory: {
          slug: secondCategorySlug,
        },
      }
    }
    const products = await this.prismaSevice.product.findMany({
      where: whereCondition,
    })
    return products
  }

  /**
   *
   * @returns
   */
  async findAll() {
    return await this.prismaSevice.product.findMany({
      include: {
        attributes: true,
      },
    })
  }

  async findSimilar() {}

  /**
   * @description Генерирует поля для создания или обновления продукта на основе входных данных.
   * @param dto Входные данные для создания или обновления продукта.
   * @returns Поля для создания или обновления продукта.
   */
  private savedFields<T>(dto: IProduct): T {
    const aliasName = createSlugName(dto.title)
    const PRODUCT_ID = generateProductId(2)
    const ALIAS_ID = generateProductId(3)

    const fields: Prisma.ProductCreateInput | Prisma.ProductUpdateInput = {
      alias: `${aliasName}-${ALIAS_ID}` || undefined,
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
    if (dto.quantity !== undefined) fields.quantity = dto.quantity

    return fields as T
  }

  /**
   *
   * @param id
   * @returns
   */
  async delete(id: number) {
    try {
      const product = await this.findOneById(id)

      // DELETE PRODUCT POSTER
      await this.uploadService.deleteFile(product.poster)

      await this.prismaSevice.orderItem.deleteMany({
        where: {
          productId: product.id,
        },
      })

      // DELETE PRODUCT
      await this.prismaSevice.product.delete({
        where: { id },
      })
      return {
        message: `Товар ${product.title} удален! `,
      }
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }
}
