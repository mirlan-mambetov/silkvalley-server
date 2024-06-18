import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { Prisma, Product, ProductVariant } from '@prisma/client'
import { createSlugName } from 'src/helpers/create.slug-name'
import { generateProductId } from 'src/helpers/generate.id'
import { IProduct } from 'src/interfaces/Product.interface'
import { PrismaService } from 'src/prisma.service'
import { generateSlug } from 'utils/generate-slug'
import { UploadService } from '../upload/upload.service'
import { CreateProductDto } from './data-transfer/create.data.transfer'
import { CreateProductVariantDto } from './data-transfer/product-variant.dto'
import { UpdateProductVariantDto } from './data-transfer/product-variant.update.dto'
import { UpdateProductDto } from './data-transfer/update.data.transfer'

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
  async create(dto: CreateProductDto) {
    try {
      const slugName = generateSlug(dto.title)
      return await this.prismaSevice.product.create({
        data: {
          ...dto,
          slug: slugName,
        },
      })
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  /**
   *
   * @param id
   * @param dto
   * @returns
   */
  async update(id: number, dto: UpdateProductDto) {
    try {
      let slugName: string
      if (dto.title) {
        slugName = generateSlug(dto.title)
      }
      return await this.prismaSevice.product.update({
        where: {
          id,
        },
        data: {
          ...dto,
          slug: slugName,
        },
      })
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  /**
   *
   * @returns ALL PRODUCTS
   */
  async getAllProducts(): Promise<Product[]> {
    return await this.prismaSevice.product.findMany({
      include: {
        variants: {
          include: {
            color: true,
            specifications: true,
          },
        },
        category: true,
      },
    })
  }

  /**
   * @description CREATE VARIANT TO PRODUCT
   * @param dto
   * @returns
   */
  async createProductVariant(dto: CreateProductVariantDto) {
    const articleNumber = generateProductId()
    return await this.prismaSevice.productVariant.create({
      data: {
        ...dto,
        articleNumber,
        color: {
          create: dto.color,
        },
        specifications: {
          create: dto.specifications,
        },
      },
    })
  }

  /**
   *
   * @param variantId
   * @param dto
   * @returns
   */
  async updateProductVariant(variantId: number, dto: UpdateProductVariantDto) {
    return await this.prismaSevice.productVariant.update({
      where: { id: variantId },
      data: {
        ...dto,
        color: dto.color
          ? {
              update: {
                where: { id: dto.colorId },
                data: dto.color,
              },
            }
          : undefined,
        specifications: dto.specifications
          ? {
              update: {
                where: {
                  id: dto.specificationId,
                },
                data: dto.specifications,
              },
            }
          : undefined,
      },
    })
  }

  /**
   *
   * @param productId
   * @returns
   */
  async getProductVariant(productId: number): Promise<ProductVariant[]> {
    return this.prismaSevice.productVariant.findMany({
      where: { productId },
    })
  }

  /**
   *
   * @param alias Вывод продукта по [alias]
   * @returns Возвращает один продукт, если найден
   */
  async findOneByAlias(alias: string) {
    // try {
    //   const product = await this.prismaSevice.product.findUnique({
    //     where: { alias },
    //     ...returnProductUniqueFields,
    //   })
    //   if (!product)
    //     throw new NotFoundException(`Продук по такому "${alias}" не найден`)
    //   return product
    // } catch (error) {
    //   throw new NotFoundException(error.response)
    // }
  }

  /**
   *
   * @param alias Вывод продукта по [id]
   * @returns Возвращает один продукт, если найден
   */
  async findOneById(id: number) {
    // try {
    //   const product = await this.prismaSevice.product.findUnique({
    //     where: {
    //       id,
    //     },
    //     include: {
    //       attributes: true,
    //       category: { select: { name: true } },
    //       // secondCategory: { select: { name: true } },
    //       // childsCategory: { select: { name: true } },
    //     },
    //   })
    //   if (!product)
    //     throw new BadRequestException('Продукт по такому ID не найден')
    //   return product
    // } catch (error) {
    //   throw new InternalServerErrorException(error)
    // }
  }

  async findByCategorySlug(
    mainCategorySlug?: string,
    secondCategorySlug?: string,
  ) {
    // let whereCondition = {}
    // if (mainCategorySlug) {
    //   whereCondition = {
    //     mainCategory: {
    //       slug: mainCategorySlug,
    //     },
    //   }
    // } else if (secondCategorySlug) {
    //   whereCondition = {
    //     secondCategory: {
    //       slug: secondCategorySlug,
    //     },
    //   }
    // }
    // const products = await this.prismaSevice.product.findMany({
    //   where: whereCondition,
    // })
    // return products
  }

  /**
   *
   * @returns
   */
  async findAll() {
    // return await this.prismaSevice.product.findMany({
    //   include: {
    //     attributes: true,
    //   },
    // })
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
      // alias: `${aliasName}-${ALIAS_ID}` || undefined,
      // articleNumber: PRODUCT_ID || undefined,
      // description: dto.description ? dto.description.trim() : undefined,
      // poster: dto.poster ? dto.poster : undefined,
      // price: dto.price ? +dto.price : undefined,
      // subtitle: dto.subtitle ? dto.subtitle.trim().toLowerCase() : undefined,
      // title: dto.title ? dto.title.trim() : undefined,
    }
    // if (dto.discount !== undefined) fields.discount = dto.discount
    // if (dto.isHit !== undefined) fields.isHit = dto.isHit
    // if (dto.isNew !== undefined) fields.isNew = dto.isNew
    // if (dto.rating !== undefined) fields.rating = dto.rating
    // if (dto.video !== undefined) fields.video = dto.video
    // if (dto.quantity !== undefined) fields.quantity = dto.quantity

    return fields as T
  }

  /**
   *
   * @param id
   * @returns
   */
  async delete(id: number) {
    try {
      // const product = await this.findOneById(id)
      // // DELETE PRODUCT POSTER
      // await this.uploadService.deleteFile(product.poster)
      // await this.prismaSevice.orderItem.deleteMany({
      //   where: {
      //     productId: product.id,
      //   },
      // })
      // // DELETE PRODUCT
      // await this.prismaSevice.product.delete({
      //   where: { id },
      // })
      // return {
      //   message: `Товар ${product.title} удален! `,
      // }
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }
}
