import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import slugify from 'slugify'
import { generateProductId } from 'src/helpers/generate.id'
import { IProduct } from 'src/interfaces/Product.interface'
import { PrismaService } from 'src/prisma.service'
import { UploadService } from '../upload/upload.service'
import { CreateProductDTO } from './data-transfer/create.data.transfer'
import { UpdateProductDTO } from './data-transfer/update.data.transfer'
import {
  returnProductFields,
  returnProductUniqueFields,
} from './objects/return.product.fields'

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
      await this.prismaSevice.product.createMany({
        data: {
          ...productData,
          mainCategoryId: dto.mainCategoryId,
          secondCategoryId: dto.childCategoryId,
        },
      })
      return {
        message: 'Товар успешно добавлен',
      }
    } catch (err) {
      throw new BadRequestException(err)
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
      await this.prismaSevice.product.updateMany({
        where: { id },
        data: {
          ...productData,
          mainCategoryId: Number(dto.mainCategoryId) || undefined,
          secondCategoryId: Number(dto.childCategoryId) || undefined,
        },
      })
      return {
        message: 'Товар успешно обновлен',
      }
    } catch (err) {
      throw new InternalServerErrorException(new BadRequestException(err))
    }
  }

  async delete(id: number) {
    const product = await this.findOneById(id)
    const specifications =
      await this.prismaSevice.productSpecification.findMany({
        where: { productId: id },
      })
    await this.uploadService.deleteFile(product.poster)

    for (const specification of specifications) {
      await this.prismaSevice.productattribute.deleteMany({
        where: { specificationId: specification.id },
      })
    }
    await this.prismaSevice.productSpecification.deleteMany({
      where: { productId: id },
    })
    await this.prismaSevice.product.delete({
      where: { id },
    })
    return {
      message: `Товар ${product.title} удален! `,
    }
  }

  /**
   *
   * @param alias Вывод продукта по [alias]
   * @returns Возвращает один продукт, если найден
   */
  async findOneByAlias(alias: string) {
    const product = await this.prismaSevice.product.findUnique({
      where: { alias },
      ...returnProductUniqueFields,
    })

    if (!product)
      throw new BadRequestException(`Продук по такому "${alias}" не найден`)
    return product
  }

  /**
   *
   * @param alias Вывод продукта по [id]
   * @returns Возвращает один продукт, если найден
   */
  async findOneById(id: number) {
    const product = await this.prismaSevice.product.findUnique({
      where: {
        id,
      },
      include: { specifications: { include: { attributes: true } } },
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
    const PRODUCT_ID = generateProductId(5)
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

    return fields as T
  }
}
